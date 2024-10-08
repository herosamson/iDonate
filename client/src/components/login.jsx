import React, { useState } from 'react';
import './login.css';
import logo from './logo1.png';
import yLogo from './yahoo.png';
import pic from './pic2.jpg';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/routes/accounts/login`, loginData);
      const { userId, username, role, firstname, lastname, contact } = response.data;

      setUserRole(role);
      setIsLoggedIn(true);

      // Store user details in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', role);
      localStorage.setItem('firstname', firstname);
      localStorage.setItem('lastname', lastname);
      localStorage.setItem('contact', contact);


      onLogin(userId, username, role, firstname, lastname, contact);
    } catch (error) {
      setIsIncorrectPassword(true);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    
  };

  if (isLoggedIn) {
    if (userRole === 'superadmin') {
      return <Navigate to="/admin" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/analytics" />;
    } else if (userRole === 'staff') {
      return <Navigate to="/staffDashboard" />;
    } else {
      return <Navigate to="/homepageuser" />;
    }
  }

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="login-container">
        <div className="login-form">
          <div className="logoL-container">
            <a href="/">
              <img className="logoL" src={logo} alt="Logo" />
            </a>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={loginData.username} onChange={handleChange} placeholder="Username" required />
            <input type="password" name="password" value={loginData.password} onChange={handleChange} placeholder="Password" required />
            <center>{isIncorrectPassword && <p className="incorrect-password-message">Incorrect username or password. <a href="/email">Forgot password?</a></p>}</center>
            <div className="button-container">
              <button type="submit">Login</button>
            </div>
          </form>
          <div className="alternative-login">
            <p>- - - - - - - - - - - - - - - - - - - - or - - - - - - - - - - - - - - - - - - - -</p>
            <div className="oauth-buttons">
              <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => console.log('Login Failed')} />
            </div>
          </div>
          <div className="bottom-text">
            <p>Don't have an account? <Link to="/components/register">Sign up</Link></p>
          </div>
        </div>
        <div className="picture-container">
          <img className="picture" src={pic} alt="Registration" />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
