import React from 'react';
import './aboutus.css';
import logo from './logo1.png'; 
import { Link } from 'react-router-dom';
import logolatest from './imagenew.png';

class About extends React.Component {
  render() {
    return (
      <div className="homepage">
      <header className="header">
        <div className="logo">
          <img className="logo" src={logolatest} alt="Logo" />
        </div>
        <nav className="navigation">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/components/login">Login</Link></li> 
          </ul>
        </nav>
      </header>
      <section className="additional-content2">
            <div onClick={handleContainerClick}  className="cardhome">
              <div  className="card-imagebpi"></div>
              <center> <p className="card-title">BPI</p></center>
              <p className="card-body"><strong>Account Name: RCAM-Minor Basilica of the Black Nazarene</strong></p>
              <p className="card-body">Peso Savings Account # 2273-0504-37</p>
              <p className="card-body">Dollars Savings Account # 2274-0026-22</p>
              <p className="card-body">Swift Code - BIC: B O P I P H M M</p>
            </div>

            <div onClick={handleContainerClick} className="cardhome">
              <div  className="card-imagebdo"></div>
              <center> <p className="card-title">BDO</p></center>
              <p className="card-body"><strong>Account Name: RCAM-Minor Basilica of the Black Nazarene</strong></p>
              <p className="card-body">Peso Savings Account # 00454-0037-172</p>
              <p className="card-body">Dollars Savings Account # 10454-0037-164</p>
              <p className="card-body">Swift Code - BIC: B N O R P H M M</p>
            </div>

            <div onClick={handleContainerClick}  className="cardhome">
              <div  className="card-imagemaya"></div>
              <center> <p className="card-title">Paymaya</p></center>
              <p className="card-body">Mobile Number: 0961 747 7003</p>
              <p className="card-body">Name: Rufino Sescon, Jr.</p>
            </div>

            <div onClick={handleContainerClick} className="cardhome">
              <div className="card-imagegcash"></div>
              <center><p className="card-title">GCash</p></center>
              <p className="card-body">Mobile Number: 0966 863 9861</p>
              <p className="card-body">Name: Rufino Sescon, Jr.</p>
            </div>
          </section>
          
        </div>
    );
  }
}

export default About;
