import axios from "axios";

// Backend base URL
const API_URL = "https://efarming.onrender.com";

// ✅ Register
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

// ✅ Login
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

// ✅ Used for custom login logic (if needed)
export const login = async (credentials) => {
  return await axios.post(`${API_URL}/api/auth/login`, credentials);
};
