import React, { useState } from 'react';
import './email.css';
import logo from './imagenew.png';
import pic from './pic2.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Email() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/routes/accounts/send-reset-otp`, { email });
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem('userId', response.data.userId);
        alert('OTP has been sent to your email. Please check your inbox.');
        navigate('/verifyFP');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending OTP. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logoL-containerEmail">
          <a href="/">
            <img className="logoLEmail" src={logo} alt="Logo" />
          </a>
        </div>
       <center> <h3>Please enter your email.</h3></center>
        <form onSubmit={handleEmailSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="button-container">
            <button type="submit">Continue</button>
          </div>
        </form>
      </div>
      <div className="picture-container">
        <img className="picture" src={pic} alt="Registration" />
      </div>
    </div>
  );
}

export default Email;
