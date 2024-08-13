/* eslint-disable */
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import mime from 'mime-types';
import Queue from 'bull';
import Helper from './utils';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const users = await Helper.getByToken(req, res);
    if (users && users.user) {
        const files = await dbClient.client.db().collection('files');
        const { folderPath = '../../../frontend/src/uploads' } = process.env;
        const FOLDER_PATH = path.resolve(__dirname, folderPath);

        const { user } = users;

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
          description
      } = req.body;

     
      
      

        if (!name) return res.status(400).json({ error: 'Missing name' });
        if (!type) return res.status(400).json({ error: 'Missing type' });
        if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });
        if (parentId && parentId !== '0') {
            const file = await dbClient.getFile(parentId);
            if (!file) {
                return res.status(400).json({ error: 'Parent not found' });
            }
            if (file && file.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
        }

        if (type === 'folder') {
            const result = await files.insertOne({
                userId: user._id.toString(),
                name,
                type,
                isPublic,
                parentId,
            });

            if (result.insertedId) {
                const newFile = await files.findOne({ _id: result.insertedId });
                const edited = { id: newFile._id, ...newFile };
                return res.status(201).json(edited);
            }
        } else {
            if (!fs.existsSync(FOLDER_PATH)) {
                fs.mkdirSync(FOLDER_PATH, { recursive: true });
            }

            const fileId = v4();
            let filePath;
            
            if (type === 'image') {
                // Determine file extension from MIME type
                const ext = mimeType.split('/')[1];
                filePath = path.join(FOLDER_PATH, `${fileId}.${ext}`);
            } else {
                // Use default extension for non-image files
                filePath = path.join(FOLDER_PATH, fileId);
            }
            
            const fileData = Buffer.from(data, 'base64');
            fs.writeFileSync(filePath, fileData);

            const result = await files.insertOne({
                userId: user._id.toString(),
                name,
                price,
                prevPrice,
                catagory,
                type,
                isPublic,
                parentId,
                localPath: filePath,
                description
            });

            if (result.insertedId) {
                const newFile = await files.findOne({ _id: result.insertedId });
                const editedFile = Helper.fileToReturn(newFile);
                if (editedFile.type === 'image') {
                    const fileQueue = new Queue('fileQueue');
                    fileQueue.add({ userId: editedFile.userId, fileId: editedFile.id });
                }
                return res.status(201).json(editedFile);
            }

            res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}


  static async getShow(req, res) {
      const user = req.user;
    if (user) {
      const fileId = req.params.id;
      const userId = user._id;
      const file = await dbClient.getFile(fileId);
      if (file && file.userId === userId.toString()) {
        const editedFile = Helper.fileToReturn(file);
        return res.status(200).json(editedFile);
      }
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async getIndex(req, res) {
    try {
        const user = req.user;

      const userId = user._id.toString();
      const { parentId = '0', page = 0 } = req.query;

      const pageNumber = parseInt(page, 10);
      if (isNaN(pageNumber) || pageNumber < 0) {
        return res.status(400).json({ error: 'Invalid page number' });
      }
      const query = [
        { $match: { parentId, userId } },
        { $skip: pageNumber * 20 },
        { $limit: 20 },
      ];
      const files = await Helper.getFilesWithPagination(query);
      return res.status(200).json(files);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async putPublish(req, res) {
    const user = req.user

    const userId = user._id.toString();
    const fileId = req.params.id;
    const file = await dbClient.getFile(fileId);
    if (!file || file.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: 'Not found' });
    }
    file.isPublic = true;
    await dbClient.updateFile(fileId, true);
    return res.status(200).json(Helper.fileToReturn(file));
  }

  static async putUnpublish(req, res) {
      const user = req.user;

    const userId = user._id.toString();
    const fileId = req.params.id;
    const file = await dbClient.getFile(fileId);
    if (!file || file.userId.toString() !== userId.toString()) {
      return res.status(404).json({ error: 'Not found' });
    }

    file.isPublic = false;
    await dbClient.updateFile(fileId, false);
    return res.status(200).json(Helper.fileToReturn(file));
  }

  static async getFile(req, res) {
    const fileId = req.params.id;
    const { size } = req.query;
    const validSizes = [500, 250, 100];

    // Validate the size parameter
    if (size && !validSizes.includes(parseInt(size))) {
      return res.status(400).json({ error: 'Invalid size parameter' });
    }

    const file = await dbClient.getFile(fileId);
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (!file.isPublic) {
      const users = await Helper.getByToken(req, res);
      if (users.error) return res.status(404).json({ error: 'not found' });
      const userId = users.user._id.toString();
      if (file && file.userId.toString() !== userId) return res.status(404).json({ error: 'not found' });
    }

    let filePath;
    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }
        
    filePath = file.localPath;
    if (size && file.type === 'image') {
      filePath = `${filePath}_${size}`;
    }
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });

    try {
      const fileBuffer = await fsPromises.readFile(filePath);
      const mimeType = mime.contentType(file.name);
      res.setHeader('Content-Type', mimeType);
      return res.status(200).send(fileBuffer);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async delete(req, res) {
    try {
      const db = dbClient.client.db();
      const collections = await db.collections();

      if (collections.length === 0) {
        return res.status(404).json({ message: "No collections found in the database." });
      }

      // Sequentially drop each collection except 'users'
      for (const collection of collections) {
        if (collection.collectionName !== 'users') {
          await collection.drop();
        }
      }

      return res.status(200).json({ message: "All collections deleted except 'users'." });
    } catch (error) {
      console.error("Error deleting collections:", error);
      return res.status(500).json({ error: "An error occurred while deleting collections." });
    }
  }

}

export default FilesController;
