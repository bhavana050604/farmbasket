import React from "react";
import "../styles/Login.css";

export default function About() {
  return (
    <div className="farmbasket-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--farm-bg, #f6f9f6)' }}>
      <div className="glass-card" style={{ padding: '2.5rem 2rem', borderRadius: '2rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', maxWidth: 420, textAlign: 'center' }}>
        <img src="/farmbasket-logo.png" alt="FarmBasket Logo" style={{ width: 80, marginBottom: 16 }} />
        <h1 style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--farm-green, #2e7d32)', marginBottom: 8 }}>FarmBasket</h1>
        <p style={{ color: 'var(--farm-earth, #7c6f57)', fontWeight: 500, marginBottom: 16 }}>Empowering Farmers, Feeding Homes</p>
        <p style={{ color: 'var(--farm-earth, #7c6f57)', fontSize: 16 }}>
          FarmBasket is a platform connecting local farmers directly with buyers. We believe in fresh, sustainable, and fair agriculture. Our mission is to empower farmers and provide healthy food to every home.
        </p>
      </div>
    </div>
  );
}
