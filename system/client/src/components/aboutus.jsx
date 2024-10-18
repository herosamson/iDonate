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
        <div class="back-button">
          <Link to="/">
          <div class="circle">&lt;</div>
          </Link>
        </div>
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
      </div>
    );
  }
}

export default About;
