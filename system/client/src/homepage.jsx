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
          <div className="timeline-container"> 
        <h2>Brief history of the Black Nazarene and Quiapo Church</h2>
        <h4>by: Myrna Cacho</h4>
          <div className="timeline">
            <div className="timeline-event">
              <div className="timeline-date">2009</div>
              <div className="timeline-content">
              The Traslacion or the observance of the journey of the Black Nazarene’s image from Bagumbayan (Luneta) to Quiapo Church started during this year’s celebration of the Black Nazarene’s Fiesta.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">2006</div>
              <div className="timeline-content">
              The celebration of the 400th anniversary of the arrival of the image of the Black Nazarene in Manila.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">1989</div>
              <div className="timeline-content">
              In 1989, through the generosity of the people of Quiapo and Devotees of the Nazareno, five bronze bells and three electronic clocks were acquired from Holland.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">1987</div>
              <div className="timeline-content">
              In September 28, 1987, His Eminence, Jaime Cardinal Sin blessed the newly remodeled church and sought recognition of the church as a Basilica.

In December 11, 1987, His Holiness, Pope John Paul II granted the recognition of Quiapo Church as the Minor Basilica of the Black Nazarene because of its role in strengthening a deep popular devotion to Jesus Christ and its cultural contribution to the religiosity of the Filipino people.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">1984</div>
              <div className="timeline-content">
              The expansion of the church was initiated by Msgr. Jose Abriol to accommodate the growing population of the devotees. The project was under the supervision of Architect Jose Ma. Zaragoza and Engr. Eduardo Santiago.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">1945</div>
              <div className="timeline-content">
              Quiapo Church survived the ravage of World War II bombings. The image of Our Lady of Peace and Good Voyage (Antipolo) sought refuge in Quiapo in the midst of the war.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">1933</div>
              <div className="timeline-content">
                Fr. Magdaleno Castillo started the reconstruction of the church. The famous architect and National Artist, Don Juan Nakpil designed and supervised the construction with the help of Doña Encarnacion Orense in raising funds for the project.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">1929</div>
              <div className="timeline-content">
              Huge fire burned down the church.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">1606</div>
              <div className="timeline-content">
              The statue, entrusted to an unknown Recollect priest, was brought across the Pacific Ocean in the hold of a Galleon which arrived in Manila at an undetermined date. They brought with them a dark image of Jesus Christ, upright but kneeling on one knee and carrying a large wooden cross from Mexico. The dark portrayal of Christ reflected the native culture of its Mexican sculpture. The image was enshrined in the first church of the Recoletos at Bagumbayan (Luneta) with St. John the Baptist as patron. The image became known as the Black Nazarene.
              </div>
            </div>
            <div className="timeline-event">
              <div className="timeline-date">1603</div>
              <div className="timeline-content">
              The church made of nipa and bamboo was easily gutted by fire at the height of the Chinese rebellion.
              </div>
            </div>
          </div>
          
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
