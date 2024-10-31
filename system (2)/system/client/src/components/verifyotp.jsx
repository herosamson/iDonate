import React, { useState } from 'react';
import './verifyotp.css';
import logo from './logo1.png';
import pic from './pic2.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ForgotPasswordOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const verifyUser = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('User ID is missing. Please try the process again.');
      return;
    }

    try {
      const response = await axios.post(`/routes/accounts/verify-otp`, { userId, otp });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        alert('Verification successful. Please reset your password.');
        navigate('/Cpassword');
      }
    } catch (error) {
      console.error('Error:', error);  // Debugging log
      setError('Invalid code. Please check your email.');
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
        <h3>Please enter the One-Time Password (OTP) that was sent to your email for verification. The OTP will expire in 1 hour.</h3>
        <form onSubmit={verifyUser}>
          <input
            type="number"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="One Time Password"
            required
          />
          {error && <span className="error-text">{error}</span>}
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

export default ForgotPasswordOtp;
