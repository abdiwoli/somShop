/* eslint-disable */
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

/**
 * A utility class providing various helper methods for user authentication,
 * file management, and subscription operations.
 */
class Helper {
  /**
   * Retrieves a user based on the provided authentication token.
   *
   * @param {string} token - The authentication token.
   * @returns {Promise<Object|null>} The user object if the token is valid and the user exists; otherwise, null.
   */
  static async userOrder(token) {
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (userId) {
      const user = await dbClient.getUsersById(userId);
      if (user && user._id.toString() === userId) {
        return user;
      }
    }
    return null;
  }

  /**
   * Retrieves a user based on the token from the request headers and checks the validity of the token.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} An object containing either an error status and user information or an error status.
   */
  static async getByToken(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (userId) {
      const user = await dbClient.getUsersById(userId);
      if (user && user._id.toString() === userId) {
        return { error: false, user, key };
      }
    }
    return { error: true };
  }

  /**
   * Retrieves files with pagination from the database based on the provided query.
   *
   * @param {Object} query - The aggregation query for retrieving files.
   * @returns {Promise<Array>} An array of file objects formatted for return.
   * @throws {Error} Throws an error if there is an issue with retrieving files.
   */
  static async getFilesWithPagination(query) {
    try {
      const collection = await dbClient.client.db().collection('files');
      const results = await collection.aggregate(query).toArray();
      const arr = [];
      results.forEach((file) => {
        arr.push(Helper.fileToReturn(file));
      });
      return arr;
    } catch (error) {
      console.error('Error retrieving files with pagination:', error);
      throw error;
    }
  }

  /**
   * Formats a file object for return, adjusting properties based on file type.
   *
   * @param {Object} file - The file object to format.
   * @returns {Object} The formatted file object.
   */
  static fileToReturn(file) {
    if (file.parentId && file.parentId === '0') {
      file.parentId = 0;
    }
    const edited = { id: file._id, ...file };
    delete edited._id;
    if (file.type === 'folder') return edited;
    delete edited.localPath;
    return edited;
  }

  /**
   * Middleware function for user authentication based on the token from the request.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise<void>} Calls the next middleware if the user is authenticated; otherwise, sends an unauthorized response.
   */
  static async authUser(req, res, next) {
    const data = await Helper.getByToken(req, res);
    if (data && data.error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = data.user;
    req.key = data.key;
    return next();
  }

  /**
   * Middleware function for admin authentication. Checks if the authenticated user is an admin.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise<void>} Sends an authorized response if the user is an admin; otherwise, calls the next middleware.
   */
  static async authAdmin(req, res, next) {
    const data = await Helper.getByToken(req, res);
    if (data && data.user && data.user.admin) {
      return res.status(200).json({ owner: true });
    }
    return next();
  }

  /**
   * Subscribes an email to notifications by inserting it into the subscription collection.
   *
   * @param {Object} req - The request object containing the email.
   * @param {Object} res - The response object to send the status of the operation.
   * @returns {Promise<void>}
   */
  static async Subscribe(req, res) {
    const { email } = req.params;
    try {
      const collection = await dbClient.client.db().collection('subscribe');
      await collection.insertOne({ email });
    } catch (err) {
      console.log(err);
    }
    res.status(200).json({ status: 'done' });
  }
}

export default Helper;
