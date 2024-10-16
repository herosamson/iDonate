import React from 'react';
import './buttons.css';
import { Link } from 'react-router-dom'; 
import logo from './logo1.png';
import foodImage from './pic13.jpg'; 
import financialImage from './pic10.jpg';
import medicalImage from './pic15.jpg';
import legalImage from './pic16.jpg';
import disasterImage from './pic14.jpg';

const Buttons = () => {
  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 
  
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/logout', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, role }), 
      });
  
      if (response.ok) {
        alert("You have successfully logged out!");
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('contact');
        window.location.href = '/'; 
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="Options">
      <header className="header">
        <div className="logo">
          <img className="logo" src={logo} alt="Logo" />
        </div>
        <nav className="navigation">
          <ul>
            <li><Link to="/homepageuser">Home</Link></li>
            <li><Link to="/options">Donate</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li> 
          </ul>
        </nav>
      </header>
      <div className="back-button">
        <Link to="/options">
          <div className="circle">&lt;</div>
        </Link>
      </div>
      <div className="wrap"> 
        <div className="containerButton-wrapper">
          <Link to="/food" className="containerButton">
            <img src={foodImage} alt="Food Subsidy" />
            <h2>Food Subsidy</h2>
          </Link>
          <Link to="/finance" className="containerButton">
            <img src={financialImage} alt="Financial Assistance" />
            <h2>Financial Assistance</h2>
          </Link>
          <Link to="/medical" className="containerButton">
            <img src={medicalImage} alt="Medical Assistance" />
            <h2>Medical Assistance</h2>
          </Link>
          <Link to="/legal" className="containerButton">
            <img src={legalImage} alt="Legal Assistance" />
            <h2>Legal Assistance</h2>
          </Link>
          <Link to="/disaster" className="containerButton">
            <img src={disasterImage} alt="Disaster Relief Assistance" />
            <h2>Disaster Relief Assistance</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Buttons;
