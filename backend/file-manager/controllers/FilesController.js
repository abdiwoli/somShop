/* eslint-disable */
import path from 'path';
import { v4 } from 'uuid';
import mime from 'mime-types';
import Queue from 'bull';
import Helper from './utils';
import dbClient from '../utils/db';

const newProduct = new Queue('newProduct');

class FilesController {
  /**
 * Handles the upload of files or folders. This method supports uploading both files and folders.
 * For files, it processes the uploaded data, saves it to the filesystem, and stores metadata in the database.
 * For folders, it only stores metadata in the database.
 *
 * @param {Object} req - The request object containing the upload data and metadata.
 * @param {Object} res - The response object used to send the response.
 *
 * @returns {Object} - A JSON response containing the uploaded file or folder metadata.
 *
 * @throws {Error} - If there are issues with missing fields, invalid parent folder, or file operations.
 *
 * @example
 * // Example request body for file upload:
 * {
 *   "name": "example.jpg",
 *   "prevPrice": 10.00,
 *   "price": 15.00,
 *   "type": "image",
 *   "parentId": "607c191e810c19729de860ea",
 *   "isPublic": true,
 *   "data": "base64-encoded-file-data",
 *   "mimeType": "image/jpeg",
 *   "catagory": "photos",
 *   "description": "An example image"
 * }
 *
 * // Example response:
 * {
 *   "id": "607c191e810c19729de860eb",
 *   "userId": "60d5f4896b4f1d001f6a0a20",
 *   "name": "example.jpg",
 *   "price": 15.00,
 *   "prevPrice": 10.00,
 *   "catagory": "photos",
 *   "type": "image",
 *   "isPublic": true,
 *   "parentId": "607c191e810c19729de860ea",
 *   "localPath": "/uploads/1234-5678.jpg",
 *   "description": "An example image"
 * }
 *
 * @example
 * // Example request body for folder upload:
 * {
 *   "name": "New Folder",
 *   "type": "folder",
 *   "parentId": "607c191e810c19729de860ea",
 *   "isPublic": false
 * }
 *
 * // Example response:
 * {
 *   "id": "607c191e810c19729de860ec",
 *   "userId": "60d5f4896b4f1d001f6a0a20",
 *   "name": "New Folder",
 *   "type": "folder",
 *   "isPublic": false,
 *   "parentId": "607c191e810c19729de860ea"
 * }
 */
  static async postUpload(req, res) {
    const users = await Helper.getByToken(req, res);
    if (users && users.user) {
      const files = await dbClient.client.db().collection('files');
      const { folderPath = '../uploads' } = process.env;
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
        description,
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
          const ext = mimeType.split('/')[1];
          filePath = path.join(FOLDER_PATH, `${fileId}.${ext}`);
        } else {
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
          description,
        });

        if (result.insertedId) {
          const newFile = await files.findOne({ _id: result.insertedId });
          const editedFile = Helper.fileToReturn(newFile);
          const email = await dbClient.client.db().collection('subscribe').find({}).toArray();
          const emails = email.filter((el) => el.email).map((el) => el.email);
          newProduct.add({ product: newFile, emails });
          return res.status(201).json(editedFile);
        }

        return res.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default FilesController;
