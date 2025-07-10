import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [farmersRes, buyersRes, productsRes, deliveriesRes] = await Promise.all([
          axios.get("/api/admin/farmers"),
          axios.get("/api/admin/buyers"),
          axios.get("/api/admin/products"),
          axios.get("/api/admin/delivery"),
        ]);

        setFarmers(farmersRes.data);
        setBuyers(buyersRes.data);
        setProducts(productsRes.data);
        setDeliveries(deliveriesRes.data);
      } catch (err) {
        console.error("❌ Error loading admin data:", err);
        setError("Failed to load admin dashboard data.");
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Welcome, Admin</h2>
      {error && <p className="error">{error}</p>}

      {/* Farmers */}
      <section>
        <h3>All Farmers</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Address</th><th>Mobile</th><th>DOB</th></tr>
          </thead>
          <tbody>
            {farmers.map((f, i) => (
              <tr key={i}>
                <td>{f.name}</td><td>{f.address}</td><td>{f.mobile}</td><td>{new Date(f.dob).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Buyers */}
      <section>
        <h3>All Buyers</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Address</th><th>Mobile</th><th>DOB</th></tr>
          </thead>
          <tbody>
            {buyers.map((b, i) => (
              <tr key={i}>
                <td>{b.name}</td><td>{b.address}</td><td>{b.mobile}</td><td>{new Date(b.dob).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

{/* Products */}
<section>
  <h3>All Products</h3>
  <table>
    <thead>
      <tr><th>Image</th><th>Name</th><th>Farmer Name</th><th>Price</th><th>Quantity</th></tr>
    </thead>
    <tbody>
      {products.map((p, i) => (
        <tr key={i}>
          <td>
            {p.image ? (
              <img src={`data:image/jpeg;base64,${p.image}`} alt={p.name} width="60" />
            ) : (
              "No Image"
            )}
          </td>
          <td>{p.name}</td>
          <td>{p.farmer_name}</td>
          <td>₹{p.price}</td>
          <td>{p.quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>


      {/* Deliveries */}
      <section>
        <h3>Delivery Details</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Address</th><th>Mobile</th><th>Pincode</th><th>City</th><th>State</th><th>Date</th></tr>
          </thead>
          <tbody>
            {deliveries.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
                <td>{d.address}</td>
                <td>{d.mobile}</td>
                <td>{d.pincode}</td>
                <td>{d.city}</td>
                <td>{d.state}</td>
                <td>{new Date(d.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminDashboard;

