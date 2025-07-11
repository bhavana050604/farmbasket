import axios from "axios";
const API_URL = "http://localhost:5000";

export const getAllProducts = async () => {
  const res = await axios.get(`${API_URL}/api/buyer/products`);
  return res.data;
};

export const getOrderHistory = async (buyerId) => {
  const res = await axios.get(`${API_URL}/api/buyer/orders/${buyerId}`);
  return res.data;
};

export const deleteOrder = async (orderId) => {
  const res = await axios.delete(`${API_URL}/api/buyer/orders/${orderId}`);
  return res.data;
};

export const checkoutCart = async (buyerId, cartItems, deliveryInfo) => {
  const res = await axios.post(`${API_URL}/api/buyer/checkout`, {
    buyer_id: buyerId,
    cart: cartItems,
    ...deliveryInfo,
  });
  return res.data;
};
