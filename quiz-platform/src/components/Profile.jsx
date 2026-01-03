import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Profile data:', response.data);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Redirect to login page
    navigate('/login');
  };

  const viewScores = () => {
    navigate('/scores');
  };

  return (
    <div className="profile">
      {/* <h1>User Profile</h1> */}
      {/* <h2>Profile</h2> */}
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
          {profile.role === 'student' && (
            <>
              {/* <h3>Badges</h3> */}
              <ul>
                {profile.badges.map((badge, index) => (
                  <li key={index}>{badge.name}</li>
                ))}
              </ul>
              <button onClick={viewScores}>View Scores</button>
            </>
          )}
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
