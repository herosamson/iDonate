import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pic from './pic14.jpg';
import pic1 from './pic9.jpg';
import pic2 from './pic15.jpg';
import pic3 from './pic16.jpg';
import logolatest from './imagenew.png';
import './homepage.css'; 
import { FaYoutube, FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import Button from '@mui/material/Button';

function Homepage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const images = [
    pic2, 
    pic1,
    pic,
    pic3,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 2 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [images.length]);

  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">
          <img className="logo" src={logolatest} alt="Logo" />
        </div>
        <nav className="navigation">
          <div className="menu-icon" onClick={toggleMenu}>
            &#9776;
          </div>
          <ul className={isOpen ? "nav-links open" : "nav-links"}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/components/login">Login</Link></li> 
          </ul>
        </nav>
      </header>
      <div className="homepagebody">
        <section className="header-sectionH" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
          <div className="header-content">
            <h2>Leave No One Behind!</h2>
            <p>Help Affected Communities Around Philippines. </p>
            <p></p>
            <br></br>
            <Link to="/components/login">
              <Button
                className="donate-btn"
                variant="contained"
                sx={{
                  bgcolor: '#f0e875',
                  color: 'black', 
                  '&:hover': {
                    bgcolor: '#000000', 
                    color: 'white', 
                  },
                }}
              >
                Donate
              </Button>
            </Link>
          </div>
        </section>
        <main className="main">
          <section className="additional-content">
            <section className="left-contentH">
            </section>
            <div className="right-content">
              <h2>MINOR BASILICA OF THE BLACK NAZARENE</h2>
              <h2>SAINT JOHN THE BAPTIST PARISH | QUIAPO CHURCH</h2>
              <h3>Mission/ Vision</h3>
              <br></br>
              <p>“A people called by the Father in Jesus Christ to be a community of persons with </p>
              <p>Fullness of Life witnessing to the Kingdom of God by living the Paschal Mystery in</p>   
              <p>the power of the Holy Spirit with Mary as Companion.”</p>
              <br></br>
              <p>“Bayang tinawag ng Ama kay Hesukristo upang maging sambayanan ng mga </p>
              <p>taong may kaganapan buhay, sumasaksi sa paghahari ng Diyos, nagsasabuhay </p>
              <p>ng misteryo paskal, sa kapangyarihan ng Espiritu Santo, kasama ng Mahal na Ina, ang Birheng Maria.”</p>
            </div>
          </section>
        </main>
        <main className="main2">
          <section className="additional-content2">
            <div className="cardhome">
              <div  className="card-imagedell"></div>
              <center> <p className="card-title">Project Manager</p></center>
              <p className="card-body"><strong>Name: Wendell Castro</strong></p>
              <p className="card-body">Manages the project's schedule, resources, and team 
                communication to make sure everything is completed on time.</p>
            </div>

            <div className="cardhome">
              <div  className="card-imagecob"></div>
              <center> <p className="card-title">Web Developer</p></center>
              <p className="card-body"><strong>Name: Jacob Elchico</strong></p>
              <p className="card-body">Builds the website's features and functions, ensuring it 
                works well and provides a good experience for users.</p>
            </div>

            <div className="cardhome">
              <div  className="card-imagehero"></div>
              <center> <p className="card-title">Mobile Developer</p></center>
              <p className="card-body"><strong>Name: Hendric Samson</strong></p>
              <p className="card-body">Creates and improves mobile apps for
                 Android devices, focusing on making them easy to use and efficient.</p>
            </div>

            <div className="cardhome">
              <div className="card-imageulay"></div>
              <center><p className="card-title">Documentation</p></center>
              <p className="card-body"><strong>Mobile Number: Jolee Tejado</strong></p>
              <p className="card-body">Keeps all project documents organized,
                 including requirements and user guides, to help 
                everyone understand the project and refer back to it later.</p>
            </div>
          </section>
        </main>
        <footer className="footer">
          <div className="social-icons">
            <a href="https://www.facebook.com/quiapochurch" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="icon" />
            </a>
            <a href="https://www.youtube.com/channel/UCk1MtZ7T5SOLrcIhKQw0rnw" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="icon" />
            </a>
            <a href="https://www.instagram.com/quiapochurch" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="icon" />
            </a>
            <a href="https://www.tiktok.com/@quiapo_church" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="icon" />
            </a>
          </div>
          <p>&copy; 2024 iDonate. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Homepage;
