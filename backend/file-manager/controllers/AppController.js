import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/**
 * Controller for handling app-related routes.
 * Provides methods to get the status of services and retrieve statistics.
 */
class AppController {
  /**
   * Returns the status of the Redis and database clients.
   *
   * @param {Object} req - The request object (not used in this method).
   * @param {Object} res - The response object.
   * @returns {void} Responds with a JSON object containing the status of Redis and the database.
   *
   * @example
   * // Example response
   * // {
   * //   "redis": true,
   * //   "db": true
   * // }
   * AppController.getStatus(req, res);
   */
  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  /**
   * Retrieves statistics about the number of users and files in the database.
   *
   * @param {Object} req - The request object (not used in this method).
   * @param {Object} res - The response object.
   * @returns {void} Responds with a JSON object containing the counts of users and files.
   *
   * @example
   * // Example response
   * // {
   * //   "users": 50,
   * //   "files": 200
   * // }
   * AppController.getStats(req, res);
   */
  static getStats(req, res) {
    let cUsers;
    let cFiles;
    (async () => {
      cUsers = await dbClient.nbUsers();
      cFiles = await dbClient.nbFiles();
      res.status(200).json({ users: cUsers, files: cFiles });
    })();
  }
}

export default AppController;
