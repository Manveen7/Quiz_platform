// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leaderboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setLeaders(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };

    const userRole = localStorage.getItem('role');
    setRole(userRole);

    fetchLeaders();
  }, []);

  const handleRemove = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this student?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/leaderboard/remove-student/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Student removed successfully');
      setLeaders(leaders.filter((user) => user._id !== userId));
    } catch (err) {
      console.error('Error removing student:', err);
      alert('Failed to remove student');
    }
  };

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-heading">Leaderboard</h2>
      {leaders.length > 0 ? (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Score</th>
              {/* <th>Quizzes Attempted</th> */}
              {role === 'teacher' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, index) => (
              <tr key={user._id || index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.totalScore}</td>
                {/* <td>{user.quizzesAttempted}</td> */}
                {role === 'teacher' && (
                  <td>
                    <button
                      style={{ backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                      onClick={() => handleRemove(user._id)}
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available yet.</p>
      )}
    </div>
  );
};

export default Leaderboard;
