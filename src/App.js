// frontend/src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentPage from "./pages/PaymentPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <Router>
      {user && <Navbar user={user} />}
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />

        {user?.role === "admin" && (
          <Route path="/admin/dashboard" element={<AdminDashboard user={user} />} />
        )}
        {user?.role === "farmer" && (
          <Route path="/farmer/dashboard" element={<FarmerDashboard user={user} />} />
        )}
        {user?.role === "buyer" && (
          <>
            <Route path="/buyer/dashboard" element={<BuyerDashboard user={user} />} />
            <Route path="/payment" element={<PaymentPage />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
