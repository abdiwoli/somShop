/* eslint-disable */
import { ObjectId } from 'mongodb';
import path from 'path';
import Queue from 'bull';
import fs from 'fs';
import Helper from './utils';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const { v4: uuidv4 } = require('uuid');

class Product {
  /**
   * Fetches files from the database. If a category name is provided in the query,
   * returns files from that category's collection. Otherwise, fetches files from all collections,
   * processes the file paths, and returns the modified files.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} JSON array of files.
   */
  static async getFiles(req, res) {
    try {
      const categoryName = req.query.name;

      if (categoryName) {
        const collection = await dbClient.client.db().collection(categoryName);
        const files = await collection.find({}).toArray();
        return res.status(200).json(files);
      }
      const collections = await dbClient.client.db().listCollections().toArray();
      let allFiles = [];

      for (const collection of collections) {
        if (collection.name === 'files') {
          const col = await dbClient.client.db().collection(collection.name);
          const files = await col.find({}).toArray();
          let tmp;
          const modifiedFiles = files.map((file) => {
            if (file.localPath) {
              tmp = file.localPath;
              file.localPath = tmp.replace(/\\/g, '/');
              file.image = file.localPath.split('/').pop();
              if (!file.images) {
                file.images = [file.image, file.image, file.image];
              }
            }
            return file;
          });
          allFiles = allFiles.concat(modifiedFiles);
        }
      }
      return res.status(200).json(allFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Checks if the authenticated user is the owner of the product specified in the request.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} JSON object indicating ownership status.
   */
  static async isOwner(req, res) {
    try {
      const product = await Product.findProduct(req);
      if (product) res.status(200).json({ owner: true });
      else {
        res.status(200).json({ owner: false });
      }
    } catch (err) {
      res.status(200).json({ owner: false });
    }
  }

  /**
   * Finds a product in the 'files' collection using the product ID from the request parameters.
   *
   * @param {Object} req - The request object.
   * @returns {Object} The product document if found.
   */
  static async findProduct(req) {
    const token = req.headers['x-token'];
    const itemId = req.params.id;
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    const collection = await dbClient.client.db().collection('files');
    const product = await collection.findOne({ _id: new ObjectId(itemId) });
    return product;
  }

  /**
   * Deletes a product from the 'files' collection. The user must be authenticated and authorized
   * to delete the product.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} JSON object with the deletion status.
   */
  static async deleteProduct(req, res) {
    const item = await Product.findProduct(req);
    if (item) {
      if (!req.user && (req.user && !req.user.admin) && req.user._id !== item.userId) {
        return res.status(401).json({ error: 'unauthorized' });
      }
      const collection = await dbClient.client.db().collection('files');
      try {
        const result = await collection.deleteOne({ _id: new ObjectId(item._id) });
        return res.status(200).json({ status: result });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ status: 'not deleted' });
      }
    }
    res.status(404).json({ status: 'not deleted' });
  }

