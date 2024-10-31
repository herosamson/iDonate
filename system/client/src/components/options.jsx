import React from 'react';
import './options.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from './imagenew.png';
import pic1 from './pic6.jpg';
import pic2 from './pic8.jpg';

const Options = () => {
  const navigate = useNavigate();

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

        <div className="container1-wrapper">
      <div className="containerOptions">
      <img src={pic1} alt="Donate" className="image1" />
        <h2>Donate</h2>
        <p>
        Donating to a community affected by disasters means providing essential support to 
        people impacted by calamities such as floods, earthquakes, or typhoons.
        </p>
        <button className="dB" onClick={() => navigate('/cashOthers')}>Donate Now</button>
      </div>
      <div className="containerOptions">
      <img src={pic2} alt="Request Donation" className="image2" />
        <h2>Request Assistance</h2>
        <p>   
        Requesting donations means seeking help during challenging times. If you are in a community
        affected by disasters like floods, earthquakes,
        or typhoons, receiving donations can provide you with essential support.
        </p>
        <button className="dB" onClick={() => navigate('/buttons')}>Request Assistance</button>
      </div>
    </div>
    </div>
    
  );
};

export default Options;
