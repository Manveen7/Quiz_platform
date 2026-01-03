// src/pages/QuizList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setQuizzes(data.quizzes);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="border p-3 mb-2 rounded shadow">
          <h3 className="text-lg font-semibold">{quiz.title}</h3>
          <p>{quiz.description}</p>
          <Link to={`/attempt/${quiz._id}`}>
            <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">Start Quiz</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default QuizList;

