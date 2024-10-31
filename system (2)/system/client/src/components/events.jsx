import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './events.css';
import logo from './imagenew.png'; 

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`/routes/accounts/events`)
      .then(response => {
        const currentDate = new Date(); 
        const upcomingEvents = response.data.filter(event => 
          new Date(event.eventDate) >= currentDate 
        );
        setEvents(upcomingEvents);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

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

      <div className="events-container"> 
        <h2>Upcoming Events</h2>
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Volunteers</th>
              <th>Materials Needed</th>
              <th>Number of Pax</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td>{event.eventName}</td>
                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td>{event.volunteers}</td>
                <td>{event.materialsNeeded.join(', ')}</td>
                <td>{event.numberOfPax}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
