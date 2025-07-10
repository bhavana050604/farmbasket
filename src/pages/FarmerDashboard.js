// Updated FarmerDashboard.js with quantity support
import React, { useEffect, useState } from "react";
import {
  addProduct,
  getFarmerProducts,
  deleteProduct,
  updateProduct,
} from "../api/Farmer";
import "../styles/FarmerDashboard.css";

function FarmerDashboard({ user }) {
  const [form, setForm] = useState({ name: "", price: "", quantity: "", image: null });
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await getFarmerProducts(user?.id);
      setProducts(data);
    } catch (err) {
      console.error("\u274C Failed to load products:", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity || !form.image) {
      setMessage("\u274C All fields are required.");
      formData.append("quantity", form.quantity);

      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("image", form.image);
    formData.append("farmer_id", user?.id);
    try {
      await addProduct(formData);
      setMessage("\u2705 Product added!");
      setForm({ name: "", price: "", quantity: "", image: null });
      document.getElementById("fileInput").value = null;
      fetchProducts();
    } catch (err) {
      console.error("\uD83D\uDEAB Error:", err);
      setMessage("\u274C " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("\u274C Failed to delete:", err);
    }
  };

  const handleEdit = (id, currentPrice, currentQuantity) => {
    setEditId(id);
    setNewPrice(currentPrice);
    setNewQuantity(currentQuantity);
  };

  const handleUpdate = async (id) => {
    try {
      await updateProduct(id, newPrice, newQuantity);
      setEditId(null);
      setNewPrice("");
      setNewQuantity("");
      fetchProducts();
    } catch (err) {
      console.error("\u274C Failed to update:", err);
    }
  };

  return (
    <div className="farmer-dashboard">
      <h2>Welcome, {user?.name}</h2>
      <div className="dashboard-container">
        <div className="product-form-section">
          <form className="product-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
            <input type="number" name="price" placeholder="Price per kg" value={form.price} onChange={handleChange} required />
            <input type="number" name="quantity" placeholder="Available Quantity (kg)" value={form.quantity} onChange={handleChange} required />
            <input id="fileInput" type="file" name="image" accept="image/*" onChange={handleChange} required />
            <button type="submit">Add Product</button>
          </form>
          {message && <p className="status-message">{message}</p>}
        </div>
        <div className="info-sidebar">
          <h3>How This Works</h3>
          <p>📤 Upload products with name, price, quantity, and image.</p>
          <p>🛒 Buyers can view and buy your listed products.</p>
          <p>✏️ Use Edit/Delete below to manage stock and pricing.</p>
        </div>
      </div>

      <h3>Your Products</h3>
      <div className="products-container">
        {products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
              <h4>{product.name}</h4>
              <p>₹ {product.price} /kg</p>
              <p>Available: {product.quantity} kg</p>

              {editId === product.id ? (
                <>
                  <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="New Price" />
                  <input type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} placeholder="New Quantity" />
                  <button onClick={() => handleUpdate(product.id)}>Update</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(product.id, product.price, product.quantity)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FarmerDashboard;
