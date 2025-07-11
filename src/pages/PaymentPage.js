import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkoutCart } from "../api/Buyer";
import "../styles/PaymentPage.css";

function PaymentPage() {
  const { state } = useLocation();
  const cart = state?.cart || [];
  const user = state?.user || JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    address: "",
    mobile: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.address || !form.mobile || !form.pincode || !form.city || !form.state) {
      setMessage("⚠️ Please fill all delivery fields.");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => setMessage("❌ Razorpay SDK failed to load.");
    script.onload = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payment/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice * 100 }),
        });

        const data = await res.json();

        const options = {
          key: "rzp_test_SQFxBYUAD5nGdv",
          amount: data.amount,
          currency: "INR",
          name: "EFarming App",
          description: "EFarming Order",
          order_id: data.id,
          handler: async function (response) {
            try {
              const deliveryInfo = {
                address: form.address,
                mobile: form.mobile,
                pincode: form.pincode,
                city: form.city,
                state: form.state,
              };

              await checkoutCart(user.id, cart, deliveryInfo);

              setMessage("✅ Payment Successful. Order Placed!");
              setTimeout(() => navigate("/buyer/dashboard", { replace: true }), 2000); // ✅ Fixed redirection
            } catch (err) {
              console.error("❌ Backend error:", err);
              setMessage("❌ Failed to place order.");
            }
          },
          prefill: {
            name: user.name,
            contact: form.mobile,
          },
          theme: {
            color: "#00aa88",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("❌ Razorpay Init Error:", err);
        setMessage("❌ Payment initiation failed.");
      }
    };

    document.body.appendChild(script);
  };

  return (
    <div className="payment-page">
      <h2>Confirm Your Order</h2>

      <div className="summary">
        <h3>Order Summary</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.product_id}>
              {item.name} - {item.quantity}kg - ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
        <h4>Total: ₹{totalPrice}</h4>
      </div>

      <form className="delivery-form" onSubmit={handleSubmit}>
        <h3>Delivery Details</h3>

        <input
          type="text"
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
        />

        <button type="submit">Confirm & Pay</button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default PaymentPage;
