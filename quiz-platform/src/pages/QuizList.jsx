import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch quizzes from the backend
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {quizzes.map(quiz => (
        <div key={quiz._id} className="mb-4 p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
          <p>{quiz.description}</p>
          <Link to={`/quizzes/${quiz._id}/attempt`}>
            <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">Start Quiz</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default QuizList; 