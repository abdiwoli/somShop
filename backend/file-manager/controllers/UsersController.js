/* eslint-disable */
import SHA1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import Helper from './utils';
const userQueue = new Queue('userQueue');
import { ObjectId } from 'mongodb';
import path from 'path';
import fs from 'fs';
const { v4: uuidv4 } = require('uuid');



class UsersController {

  static async postNew(req, res) {
    const { email, password, name } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
    } else if (!password) {
      res.status(400).json({ error: 'Missing password' });
    } else {
      const shaiPS = SHA1(password);
      const exist = await dbClient.getUsers(email);
      if (exist) {
        res.status(400).json({ error: 'Already exist' });
      } else {
          const inserted = await dbClient.addUsers(email, shaiPS, name);
          const user = await dbClient.getUsersById(inserted);
          if (user)
              user.subject = "wellcome to SOM";
              userQueue.add({user});
        res.status(201).json({ id: inserted, email });
      }
    }
  }

  static async delUser(req, res) {
    if (!req.user && (req.user && !req.user.admin)){
      return res.status(401).json({error:'unauthorized'});
    }
    const { email } = req.body;
    if (email) {
      const deleted = await dbClient.deleteUsers(email);
      if (deleted) {
        res.status(200).json({ 'deleted email': email });
        return;
      }
    }
    res.status(404).json({ "can't delate email": email });
  }

  static async getMe(req, res) {
      const user = req.user;
      res.status(200).json({ id: user._id.toString(), email: user.email, admin:user.admin, image:user.image, name:user.name});
  }

  static async getAll(req, res) {
    if (!req.user && (req.user && !req.user.admin)){
      return res.status(401).json({error:'unauthorized'});
    }
    const collection = await dbClient.client.db().collection('users');
    const users = await collection.find({}).toArray();
    res.status(200).json(users);
  }

static async updateUser(req, res) {
  if (!req.user && (req.user && !req.user.admin)){
    return res.status(401).json({error:'unauthorized'});
  }
  try {
    // Extract userId and other fields from the request body
    const { userId, name, email, password, admin, image, mimeType} = req.body;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    const collection = await dbClient.client.db().collection('users');
    const updateUser = await collection.findOne({ _id: new ObjectId(userId) });
    if (!updateUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let filePath;
    let fileId;
    let ext;

    // Process the image if provided
    if (image) {
      const folderPath = process.env.FOLDER_PATH || '../uploads';
      const FOLDER_PATH = path.resolve(__dirname, folderPath);
      fileId = uuidv4();
      ext = mimeType.split('/')[1];
      filePath = path.join(FOLDER_PATH, `${fileId}.${ext}`);
      const fileData = Buffer.from(image, 'base64');
      fs.writeFileSync(filePath, fileData);
    }

    // Prepare the update payload
    const payload = {
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password }),
      ...(admin !== undefined && { admin }), 
      ...(filePath && { image: `${fileId}.${ext}` }),
    };

    // Update the user in the database
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: payload }
    );
    return res.status(200).json({ message: 'User updated successfully' });

  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

static async BlockUser(req, res) {
  if (!req.user && (req.user && !req.user.admin)){
    console.log({user:req.user});
    return res.status(401).json({error:'unauthorized'});
  }
  try {
    const collection = await dbClient.client.db().collection('users');
    const userId = req.params.id;
    const block = req.params.block === 'true' ? true : false;
    await collection.updateOne({_id: new ObjectId(userId)}, {$set:{block}});
    console.log({userId, block })
    res.status(200).json({status:"updated"})
  } catch (err) {
    res.status(500).json({error:err.message});
  }
}
}

export default UsersController;
