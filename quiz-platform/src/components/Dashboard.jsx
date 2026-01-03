import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="app">
      <div className="sidebar">
        <nav className="navigation">
          <a href="/profile">Profile</a>
          <a href="/leaderboard">Leaderboard</a>
          <a href="/quizzes">Quiz List</a>
        </nav>
      </div>
      <div className="main-content">
        <h1>Welcome to the Dashboard</h1>
        <p>Welcome to the Quiz Platform!</p>
        <nav>
          <ul>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><Link to="/quizzes">Quiz List</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
