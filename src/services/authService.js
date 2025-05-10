import axios from "axios";

const API_URL = "http://localhost:3000/api/users/api/v1/auth/";

const authService = {
  /**
   * login user
   * @param {string} email - user's email
   * @param {string} password - user's password
   * @return {Promise} - promise with user data and token
   */
  async login(email, password) {
    try {
      const reqData = {
        email,
        password,
      };
      const res = await axios.post(`${API_URL}/login`, reqData);
      console.log("Login response:", res.data);
      const userData = res.data.data.user;
      console.log("User Data login:", userData);
      const token = res.data.data.token;
      console.log("Token login:", token);
      return { userData, token };
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  },

  /**
   * register user
   * @param {string} email - user's email
   * @param {string} password - user's password
   * @param {string} name - user's name
   * @param {string} phone - user's phone number
   * @param {string} street - user's street address
   * @param {string} city - user's city
   * @param {string} state - user's state
   * @param {string} zipCode - user's zip code
   * @param {string} country - user's country
   * @return {Promise} - promise with user data and token
   */
  async register(
    email,
    password,
    name,
    phone,
    street,
    city,
    state,
    zipCode,
    country
  ) {
    try {
      const reqData = {
        email,
        password,
        name,
        phone,
        address: {
          street,
          city,
          state,
          zipCode,
          country,
        },
      };
      const res = await axios.post(`${API_URL}/register`, reqData);
      const userData = res.data.data.user;
      const token = res.data.data.token;
      return { userData, token };
    } catch (error) {
      throw new Error("Registration failed: " + error.message);
    }
  },
};

export default authService;
