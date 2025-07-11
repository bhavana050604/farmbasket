import axios from "axios";

const API_URL = "http://localhost:5000";

// ✅ Register
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, userData);
  return response.data;
};

// ✅ Login
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, userData);
  return response.data;
};

// ✅ Optional alias
export const login = async (credentials) => {
  return await axios.post(`${API_URL}/api/auth/login`, credentials);
};