  /**
   * Updates a product's details. Handles file uploads and stores them on the server.
   * The user must be authenticated and authorized to update the product.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} JSON object with the updated product details.
   */
  static async updateProduct(req, res) {
    const {
      name,
      prevPrice,
      price,
      type,
      parentId = '0',
      isPublic = false,
      data,
      mimeType,
      catagory,
      description,
    } = req.body;

    const { id: productId } = req.params;
    const files = await dbClient.client.db().collection('files');
    const folderPath = process.env.FOLDER_PATH || '../uploads';
    const FOLDER_PATH = path.resolve(__dirname, folderPath);

    if (!fs.existsSync(FOLDER_PATH)) {
      fs.mkdirSync(FOLDER_PATH, { recursive: true });
    }

    const file = await Product.findProduct(req);
    if (!req.user && (req.user && !req.user.admin) && req.user._id !== file.userId) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    let filePath;
    let fileId;

    if (file && !file.image) {
      if (file.localPath) {
        if (fs.existsSync(file.localPath)) {
          fs.unlinkSync(file.localPath);
        }
      }
    }

    if (type === 'image' && data) {
      fileId = `${uuidv4()}.${mimeType.split('/')[1]}`;
      filePath = path.join(FOLDER_PATH, fileId);
    } else if (type !== 'image') {
      fileId = uuidv4();
      filePath = path.join(FOLDER_PATH, fileId);
    } else {
      filePath = file.localPath;
    }

    if (data) {
      const fileData = Buffer.from(data, 'base64');
      fs.writeFileSync(filePath, fileData);
    }
    const updateDoc = {
      name,
      price,
      prevPrice,
      catagory,
      type,
      isPublic,
      parentId,
      localPath: filePath,
      description,
      image: fileId || file.image,
    };

    try {
      const result = file
        ? await files.updateOne({ _id: new ObjectId(productId) }, { $set: updateDoc })
        : await files.insertOne(updateDoc);

      if (result.modifiedCount > 0 || result.insertedId) {
        const updatedFile = await files.findOne({ _id: new ObjectId(productId) });
        const editedFile = Helper.fileToReturn(updatedFile);

        if (editedFile.type === 'image') {
          const fileQueue = new Queue('fileQueue');
          fileQueue.add({ userId: editedFile.userId, fileId: editedFile.id });
        }

        return res.status(200).json(editedFile);
      }

      return res.status(404).json({ error: 'Update failed' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while updating the product' });
    }
  }

  /**
   * Deletes an image from a product's image array by index.
   * The user must be authenticated and authorized to delete the image.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} JSON object with the deletion status and updated images array.
   */
  static async deleteImage(req, res) {
    const itemId = req.params.id;
    const index = parseInt(req.params.index, 10);
    const collection = await dbClient.client.db().collection('files');

    try {
      const product = await Product.findProduct(req);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (!req.user && (req.user && !req.user.admin) && req.user._id !== product.userId) {
        return res.status(401).json({ error: 'unauthorized' });
      }
      const images = product.images || [];
      if (index > -1 && index < images.length) {
        images.splice(index, 1);
        await collection.updateOne(
          { _id: new ObjectId(itemId) },
          { $set: { images } },
        );
        return res.status(200).json({ message: 'Image deleted successfully', images });
      }
      console.log({ error: product });
      return res.status(400).json({ error: 'Invalid index' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while deleting the image' });
    }
  }

  /**
 * Adds an additional image to a product's image array. The image is saved to the server
 * and its path is added to the product's `images` field in the database. The user must be
 * authenticated and authorized to add the image.
 *
 * @param {Object} req - The request object containing parameters and body data.
 * @param {Object} res - The response object used to send the response.
 *
 * @param {Object} req.params - The URL parameters.
 * @param {string} req.params.id - The ID of the product to which the image will be added.
 *
 * @param {Object} req.body - The request body containing the image data.
 * @param {string} req.body.mimeType - The MIME type of the image.
 * @param {string} req.body.data - The base64-encoded image data.
 *
 * @returns {Object} - A JSON object with the status of the operation.
 *
 * @throws {Error} - If the product is not found, or if there is an issue with the database operation.
 *
 * @example
 * // Request body example:
 * {
 *   "mimeType": "image/jpeg",
 *   "data": "/9j/4AAQSkZJRgABAQEAAAA..."
 * }
 *
 * // Response example:
 * {
 *   "status": "updated"
 * }
 */
  static async AddAdditionalImage(req, res) {
    const { folderPath = '../uploads' } = process.env;
    const FOLDER_PATH = path.resolve(__dirname, folderPath);
    const { mimeType, data } = req.body;
    const fileId = uuidv4();
    const ext = mimeType.split('/')[1];
    const filePath = path.join(FOLDER_PATH, `${fileId}.${ext}`);

    try {
      const itemId = req.params.id;
      const collection = await dbClient.client.db().collection('files');
      const product = await Product.findProduct(req);
      if (!req.user && (req.user && !req.user.admin) && req.user._id !== product.userId) {
        return res.status(401).json({ error: 'unauthorized' });
      }

      if (product && data) {
        const fileData = Buffer.from(data, 'base64');
        fs.writeFileSync(filePath, fileData);

        const images = product.images || [];
        images.push(`${fileId}.${ext}`);

        await collection.updateOne(
          { _id: new ObjectId(itemId) },
          { $set: { images } },
        );

        return res.status(200).json({ status: 'updated' });
      }
      return res.status(404).json({ status: 'not found' });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /**
 * Retrieves the most recent files from the database, sorted by their creation date in descending order.
 * This method returns the four most recent files.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Object[]} - A JSON array of the four most recent files.
 *
 * @throws {Error} - If there is an issue with the database query.
 *
 * @example
 * // Example response:
 * [
 *   {
 *     "_id": "64b0e7f870b5671a69a8b12a",
 *     "name": "New Product Launch",
 *     "price": 49.99,
 *     "prevPrice": 69.99,
 *     "catagory": "Launch",
 *     "type": "image",
 *     "isPublic": true,
 *     "parentId": "0",
 *     "localPath": "/uploads/newproduct.jpg",
 *     "image": "newproduct.jpg",
 *     "description": "Image for the new product launch"
 *   },
 *   {
 *     "_id": "64b0e7f870b5671a69a8b129",
 *     "name": "Holiday Special",
 *     "price": 39.99,
 *     "prevPrice": 59.99,
 *     "catagory": "Holiday",
 *     "type": "image",
 *     "isPublic": true,
 *     "parentId": "0",
 *     "localPath": "/uploads/holidayspecial.jpg",
 *     "image": "holidayspecial.jpg",
 *     "description": "Holiday special offer image"
 *   }
 *   // ...two more recent files
 * ]
 */
  static async Latets(req, res) {
    const collection = await dbClient.client.db().collection('files');
    const files = await collection.find({}).sort({ _id: -1 }).limit(4).toArray();
    const latest = files.map((file) => {
      file.localPath = file.localPath.replace(/\\/g, '/');
      file.image = file.localPath.split('/').pop();
      return file;
    });
    return res.status(200).json(latest);
  }

  /**
 * Retrieves the latest files from the database, grouped by category, and returns the most recent file
 * from each category. This method identifies the latest file within each category based on the
 * collection's sort order.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Object[]} - A JSON array of the most recent file from each category.
 *
 * @throws {Error} - If there is an issue with the database query.
 *
 * @example
 * // Example response:
 * [
 *   {
 *     "_id": "64b0e7f870b5671a69a8b12b",
 *     "name": "Summer Sale",
 *     "price": 29.99,
 *     "prevPrice": 49.99,
 *     "catagory": "Sale",
 *     "type": "image",
 *     "isPublic": true,
 *     "parentId": "0",
 *     "localPath": "/uploads/abc123.jpg",
 *     "image": "abc123.jpg",
 *     "description": "A special summer sale image"
 *   },
 *   {
 *     "_id": "64b0e7f870b5671a69a8b12c",
 *     "name": "New Arrival",
 *     "price": 19.99,
 *     "prevPrice": 25.99,
 *     "catagory": "New",
 *     "type": "image",
 *     "isPublic": true,
 *     "parentId": "0",
 *     "localPath": "/uploads/xyz456.jpg",
 *     "image": "xyz456.jpg",
 *     "description": "A new arrival image"
 *   }
 * ]
 */
  static async Trending(req, res) {
    try {
      const collection = await dbClient.client.db().collection('files');
      const files = await collection.aggregate([
        {
          $group: {
            _id: '$catagory',
            file: { $last: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$file' },
        },
      ]).toArray();

      const trending = files.map((file) => {
        file.localPath = file.localPath.replace(/\\/g, '/');
        file.image = file.localPath.split('/').pop();
        return file;
      });

      res.json(trending);
    } catch (error) {
      console.error('Error fetching trending files:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async SpecialDeals(req, res) {
    try {
      const collection = await dbClient.client.db().collection('files');
      const products = await collection.find({}).toArray();
      const sortedProducts = products.sort((a, b) => a.price - b.price);
      const deals = sortedProducts.slice(0, 4);
      const dformated = deals.map((file) => {
        file.localPath = file.localPath.replace(/\\/g, '/');
        file.image = file.localPath.split('/').pop();
        return file;
      });
      res.status(200).json(dformated);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

export default Product;
