import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './cash.css';
import logo from './logo1.png';
import logoG from './logoG.png';
import logoM from './picM.jpg';
import logobpi from './bpi.png';
import logobdo from './bdo.jpg';

const Cash = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 
  
    try {
      const response = await fetch('https://idonatebackend.onrender.com/routes/accounts/logout', {
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

  const handleContainerClick = () => {
    navigate('/receipt');
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
        <Link to="/cashOthers">
          <div className="circle">&lt;</div>
        </Link>
      </div>
      <div className="instructions"></div>
      <div className="containerC-wrapper">
        <div className="container-section">
          <div onClick={handleContainerClick} className="containerGcash">
            <div className='imagelogoG'><img className="imagelogoG" src={logoG} alt="Logo" /> </div>
            <div className="textGcash">
              <h2>GCash Details</h2>
              <p>Mobile Number: 0966 863 9861</p>
              <p>Name: Rufino Sescon, Jr.</p>
            </div>
          </div>
          <div onClick={handleContainerClick} className="containerPaymaya">
            <div className='imagelogoM'><img className="imagelogoM" src={logoM} alt="Logo" /></div>
            <div className="textmaya">
              <h2>Paymaya Details</h2>
              <p>Mobile Number: 0961 747 7003</p>
              <p>Name: Rufino Sescon, Jr.</p>
            </div>
          </div>
        </div>
        <div className="container-section">
          <div onClick={handleContainerClick} className="containerBPI">
            <div className='imagelogobpi'><img className="imagelogobpi" src={logobpi} alt="Logo" /></div>
            <div className="textmaya">
              <h2>BPI Bank Details</h2>
              <p>Account Name: RCAM-Minor Basilica of the Black Nazarene</p>
              <p>Peso Savings Account # 2273-0504-37</p>
              <p>Dollar Savings Account # 2274-0026-22</p>
              <p>Swift Code – BIC: B O P I P H M M</p>
            </div>
          </div>
          <div onClick={handleContainerClick} className="containerBDO">
            <div className='imagelogobdo'><img className="imagelogobdo" src={logobdo} alt="Logo" /></div>
            <div className="textbdo">
              <h2>BDO Bank Details</h2>
              <p>Account name: RCAM-Minor Basilica of the Black Nazarene</p>
              <p>Peso Savings Account # 00454-0037-172</p>
              <p>Dollar Savings Account # 10454-0037-164</p>
              <p>Swift Code – BIC: B N O R P H M M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cash;
