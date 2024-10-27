import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './disaster.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Disaster = () => {
  const [name, setName] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [numberOfPax, setNumberOfPax] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [disasterRequests, setDisasterRequests] = useState([]);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  const fetchDisasterRequests = async () => {
    try {
      const response = await axios.get(`/routes/accounts/disaster-relief`, {
        headers: { username }
      });
      setDisasterRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch disaster requests:', error);
      alert('Failed to fetch disaster requests. Please try again later.');
    }
  };

  const addDisasterRequest = async () => {
    // Regular expression for validating only letters and spaces
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
  
    // Check if all fields are filled
    if (!name || !disasterType || !numberOfPax || !contactNumber || !location || !targetDate) {
      alert('All fields are required.');
      return;
    }
  
    // Function to check if the input contains < or >
    const containsInvalidSymbols = (input) => /[<>]/.test(input);
  
    // Validate that none of the fields contain < or >
    if (containsInvalidSymbols(name) || containsInvalidSymbols(disasterType) || containsInvalidSymbols(location)) {
      alert('Symbols < and > are not allowed.');
      return;
    }
  
    // Validate name and disasterType for letters only, no numbers or symbols
    if (!lettersOnlyRegex.test(name)) {
      alert('Please enter a valid Name.');
      return;
    }
  
    if (!lettersOnlyRegex.test(disasterType)) {
      alert('Please enter a valid Disaster Type.');
      return;
    }
  
    // Validate numberOfPax for numbers only, no symbols or letters
    if (!/^\d+$/.test(numberOfPax)) {
      alert('Please enter a valid number for the Estimated Number of Pax.');
      return;
    }
  
    // Validate contactNumber for 11 digits starting with 09 and numbers only
    if (!/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number that starts with 09 and has exactly 11 digits.');
      return;
    }
  
    // No symbols or invalid characters allowed for location
    if (containsInvalidSymbols(location)) {
      alert('Please enter a valid Location.');
      return;
    }
  
    const newRequest = { name, disasterType, numberOfPax, contactNumber, location, targetDate, username };
  
    try {
      const response = await axios.post(`/routes/accounts/disaster-relief/add`, newRequest, {
        headers: { username },
      });
      setDisasterRequests([...disasterRequests, response.data]);
      setName('');
      setDisasterType('');
      setNumberOfPax('');
      setContactNumber('');
      setLocation('');
      setTargetDate('');
      setError('');
      alert('Disaster relief request added successfully.');
    } catch (error) {
      console.error('Failed to add disaster relief request:', error.response ? error.response.data : error.message);
      alert('Failed to add disaster relief request. Please try again later.');
    }
  };
  
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
  
  useEffect(() => {
    fetchDisasterRequests();
  }, []);

   // Get the current date in YYYY-MM-DD format
 const today = new Date().toISOString().split('T')[0];

  return (
    <div className="Options">
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
      <div className="back1-button">
        <Link to="/buttons">
          <div className="circle1">&#8592;</div>
        </Link>
      </div>
      <div className="containerDo">
        <div className="request-containerdisaster">
          <p className="error-message">{error}</p>
          <div className="input-container">
            <h3>Disaster Relief Assistance:</h3>
            <input
              type="text"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Type of Disaster"
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value)}
            />
            <input
              type="text"
              placeholder="Estimated Number of Pax"
              value={numberOfPax}
              onChange={(e) => setNumberOfPax(e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <h3>Target Date:</h3>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={today}
            />
            <button className="dB" onClick={addDisasterRequest}>Add Disaster Relief Request</button>
          </div>
        </div>
        <div className="table-wrapperdisaster">
          <div className="disaster-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type of Disaster Relief</th>
                  <th>Target Date</th>
                  <th>Contact Number</th>
                  <th>Location</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {disasterRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.disasterType}</td>
                    <td>{new Date(request.targetDate).toLocaleDateString()}</td>
                    <td>{request.contactNumber}</td>
                    <td>{request.location}</td>
                    <td>{request.approved ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disaster;
