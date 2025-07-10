import axios from "axios";

export const getAllProducts = async () => {
  const res = await axios.get("/api/buyer/products");
  return res.data;
};

export const getOrderHistory = async (buyerId) => {
  const res = await axios.get(`/api/buyer/orders/${buyerId}`);
  return res.data;
};

export const deleteOrder = async (orderId) => {
  const res = await axios.delete(`/api/buyer/orders/${orderId}`);
  return res.data;
};

export const checkoutCart = async (buyerId, cartItems, deliveryInfo) => {
  const res = await axios.post("/api/buyer/checkout", {
    buyer_id: buyerId,
    cart: cartItems,
    ...deliveryInfo,
  });
  return res.data;
};
