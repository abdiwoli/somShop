import Queue from 'bull';
import dbClient from '../utils/db';

const userQueue = new Queue('userQueue');

class MessageController {
  /**
   * Receives a new message and stores it in the database.
   *
   * @param {Object} req - The request object containing the message data.
   * @param {Object} res - The response object to send the status of the operation.
   * @returns {Promise<void>}
   * @throws {Error} Throws an error if there is an issue with inserting the message.
   */
  static async newMessage(req, res) {
    try {
      const collections = await dbClient.client.db().collection('messages');
      const data = req.body;
      const timestamp = new Date();
      data.createdAt = timestamp;
      await collections.insertOne(data);
      res.status(200).json({ status: 'sent' });
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Retrieves all messages from the database, accessible only by admin users.
   *
   * @param {Object} req - The request object containing user information.
   * @param {Object} res - The response object to send the messages or an error message.
   * @returns {Promise<void>}
   * @throws {Error} Throws an error if there is an issue with retrieving messages.
   */
  static async getMessage(req, res) {
    const { user } = req;
    if (!user || (user && !user.admin)) {
      console.log(user);
      console.log({ status: 'unothrized' });
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log(user);
    const collection = await dbClient.client.db().collection('messages');
    const messages = await collection.find({}).toArray();
    return res.status(200).json(messages);
  }

  /**
   * Adds a reply message to the user queue for processing.
   *
   * @param {Object} req - The request object containing the reply message data.
   * @param {Object} res - The response object to send the status of the operation.
   * @returns {Promise<void>}
   * @throws {Error} Throws an error if there is an issue with adding the message to the queue.
   */
  static async replyMessage(req, res) {
    const data = req.body;
    const { user } = req;
    if (!user && (user && !user.admin)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    data.subject = 'Reply from Som';
    userQueue.add({ user: data });
    return res.status(200).json({ status: 'ok' });
  }
}

export default MessageController;
