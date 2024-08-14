/* eslint-disable */
import SHA1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import Helper from './utils';
const userQueue = new Queue('userQueue');

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
          
          userQueue.add({ userId: inserted });
        res.status(201).json({ id: inserted, email });
      }
    }
  }

  static async delUser(req, res) {
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
      if (user.email==="abdiwolix"){
        user.admin = true
      } else {user.admin=false};
      res.status(200).json({ id: user._id.toString(), email: user.email, admin:user.admin});
  }

static async getAll(req, res) {
  const collection = await dbClient.client.db().collection('users');
  const users = await collection.find({}).toArray();
  res.status(200).json(users);
}

  
}

export default UsersController;
