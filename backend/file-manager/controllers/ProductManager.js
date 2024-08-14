/* eslint-disable */
import { ObjectId } from 'mongodb';
const { v4: uuidv4 } = require('uuid');

import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import mime from 'mime-types';
import Queue from 'bull';
import Helper from './utils';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class Product {

    static async getFiles(req, res) {      
        try {
          // Access query parameter 'name'
          const categoryName = req.query.name;
      
          if (categoryName) {
            // Fetch files from the specified collection
            const collection = await dbClient.client.db().collection(categoryName);
            const files = await collection.find({}).toArray();
            return res.status(200).json(files);
          } else {
            // Fetch all collection names
            const collections = await dbClient.client.db().listCollections().toArray();
            let allFiles = [];
      
            // Fetch files from each collection
            for (const collection of collections) {
              if (collection.name ==='files') {
                const col = await dbClient.client.db().collection(collection.name);
                const files = await col.find({}).toArray();
            
                // Modify each file in the collection
                const modifiedFiles = files.map(file => {
                  // Replace `_id` with `id`
                  file.id = file._id;
                  delete file._id;
            
                  // Normalize `localPath`
                  if (file.localPath) {
                    file.localPath = file.localPath.replace(/\\/g, '/');
                    file.image = file.localPath.split('/').pop();
                    if (!file.images) {
                      file.images = [file.image, file.image, file.image];
                    }
                  }
            
                  return file;
                });
            
                // Concatenate the modified files
                allFiles = allFiles.concat(modifiedFiles);
              }
            }
            
            return res.status(200).json(allFiles);            
          }
        } catch (error) {
          console.error('Error fetching files:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }

      static async isOwner(req, res) {
        try{
          const product = await Product.findProduct(req);
          if (product)
            res.status(200).json({owner:true});
          else {
            res.status(200).json({owner:false});
          }
        } catch (err) {
          res.status(200).json({owner:false});
        }
      }

      static async findProduct(req){
        const token = req.headers['x-token'];
        const itemId = req.params.id;
        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
        const collection = await dbClient.client.db().collection('files');
        const product = await collection.findOne({_id: new ObjectId(itemId), userId:userId});
        return product;
      }

      static async deleteProduct(req, res){
        const item = Product.findProduct(req);       
        if (item)
        {
          const collection = await dbClient.client.db().collection('files');
          try{await collection.deleteOne({ _id: new ObjectId(item._id), userId: userId});}
          catch{return res.status(400).json({status:"not deleted"});}
          return res.status(200).json({status:"deleted"})
        }
        res.status(400).json({status:"not deleted"});

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
        const folderPath = process.env.FOLDER_PATH || '../../../frontend/src/uploads';
        const FOLDER_PATH = path.resolve(__dirname, folderPath);
      
        if (!fs.existsSync(FOLDER_PATH)) {
          fs.mkdirSync(FOLDER_PATH, { recursive: true });
        }
      
        let file = await Product.findProduct(req); 
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
        } else if (type !== "image"){
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
          const result = file ?
            await files.updateOne({ _id: new ObjectId(productId) }, { $set: updateDoc }) :
            await files.insertOne(updateDoc);
      
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
          const images = product.images || [];
          if (index > -1 && index < images.length) {
            images.splice(index, 1);    
            await collection.updateOne(
              { _id: new ObjectId(itemId) },
              { $set: { images: images } }
            );
            return res.status(200).json({ message: 'Image deleted successfully', images });
          } else {
            console.log({error:product})
            return res.status(400).json({ error: 'Invalid index' });
          }
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'An error occurred while deleting the image' });
        }
      }

      static async AddAdditionalImage(req, res) {
        const { folderPath = '../../../frontend/src/uploads' } = process.env;
        const FOLDER_PATH = path.resolve(__dirname, folderPath);
        const { mimeType, data } = req.body;
        const fileId = uuidv4();
        const ext = mimeType.split('/')[1];
        const filePath = path.join(FOLDER_PATH, `${fileId}.${ext}`);
    
        try {
            const itemId = req.params.id;
            const collection = await dbClient.client.db().collection('files');
            const product = await Product.findProduct(req); 
            console.log(req.params.id)
    
            if (product && data) {
                const fileData = Buffer.from(data, 'base64');
                fs.writeFileSync(filePath, fileData); 
    
                const images = product.images || [];
                images.push(`${fileId}.${ext}`); 
                
                await collection.updateOne(
                    { _id: new ObjectId(itemId) }, 
                    { $set: { images: images } }
                );
    
                return res.status(200).json({ status: "updated" });
            } else {
                return res.status(404).json({ status: "not found" });
            }
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
    
    
}

export default Product;
