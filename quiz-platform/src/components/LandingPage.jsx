import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => (
  <div className="landing-page">
    <img src="/logo.png" alt="Quiz Platform Logo" className="logo" />
    <h1>Welcome to the Quiz Platform</h1>
    <nav>
      <ul>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  </div>
);

export default LandingPage; 