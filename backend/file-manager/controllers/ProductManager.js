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

  static async findProduct(req) {
    const token = req.headers['x-token'];
    const itemId = req.params.id;
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    const collection = await dbClient.client.db().collection('files');
    const product = await collection.findOne({ _id: new ObjectId(itemId) });
    return product;
  }

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
}

export default Product;
