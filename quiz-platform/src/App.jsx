import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CreateQuiz from './components/CreateQuiz';
import QuizList from './components/QuizList';
import QuizAttempt from './components/QuizAttempt';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import MyQuizzes from './components/MyQuizzes';
import LandingPage from './components/LandingPage';
import Scores from './components/Scores';
import './App.css';
import './styles.css';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const role = localStorage.getItem('role'); // Assuming role is stored in localStorage

  return (
    <div className="app">
      <div className="sidebar">
        <nav className="navigation">
          <a href="/profile">Profile</a>
          <a href="/leaderboard">Leaderboard</a>
          {role === 'student' && <a href="/quizzes">Quiz List</a>}
          {role === 'teacher' && <a href="/create-quiz">Create Quiz</a>}
          {role === 'teacher' && <a href="/my-quizzes">My Quizzes</a>}
        </nav>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/dashboard" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/create-quiz" element={<MainLayout><CreateQuiz /></MainLayout>} />
        <Route path="/quizzes" element={<MainLayout><QuizList /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/leaderboard" element={<MainLayout><Leaderboard /></MainLayout>} />
        <Route path="/attempt/:quizId" element={<QuizAttempt />} />
        <Route path="/my-quizzes" element={<MainLayout><MyQuizzes /></MainLayout>} />
        <Route path="/scores" element={<MainLayout><Scores /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
