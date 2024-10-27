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
         <main className="main2">
          <section className="additional-content2">
            <div className="cardhome">
              <div  className="card-imagedell"></div>
              <center> <p className="card-title">Project Manager</p></center>
              <p className="card-body">Name: Wendell Castro</p>
              <p className="card-body">Manages the project's schedule, resources, and team 
                communication to make sure everything is completed on time.</p>
            </div>

            <div className="cardhome">
              <div  className="card-imagecob"></div>
              <center> <p className="card-title">Web Developer</p></center>
              <p className="card-body">Name: Jacob Elchico</p>
              <p className="card-body">Builds the website's features and functions, ensuring it 
                works well and provides a good experience for users.</p>
            </div>

            <div className="cardhome">
              <div  className="card-imagehero"></div>
              <center> <p className="card-title">Mobile Developer</p></center>
              <p className="card-body">Name: Hendric Samson</p>
              <p className="card-body">Creates and improves mobile apps for
                 Android devices, focusing on making them easy to use and efficient.</p>
            </div>

            <div className="cardhome">
              <div className="card-imageulay"></div>
              <center><p className="card-title">Documentation</p></center>
              <p className="card-body">Mobile Number: Jolee Tejado</p>
              <p className="card-body">Keeps all project documents organized,
                 including requirements and user guides, to help 
                everyone understand the project and refer back to it later.</p>
            </div>
          </section>
        </main>
          
        </div>
    );
  }
}

export default About;
