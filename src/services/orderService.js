import axios from "axios";

const API_URL = "http://localhost:3000/api/orders"; // Ensure this is correct

// Use a single Axios instance for order-related requests
const orderApi = axios.create({
  baseURL: API_URL, // Base URL for the server
  headers: {
    // Dynamic token retrieval
    get Authorization() {
      return `Bearer ${localStorage.getItem("token")}`;
    }
  },
});

const orderService = {
  /**
   * Place a new order
   * @param {string} restaurantId - ID of the restaurant
   * @param {Array} items - Array of items { menuItemId, quantity, price }
   * @param {number} totalAmount - Total amount of the order
   * @return {Promise} - Promise with order data
   */
  async placeOrder(restaurantId, items) {
    try {
      const reqData = {
        restaurantId,
        items
      };
      // Use relative path if baseURL is set correctly
      const res = await orderApi.post(`/api/orders`, reqData); 
      console.log("Order response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Order placement error details:", error.response?.data || error.message);
      throw new Error("Order placement failed: " + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Get order history for a user
   * @return {Promise} - Promise with order history data
   */
  async getOrderHistory() {
    try {
      // Use relative path
      const res = await orderApi.get("/api/orders/my-orders"); 
      console.log("Order history response:", res.data);
      // Adjust based on actual response structure
      return res.data.data || res.data; 
    } catch (error) {
      console.error("Get order history error details:", error.response?.data || error.message);
      throw new Error("Failed to fetch order history: " + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Get restaurant pending orders for restaurant owner
   * @param {string} restaurantId - ID of the restaurant
   * @return {Promise} - Promise with restaurant orders data
   */
  async getPendingRestaurantOrders(restaurantId) {
    try {
      // Use relative path
      const res = await orderApi.get(`/api/orders/restaurant/${restaurantId}/pending`); 
      console.log("Restaurant orders response:", res.data.data);
      // Adjust based on actual response structure
      return res.data.data
    } catch (error) {
      console.error("Get restaurant orders error details:", error.response?.data || error.message);
      throw new Error("Failed to fetch restaurant orders: " + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Get restaurant order details
   * @param {string} restaurantId - ID of the restaurant
   * @param {string} orderId - ID of the order
   * @return {Promise} - Promise with order details data
   */
  async getRestaurantOrderById(restaurantId, orderId) {
    try {
      const res = await orderApi.get(`/api/orders/restaurant/${restaurantId}/orders/${orderId}`);
      return res.data.data;
    } catch (error) {
      throw new Error("Failed to fetch order details: " + error.message);
    }
  },

  /**
   * Update the status of an order (NEW FUNCTION)
   * @param {string} restaurantId - ID of the restaurant
   * @param {string} orderId - ID of the order to update
   * @param {string} status - The new status (e.g., 'processing', 'cancelled')
   * @return {Promise} - Promise with updated order data
   */
  async updateOrderStatus(restaurantId, orderId, status) {
    try {
      const reqData = { status };
      // Use relative path, assuming endpoint is like /api/orders/:orderId/status
      const res = await orderApi.put(`/api/orders/restaurant/${restaurantId}/orders/${orderId}/status`, reqData); 
      console.log("Update order status response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Update order status error details:", error.response?.data || error.message);
      throw new Error(`Failed to update order status: ${error.response?.data?.message || error.message}`);
    }
  },
};

export default orderService;
