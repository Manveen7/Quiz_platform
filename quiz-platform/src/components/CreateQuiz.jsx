import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const navigate = useNavigate();

  // Initialize state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', ''], correctAnswer: '' },
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes for title and description
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  // Handle question changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', ''], correctAnswer: '' }]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await fetch('http://localhost:5000/api/quizzes/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include token in Authorization header
            },
            body: JSON.stringify({
                title,
                description,
                questions: questions.map((q) => ({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                })),
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Quiz created successfully!');
            navigate('/my-quizzes'); // Redirect to My Quizzes page
        } else {
            setMessage(data.message || 'Failed to create quiz');
        }
    } catch (error) {
        console.error('Error creating quiz:', error);
        setMessage('Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create a New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>

        <div>
          <h3>Questions:</h3>
          {questions.map((question, index) => (
            <div key={index} className="question">
              <label>Question Text:</label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                required
              />

              <label>Options:</label>
              {question.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...question.options];
                    updatedOptions[optIndex] = e.target.value;
                    handleQuestionChange(index, 'options', updatedOptions);
                  }}
                  required
                />
              ))}

              <label>Correct Answer:</label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                required
              />

              <button type="button" onClick={() => removeQuestion(index)}>
                Remove Question
              </button>
            </div>
          ))}

          <button type="button" onClick={addQuestion}>
            Add Question
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateQuiz;
