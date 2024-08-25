import { v4 } from 'uuid';
import SHA1 from 'sha1';
import auth from 'basic-auth';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';


/**
 * Controller for handling authentication-related routes.
 * Provides methods to connect (authenticate) and disconnect (logout) users.
 */
class AuthController {
  /**
 * Controller for handling authentication-related routes.
 * Provides methods to connect (authenticate) and disconnect (logout) users.
 */
class AuthController {
  /**
   * Authenticates a user with Basic Auth and generates a token if successful.
   * 
   * @param {Object} req - The request object, expected to contain Basic Auth credentials.
   * @param {Object} res - The response object.
   * @returns {void} Responds with a JSON object containing a token if authentication is successful, or an error message if not.
   * 
   * @example
   * // Successful response
   * // {
   * //   "token": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
   * // }
   * 
   * @example
   * // Error response
   * // {
   * //   "error": "Unauthorized"
   * // }
   * 
   * AuthController.getConnect(req, res);
   */
  static async getConnect(req, res) {
    const user = auth(req);

    if (!user || !user.name || !user.pass) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name: email, pass: password } = user;

    if (email && password) {
      const exist = await dbClient.getUsers(email);
      if (exist && !exist.block) {
        const shaiPS = SHA1(password);
        if (shaiPS === exist.password) {
          const token = v4();
          const key = `auth_${token}`;
          await redisClient.set(key, exist._id.toString(), 86400);
          res.status(200).json({ token });
        }
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  /**
   * Logs out the user by deleting their authentication token from Redis.
   * 
   * @param {Object} req - The request object, expected to contain the key of the token to delete.
   * @param {Object} res - The response object.
   * @returns {void} Responds with a status of 204 if the token is successfully deleted.
   * 
   * @example
   * // Example request
   * // DELETE /disconnect
   * 
   * AuthController.getDisconnect(req, res);
   */
  static async getDisconnect(req, res) {
    const { key } = req;
    await redisClient.del(key);
    res.status(204);
    res.end();
  }
}

export default AuthController;
