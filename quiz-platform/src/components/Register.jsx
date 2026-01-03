import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="left">
          <div className="login">Register</div>
          <div className="eula">
            By registering you agree to the terms and conditions.
          </div>
        </div>
        <div className="right">
          <div className="form">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" required />
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password" required />
            <label htmlFor="role">Role</label>
            <select id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <input type="submit" id="submit" value="Register" onClick={handleRegister} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
