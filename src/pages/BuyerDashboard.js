import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  getOrderHistory,
  deleteOrder,
} from "../api/Buyer";
import { useNavigate } from "react-router-dom";
import "../styles/BuyerDashboard.css";

function BuyerDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllProducts();
        const ordersData = await getOrderHistory(user?.id);

        setProducts(productsData);
        setOrders(ordersData);
      } catch (err) {
        console.error("❌ Error loading data:", err);
      }
    };

    if (user?.id) fetchData();
  }, [user?.id]);

  const addToCart = (product) => {
    const exists = cart.find((item) => item.product_id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const updateCartQty = (id, qty) => {
    if (qty <= 0) {
      setCart(cart.filter((item) => item.product_id !== id));
    } else {
      setCart(
        cart.map((item) =>
          item.product_id === id ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("❌ Failed to delete order:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/payment", { state: { cart, user } });
  };

  const totalCartPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="buyer-dashboard">
      {/* Products Section */}
      <div className="products-section">
        <h3>Available Products</h3>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
              />
              <h4>{product.name}</h4>
              <p>Price: ₹{product.price}/kg</p>
              <p>Quantity Left: {product.quantity}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Order History & Cart Section */}
          {/* Bottom layout */}
<div className="bottom-section">
  {/* Order History */}
  <div className="orders-section">
    <h3>Order History</h3>
    {orders.length === 0 ? (
      <p>No orders yet</p>
    ) : (
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.product_name} - {order.quantity}kg - ₹{order.total_price} on{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : "Unknown Date"}
            <button
              className="delete-order"
              onClick={() => handleDeleteOrder(order.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Cart Section */}
  <div className="cart-section">
    <h3>Your Cart</h3>
    {cart.length === 0 ? (
      <p>No items yet</p>
    ) : (
      <div>
        {cart.map((item) => (
          <div key={item.product_id} className="cart-item">
            <span>{item.name}</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateCartQty(item.product_id, parseInt(e.target.value))
              }
              min="1"
            />
            <span>₹{item.price * item.quantity}</span>
            <button
              className="remove-btn"
              onClick={() =>
                setCart(cart.filter((i) => i.product_id !== item.product_id))
              }
            >
              ❌
            </button>
          </div>
        ))}
        <h4>Total: ₹{totalCartPrice}</h4>
        <button className="checkout-btn" onClick={handleCheckout}>
          Place Order
        </button>
      </div>
    )}
  </div>
</div>

    </div>
  );
}

export default BuyerDashboard;
