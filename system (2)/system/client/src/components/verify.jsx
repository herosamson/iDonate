import React, { useState } from 'react';
import './verify.css';
import logo from './logo1.png';
import pic from './pic2.jpg';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';


function OTP() {
  const [otp, setOtp] = useState('');
  const [error] = useState('');
  const navigate = useNavigate();

  const verifyUser = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

    if (!userId) {
      alert("User ID is missing. Please try registering again.");
      return;
    }

    try {
      const response = await axios.post(`/routes/accounts/verify-otp`, { userId, otp });

      if (response.data.error) {
        alert(response.data.error);
      } else {
        setOtp("");
        alert("Verification successful. Please log in.");
        navigate("/components/login");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during verification. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logoVerify-container">
          <a href="/">
            <img className="logoVerify" src={logo} alt="Logo" />
          </a>
        </div>
        <h3>Please enter the One-Time Password (OTP) sent to your email to verify your identity.</h3>
        <form onSubmit={verifyUser}>
          <input
            type="number"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="One Time Password"
            required
          />
          <p><strong>Note: </strong>Do not close or reload this page. The OTP will expire in 1 hour.</p>
          {error && <p className="error-text">{error}</p>}
          <div className="buttonVerify">
            <button className="sBtnV" type="submit">Continue</button>
            <button className="sBtnVD" type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
      <div className="picture-container">
        <img className="picture" src={pic} alt="Registration" />
      </div>
    </div>
  );
}

export default OTP;
