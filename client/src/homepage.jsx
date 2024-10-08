import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo1.png';
import pic from './pic14.jpg';
import pic1 from './pic9.jpg';
import pic2 from './pic15.jpg';
import pic3 from './pic16.jpg';
import './homepage.css'; 
import { FaYoutube, FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';

function Homepage() {
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
          <img className="logo" src={logo} alt="Logo" />
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
      <div className="homepagebody">
        <section className="header-sectionH" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
          <div className="header-content">
            <h2>Donate</h2>
            <p>Help Affected Communities </p>
            <p>Around Philippines.</p>
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
              <h3>MINOR BASILICA OF THE BLACK NAZARENE</h3>
              <h4>SAINT JOHN THE BAPTIST PARISH | QUIAPO CHURCH</h4>
              <h3>Vision</h3>
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
            <div className="container">
              <h3></h3>
              <p>You can add more paragraphs or other content as needed.</p>
              <p>You can add more paragraphs or other content as needed.</p>
            </div>
            <div className="container">
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: 'series A' },
                      { id: 1, value: 15, label: 'series B' },
                      { id: 2, value: 20, label: 'series C' },
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                height={200}
              />
            </div>
            <div className="container">
              <h3>Right Content Title</h3>
              <p>You can add more paragraphs or other content as needed.</p>
              <p>You can add more paragraphs or other content as needed.</p>
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
