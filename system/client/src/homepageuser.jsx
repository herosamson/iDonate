import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './homepageuser.css';
import { FaYoutube, FaFacebookF, FaInstagram, FaTiktok, FaCheckCircle  } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pic2 from './pic15.jpg';
import logolatest from './imagenew.png';

function HomepageU({ firstname }) {

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

  const CustomToastMessage = ({ firstname }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FaCheckCircle style={{ marginRight: '10px', color: 'green', fontSize: '20px' }} />
      <span>Welcome, {firstname}!</span>
    </div>
  );

  const handleContainerClick = () => {
    navigate('/receipt');
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">
          <img className="logo" src={logolatest} alt="Logo" />
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
        {/* Static Image Section */}
        <section className="header-section1" style={{ backgroundImage: `url(${pic2})` }}>
          <div className="header-content">
            <h2>Leave No One Behind!</h2>
            <p>Help Affected Communities Around Philippines.</p>
            <p></p>
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
              <h2>MINOR BASILICA OF THE BLACK NAZARENE</h2>
              <h2>SAINT JOHN THE BAPTIST PARISH | QUIAPO CHURCH</h2>
              <h3>Mission/Vision</h3>
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

        {/* Donation Methods */}
        <main className="main2">
          <section className="additional-content2">
            <div className="cardhome">
              <div onClick={handleContainerClick} className="card-imagebpi"></div>
              <center> <p className="card-title">BPI</p></center>
              <p className="card-body"><strong>Account Name: RCAM-Minor Basilica of the Black Nazarene</strong></p>
              <p className="card-body">Peso Savings Account # 2273-0504-37</p>
              <p className="card-body">Dollars Savings Account # 2274-0026-22</p>
              <p className="card-body">Swift Code - BIC: B O P I P H M M</p>
            </div>

            <div className="cardhome">
              <div onClick={handleContainerClick} className="card-imagebdo"></div>
              <center> <p className="card-title">BDO</p></center>
              <p className="card-body"><strong>Account Name: RCAM-Minor Basilica of the Black Nazarene</strong></p>
              <p className="card-body">Peso Savings Account # 00454-0037-172</p>
              <p className="card-body">Dollars Savings Account # 10454-0037-164</p>
              <p className="card-body">Swift Code - BIC: B N O R P H M M</p>
            </div>

            <div className="cardhome">
              <div onClick={handleContainerClick} className="card-imagemaya"></div>
              <center> <p className="card-title">Paymaya</p></center>
              <p className="card-body">Mobile Number: 0961 747 7003</p>
              <p className="card-body">Name: Rufino Sescon, Jr.</p>
            </div>

            <div className="cardhome">
              <div onClick={handleContainerClick} className="card-imagegcash"></div>
              <center><p className="card-title">GCash</p></center>
              <p className="card-body">Mobile Number: 0966 863 9861</p>
              <p className="card-body">Name: Rufino Sescon, Jr.</p>
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
