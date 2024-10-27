import React from 'react';
import './cashOthers.css';
import { Link, useNavigate } from 'react-router-dom'; 
import logo from './imagenew.png';
import pic3 from './pic11.jpg';
import pic4 from './cash.png';


const CashOthers = () => {
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
      <div class="back-button">
          <Link to="/options">
          <div class="circle">&#8592;</div>
          </Link>
        </div>
      <div className="container1-wrapper">
        <div className="container1">
        <img src={pic4} alt="Donate" className="image3" />
          <h1>Pera (Cash)</h1>
          
          <button className="dB" onClick={() => navigate('/cash')}>Donate</button> 
        </div>
        <div className="container1">
        <img src={pic3} alt="Donate" className="image4" />
          <h1>Mga bagay (Items)</h1>
        
          <button className="dB" onClick={() => navigate('/others')}>Donate</button> 
        </div>
        
      </div>
    </div>
  );
};

export default CashOthers;
