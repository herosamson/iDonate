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
       <div className="content">
        <h1>Who Are We</h1>
       </div>
         <main className="main2">
          <section className="additional-content2">
            <div className="cardhome">
              <div  className="card-imagedell"></div>
              <center> <p className="card-title">Project Manager</p></center>
              <p className="card-body">Name: Wendell Castro</p>
              <p className="card-body">Peso Savings Account # 2273-0504-37</p>
              <p className="card-body">Dollars Savings Account # 2274-0026-22</p>
              <p className="card-body">Swift Code - BIC: B O P I P H M M</p>
            </div>

            <div className="cardhome">
              <div  className="card-imagecob"></div>
              <center> <p className="card-title">Web Developer</p></center>
              <p className="card-body">Name: Jacob Elchico</p>
              <p className="card-body">Peso Savings Account # 00454-0037-172</p>
              <p className="card-body">Dollars Savings Account # 10454-0037-164</p>
              <p className="card-body">Swift Code - BIC: B N O R P H M M</p>
            </div>

            <div className="cardhome">
              <div  className="card-imagehero"></div>
              <center> <p className="card-title">Mobile Developer</p></center>
              <p className="card-body">Name: Hendric Samson</p>
              <p className="card-body">Name: Rufino Sescon, Jr.</p>
            </div>

            <div className="cardhome">
              <div className="card-imageulay"></div>
              <center><p className="card-title">Documentation</p></center>
              <p className="card-body">Mobile Number: Jolee Tejado</p>
              <p className="card-body">Name: Rufino Sescon, Jr.</p>
            </div>
          </section>
        </main>
          
        </div>
    );
  }
}

export default About;
