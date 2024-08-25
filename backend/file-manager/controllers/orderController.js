import dbClient from '../utils/db';

class Orders {
  /**
   * Creates a new order in the database.
   *
   * @param {string} orderId - The unique identifier for the order.
   * @param {string} userId - The identifier of the user placing the order.
   * @param {Object} data - Additional order details to be saved.
   * @returns {Promise<string>} The ID of the newly inserted order.
   * @throws {Error} Throws an error if there is an issue with inserting the order.
   */
  static async postOrders(orderId, userId, data) {
    try {
      const ordersCollection = dbClient.client.db().collection('orders');
      const order = {
        orderId,
        userId,
        status: 'uncomplete',
        ...data,
      };
      const result = await ordersCollection.insertOne(order);
      return result.insertedId;
    } catch (error) {
      console.error('Error inserting order:', error);
      throw error;
    }
  }

  /**
   * Updates the status of an existing order.
   *
   * @param {string} orderId - The unique identifier for the order.
   * @param {string} status - The new status to be set for the order.
   * @returns {Promise<Object>} Result of the update operation.
   * @throws {Error} Throws an error if there is an issue with updating the order status.
   */
  static async orderStatus(orderId, status) {
    try {
      const ordersCollection = dbClient.client.db().collection('orders');
      const result = await ordersCollection.updateOne(
        { orderId },
        { $set: { status } },
      );
      if (result.matchedCount === 0) {
        return { success: false, message: 'Order not found' };
      }
      return { success: true, message: 'Order status updated' };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, message: 'Error updating order status' };
    }
  }

  /**
   * Retrieves all orders for the authenticated user.
   *
   * @param {Object} req - The request object containing the user information.
   * @param {Object} res - The response object to send the orders.
   * @returns {Promise<void>}
   */
  static async getOrders(req, res) {
    const { user } = req;
    const collection = await dbClient.client.db().collection('orders');
    const orders = await collection.find({ userId: user.id }).toArray();
    res.status(200).json(orders);
  }
}

export default Orders;
