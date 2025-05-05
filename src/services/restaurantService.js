import axios from "axios";

const API_URL = "http://localhost:3000/api/restaurants/";

const restaurantApi = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const restaurantService = {
    /**
     * Get all restaurants
     * @return {Promise} - Promise with restaurant data
     */
    async getAllRestaurants() {
        try {
            const res = await restaurantApi.get("/api/restaurants");
            console.log("All restaurants response:", res.data);
            return res.data.data;
        } catch (error) {
            throw new Error("Failed to fetch all restaurants: " + error.message);
        }
    },

    /**
     * Get menu for a specific restaurant
     * @param {string} restaurantId - ID of the restaurant
     * @return {Promise} - Promise with restaurant menu data
     */
    async getRestaurantMenu(restaurantId) {
        try {
            const res = await restaurantApi.get(`api/restaurants/${restaurantId}/menus`);
            console.log("Restaurant menu response:", res.data);
            return res.data.data;
        } catch (error) {
            throw new Error("Failed to fetch restaurant menu: " + error.message);
        }
    },

    /**
     * Restaurant owner get their owner restaurant
     * @return {Promise} - Promise with restaurant data
     */
    async getOwnerRestaurant() {
        try {
            const res = await restaurantApi.get(`/api/restaurants/my`);
            return res.data.data[0];
        } catch (error) {
            throw new Error("Failed to fetch restaurant: " + error.message);
        }
    },
};

export default restaurantService;