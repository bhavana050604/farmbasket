import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { registerUser, loginUser } from "../api/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // --- Validation function for signup ---
  const validateSignup = () => {
    const password = signupData.password;
    // Password: min 6 chars, 1 uppercase, 1 special char, 1 number
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number.");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("Password must contain at least one special character.");
      return false;
    }
    // Mobile: required, 10 digits
    if (!signupData.mobile || !/^\d{10}$/.test(signupData.mobile)) {
      toast.error("Mobile number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(loginData);
      toast.success("Login successful!");
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);

      if (res.user.role === "farmer") navigate("/farmer/dashboard");
      else if (res.user.role === "buyer") navigate("/buyer/dashboard");
      else if (res.user.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.error || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateSignup()) {
      return;
    }
    try {
      await registerUser(signupData);
      toast.success("Registration successful! Please login.");
      setIsActive(false);
    } catch (err) {
      // Show the backend error if available
      if (err?.response?.data?.error) {
        toast.error(err.response.data.error);
      } else if (err?.error) {
        toast.error(err.error);
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="login-navbar">
        <div className="navbar-left">Farm Basket 🌾🧺</div>
        <div className="navbar-right">
          <a href="#about">About Us</a>
        </div>
      </nav>

      <div className="login-main-wrapper">
        <div className={`container ${isActive ? "active" : ""}`}>
          {/* Sign In Form */}
          <div className="form-container sign-in">
            <form onSubmit={handleLogin}>
              <h1>Sign In</h1>
              <input
                type="text"
                placeholder="Name"
                value={loginData.name}
                onChange={(e) =>
                  setLoginData({ ...loginData, name: e.target.value })
                }
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <select
                value={loginData.role}
                onChange={(e) =>
                  setLoginData({ ...loginData, role: e.target.value })
                }
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
              <button type="submit">Login</button>
            </form>
          </div>

          {/* Sign Up Form */}
          <div className="form-container sign-up">
            <form onSubmit={handleRegister}>
              <h3>Sign Up</h3>
              <input
                type="text"
                placeholder="Name"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                required
              />
              <select
                value={signupData.role}
                onChange={(e) =>
                  setSignupData({ ...signupData, role: e.target.value })
                }
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>
              <input
                type="text"
                placeholder="Address"
                value={signupData.address}
                onChange={(e) =>
                  setSignupData({ ...signupData, address: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={signupData.mobile}
                onChange={(e) =>
                  setSignupData({ ...signupData, mobile: e.target.value })
                }
                required
              />
              <label className="dob-label">Date of Birth</label>
              <input
                type="date"
                value={signupData.dob}
                onChange={(e) =>
                  setSignupData({ ...signupData, dob: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
              <button type="submit">Sign Up</button>
            </form>
          </div>

          {/* Toggle Panels */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Sign up here</h1>
                <p>To keep connected, login with your info</p>
                <button className="hidden" onClick={() => setIsActive(false)}>
                  Login Here
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

      {/* About Us Section */}
      <div id="about" className="info-section">
        <h2>About Us</h2>
        <p>
          FarmBasket is a digital agriculture marketplace platform designed to
          empower farmers and buyers. It helps farmers sell their produce online
          directly to buyers with full transparency, traceability, and zero
          middlemen.
        </p>
        <p><strong>Why FarmBasket?</strong></p>
        <ul>
          <li>🚜 Direct farm-to-consumer selling</li>
          <li>📈 Real-time product pricing & bidding</li>
          <li>🔒 Secure transactions with verified users</li>
        </ul>
        <h2>Contact Us</h2>
        <ul>
          <li><strong>Name:</strong> Karthikeya Pisupati</li>
          <li><strong>Email:</strong> <a href="mailto:pisupatikarthikeyabharadwaja@gmail.com">pisupatikarthikeyabharadwaja@gmail.com</a></li>
          <li><strong>Phone:</strong> +91 7075686837</li>
          <li><strong>Location:</strong> Guntur</li>
        </ul>
      </div>
    </>
  );
}

export default Login;
