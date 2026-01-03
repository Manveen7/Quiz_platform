import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending login data:', loginData); // Log the data being sent
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginData.email,
        password: loginData.password
      });
      
      if (response.data) {
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      // Show error message to user
      alert(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending registration data:', registerData); // Log the data being sent
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role
      });
      
      if (response.data) {
        console.log('Registration successful:', response.data);
        setIsActive(false); // Switch to login form after successful registration
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      // Show error message to user
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
          <p>or login with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className='bx bxl-google'></i></a>
            <a href="#"><i className='bx bxl-facebook'></i></a>
            <a href="#"><i className='bx bxl-github'></i></a>
            <a href="#"><i className='bx bxl-linkedin'></i></a>
          </div>
        </form>
      </div>

      {/* Registration Form */}
      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              required
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <i className='bx bxs-envelope'></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <div className="role-selection">
            <p>Select your role:</p>
            <div className="role-options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={registerData.role === 'student'}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={registerData.role === 'teacher'}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                />
                Teacher
              </label>
            </div>
          </div>
          <button type="submit" className="btn">Register</button>
          <p>or Register with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className='bx bxl-google'></i></a>
            <a href="#"><i className='bx bxl-facebook'></i></a>
            <a href="#"><i className='bx bxl-github'></i></a>
            <a href="#"><i className='bx bxl-linkedin'></i></a>
          </div>
        </form>
      </div>

      {/* Toggle Box */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={() => setIsActive(true)}>Register</button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={() => setIsActive(false)}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Auth; 