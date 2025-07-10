import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload(); // to reset user state in App
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">EFarming</div>
      <ul>
        <li>Welcome, {user?.name} ({user?.role})</li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
