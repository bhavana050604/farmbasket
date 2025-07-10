// 📦 FRONTEND: src/api/Farmer.js
import axios from "axios";
const API_URL = "https://efarming.onrender.com";


// ✅ Add new product
export const addProduct = async (formData) => {
  const res = await axios.post("/api/farmer/addProduct", formData);
  return res.data;
};

// ✅ Get all products by farmer ID
export const getFarmerProducts = async (farmerId) => {
  const res = await axios.get(`/api/farmer/products/${farmerId}`);
  return res.data;
};

// ✅ Delete product
export const deleteProduct = async (productId) => {
  const res = await axios.delete(`/api/farmer/deleteProduct/${productId}`);
  return res.data;
};

// ✅ Update price and quantity
export const updateProduct = async (productId, price, quantity) => {
  const res = await axios.put(`/api/farmer/updateProduct/${productId}`, {
    price,
    quantity,
  });
  return res.data;
};
