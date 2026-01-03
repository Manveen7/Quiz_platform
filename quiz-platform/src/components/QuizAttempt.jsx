import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './QuizAttempt.css';

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  console.log('Quiz ID:', quizId); // Debugging line
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${quizId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setQuiz(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correctCount++;
    });

    setScore(correctCount);
    setSubmitted(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError("You must be logged in to submit the quiz.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/quizzes/${quizId}/attempt`,
        {
          answers,
          score: correctCount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again later.');
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="quiz-attempt-container">
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <form onSubmit={(e) => e.preventDefault()}>
        {quiz.questions.map((q, i) => (
          <div key={i} className="question-container">
            <h4>{i + 1}. {q.questionText}</h4>
            {q.options.map((option, j) => (
              <label key={j} className="option-label">
                <input
                  type="radio"
                  name={`question-${i}`}
                  value={option}
                  checked={answers[i] === option}
                  onChange={() => handleOptionChange(i, option)}
                  disabled={submitted}
                />
                {option}
              </label>
            ))}
          </div>
        ))}

        {!submitted && (
          <button
            type="button"
            onClick={handleSubmit}
            className="submit-button"
          >
            Submit Quiz
          </button>
        )}

        {submitted && (
          <div className="result-container">
            <h3>Your Score: {score} / {quiz.questions.length}</h3>
            <p>Percentage: {(score / quiz.questions.length * 100).toFixed(2)}%</p>
            <button onClick={() => navigate('/quizzes')}>Back to Quiz List</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuizAttempt;
