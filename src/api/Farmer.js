// 📦 FRONTEND: src/api/Farmer.js
import axios from "axios";
const API_URL = "https://efarming.onrender.com";

// ✅ Add new product
export const addProduct = async (formData) => {
  const res = await axios.post(`${API_URL}/api/farmer/addProduct`, formData);
  return res.data;
};

// ✅ Get all products by farmer ID
export const getFarmerProducts = async (farmerId) => {
  const res = await axios.get(`${API_URL}/api/farmer/products/${farmerId}`);
  return res.data;
};

// ✅ Delete product
export const deleteProduct = async (productId) => {
  const res = await axios.delete(`${API_URL}/api/farmer/deleteProduct/${productId}`);
  return res.data;
};

// ✅ Update price and quantity
export const updateProduct = async (productId, price, quantity) => {
  const res = await axios.put(`${API_URL}/api/farmer/updateProduct/${productId}`, {
    price,
    quantity,
  });
  return res.data;
};
