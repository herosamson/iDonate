import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo1.png';
import './homepageuser.css';
import { FaYoutube, FaFacebookF, FaInstagram, FaTiktok, FaCheckCircle  } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pic from './pic14.jpg';
import pic1 from './pic9.jpg';
import pic2 from './pic15.jpg';
import pic3 from './pic16.jpg';

function HomepageU({ firstname  }) {

  const images = [
    pic,
    pic3,
    pic2, 
    pic1,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 2 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [images.length]);

  useEffect(() => {
    if (firstname) {
      toast(<CustomToastMessage firstname={firstname}/>, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }, [firstname]);

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

  const CustomToastMessage = ({ firstname}) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FaCheckCircle style={{ marginRight: '10px', color: 'green', fontSize: '20px' }} />
      <span>Welcome, {firstname}!</span>
    </div>
  );

  return (
    <div className="homepage">
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
      <div className="homepagebody">
        <section className="header-section1" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
          <div className="header-content">
            <h2>Donate</h2>
            <p>Help Affected Communities</p>
            <p>Around Philippines.</p>
            <br />
            <Link to="/options">
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
                DONATE
              </Button>
            </Link>
          </div>
        </section>
        <main className="main1">
          <section className="additional-content">
            <section className="left-content1"></section>
            <div className="right-content">
              <h3>MINOR BASILICA OF THE BLACK NAZARENE</h3>
              <h3>SAINT JOHN THE BAPTIST PARISH | QUIAPO CHURCH</h3>
              <h4>Mission/Vision</h4>
              <br />
              <p>“A people called by the Father in Jesus Christ to be a community of persons with</p>
              <p>Fullness of Life witnessing to the Kingdom of God by living the Paschal Mystery in</p>
              <p>the power of the Holy Spirit with Mary as Companion.”</p>
              <br />
              <p>“Bayang tinawag ng Ama kay Hesukristo upang maging sambayanan ng mga</p>
              <p>taong may kaganapan buhay, sumasaksi sa paghahari ng Diyos, nagsasabuhay</p>
              <p>ng misteryo paskal, sa kapangyarihan ng Espiritu Santo, kasama ng Mahal na Ina,</p>
              <p>ang Birheng Maria.”</p>
            </div>
          </section>
        </main>
        <main className="main2">
          <section className="additional-content2">
          <div className="cardhome">
          <div class="card-imagebpi"></div>
             <center> <p class="card-title">BPI</p></center>
              <p class="card-body"><strong>Account Name: RCAM-Minor Basilica of the Black Nazarene</strong></p>
              <p class="card-body">Peso Savings Account # 2273-0504-37</p>
              <p class="card-body">Dollars Savings Account # 2274-0026-22</p>
              <p class="card-body">Swift Code - BIC: B O P I P H M M</p>
            </div>
            <div className="cardhome">
            <div class="card-imagebdo"></div>
            <center> <p class="card-title">BDO</p></center>
            <p class="card-body"><strong>Account Name: RCAM-Minor Basilica of the Black Nazarene</strong></p>
              <p class="card-body">Peso Savings Account # 00454-0037-172</p>
              <p class="card-body">Dollars Savings Account # 10454-0037-164</p>
              <p class="card-body">Swift Code - BIC: B N O R P H M M</p>
            </div>
            <div className="cardhome">
            <div class="card-imagemaya"></div>
            <center> <p class="card-title">Paymaya</p></center>
            <p class="card-body">Mobile Number: 0961 747 7003</p>
              <p class="card-body">Name: Rufino Sescon, Jr.</p>
            </div>
            <div className="cardhome">
            <div class="card-imagegcash"></div>
            <center><p class="card-title">GCash</p></center>
             <p class="card-body">Mobile Number: 0966 863 9861</p>
              <p class="card-body">Name: Rufino Sescon, Jr.</p>
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
        <ToastContainer />
      </div>
    </div>
  );
}

export default HomepageU;