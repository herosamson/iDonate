import React, { useState } from 'react';
import './verifyotp.css';
import logo from './logo1.png';
import pic from './pic2.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ChangePassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); 

    if (!userId) {
      alert('User ID is missing. Please try again.');
      return;
    }

    try {
      const response = await axios.put(`/routes/accounts/user/change-password/${userId}`, { password });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        alert('Password changed successfully. Please log in with your new password.');
        navigate('/components/login');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while changing the password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logoVerify-container">
          <a href="/">
            <img className="logoVerify" src={logo} alt="Logo" />
          </a>
        </div>
      <center> <h3>You can now change your password.</h3></center> 
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter New Password"
            required
          />
          {error && <p className="error-text">{error}</p>}
          <div className="buttonVerify">
            <button className="sBtnV" type="submit">Continue</button>
          </div>
        </form>
      </div>
      <div className="picture-container">
        <img className="picture" src={pic} alt="Registration" />
      </div>
    </div>
  );
}

export default ChangePassword;
