import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Scores = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/quizzes/user/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setScores(response.data.history);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="scores-container">
      <h2>Your Scores</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.quizTitle}: {score.score}/{score.totalQuestions} ({score.percentage}%)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scores; 