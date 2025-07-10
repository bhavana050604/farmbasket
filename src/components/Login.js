import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { registerUser, loginUser } from "../api/auth";

function Login({ setUser }) {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    name: "",
    password: "",
    role: "farmer",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    password: "",
    role: "farmer",
    address: "",
    mobile: "",
    dob: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(loginData);
      alert("Login successful!");
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);

      if (res.user.role === "farmer") navigate("/farmer/dashboard");
      else if (res.user.role === "buyer") navigate("/buyer/dashboard");
if (res.user.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      alert(err?.error || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(signupData);
      alert("Registration successful! Please login.");
      setIsActive(false);
    } catch (err) {
      alert(err?.error || "Registration failed");
    }
  };

  return (
    <>
      {/* 🔝 Navbar */}
      <nav className="login-navbar">
        <div className="navbar-left">EFarming Portal</div>
        <div className="navbar-right">
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* 🔲 Login/Register Section */}
      <div className="login-main-wrapper">
        <div className={`container ${isActive ? "active" : ""}`}>
          {/* 🔐 Sign In */}
          <div className="form-container sign-in">
            <form onSubmit={handleLogin}>
              <h1>Sign In</h1>
              <input
                type="text"
                placeholder="Name"
                value={loginData.name}
                onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <select
                value={loginData.role}
                onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
              </select>
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"} Password
              </button>
              <button type="submit">Login</button>
            </form>
          </div>

          {/* ✏️ Sign Up */}
          <div className="form-container sign-up">
            <form onSubmit={handleRegister}>
              
              <input
                type="text"
                placeholder="Name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <select
                value={signupData.role}
                onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>
              <input
                type="text"
                placeholder="Address"
                value={signupData.address}
                onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={signupData.mobile}
                onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                required
              />
              <input
                type="date"
                value={signupData.dob}
                onChange={(e) => setSignupData({ ...signupData, dob: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"} Password
              </button>
              <button type="submit">Sign Up</button>
            </form>
          </div>

          {/* ↔️ Toggle Panels */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Sign up here</h1>
                <p>To keep connected, login with your info</p>
                <button className="hidden" onClick={() => setIsActive(false)}>
                  Login in Here
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Hey Welcome Back</h1>
                <p>Want to Register? Click the below button</p>
                <button className="hidden" onClick={() => setIsActive(true)}>
                  Register Here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ℹ️ About Section */}
      <div id="about" className="info-section">
        <h2>About Us</h2>
        <p>
          EFarming is a digital agriculture marketplace platform designed to empower farmers and buyers alike.
          It helps farmers sell their produce online directly to buyers with full transparency, traceability,
          and zero middlemen.
        </p>
        <p><strong>Why EFarming?</strong></p>
        <ul>
          <li>🚜 Direct farm-to-consumer selling</li>
          <li>📈 Real-time product pricing & bidding</li>
          <li>🌐 Geo-tagged buyer-farmer discovery</li>
          <li>📊 Market insights and analytics</li>
          <li>🔒 Secure transactions with verified users</li>
        </ul>
        <p>
          Our mission is to revolutionize agriculture by creating an accessible, technology-driven,
          and fair ecosystem that improves farmers’ income and simplifies procurement for buyers.
        </p>
      </div>

      {/* ☎️ Contact Section */}
      <div id="contact" className="info-section">
        <h2>Contact</h2>
        <p>📞 <strong>Phone:</strong> +91-1234567890</p>
        <p>📧 <strong>Email:</strong> support@efarming.com</p>
        <p>📍 <strong>Address:</strong> 123, FarmTech Street, Telangana, India</p>
        <p>⏰ <strong>Working Hours:</strong> Mon–Sat, 9:00 AM – 6:00 PM</p>
        <p>🔗 <strong>Follow Us:</strong></p>
        <ul>
        
        </ul>
      </div>
    </>
  );
}

export default Login;
