import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyQuizzes.css';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/quizzes/my-quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchMyQuizzes();
  }, []);

  return (
    <div className="my-quizzes-container">
      <h2>My Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>{quiz.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyQuizzes; 