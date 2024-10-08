import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './food.css';
import logo from './logo1.png';
import { Link } from 'react-router-dom';


const Food = () => {
  const [name, setName] = useState('');
  const [typesOfFood, setTypesOfFood] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [numberOfPax, setNumberOfPax] = useState('');
  const [foodAssistance, setFoodAssistance] = useState([]);

  const username = localStorage.getItem('username');

  const fetchFoodAssistance = async () => {
    try {
      const response = await axios.get(`/routes/accounts/food-assistance`, {
        headers: { username }
      });
      setFoodAssistance(response.data);
    } catch (error) {
      console.error('Failed to fetch food requests:', error);
    }
  };

  const addFoodAssistance = async () => {
    if (!name || !typesOfFood || !contactNumber || !location || !targetDate || !numberOfPax) {
      alert('All fields are required.');
      return;
    }

    if (name.includes('<') || name.includes('>')) {
      alert('Invalid characters in Name field.');
      return;
    }

    if (!/^\d{11}$/.test(contactNumber) || !/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number.');
      return;
    }

    if (!/^\d+$/.test(numberOfPax)) {
      alert('Please enter a valid number for the Estimated Number of Pax.');
      return;
    }

    const newRequest = { name, typesOfFood, contactNumber, location, targetDate, numberOfPax, username };
    try {
      const response = await axios.post(`/routes/accounts/food-assistance/add`, newRequest, {
        headers: { username }
      });
      console.log('Added food request:', response.data.request);
      setFoodAssistance([...foodAssistance, response.data.request]);
      setName('');
      setTypesOfFood('');
      setContactNumber('');
      setLocation('');
      setTargetDate('');
      setNumberOfPax('');
      alert('Food request added successfully.');
    } catch (error) {
      console.error('Failed to add food request:', error.response ? error.response.data : error.message);
      alert('Failed to add food request. Please try again later.');
    }
  };

  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 
  
    try {
      const response = await fetch('http://localhost:5001/routes/accounts/logout', {
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
    fetchFoodAssistance();
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
          <div className="circle1">&lt;</div>
        </Link>
      </div>
      <div className="containerDo">
        <div className="request-containerfood">
          <div className="input-container">
            <h3>Food Assistance:</h3>
            <input
              type="text"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Type(s) of Food"
              value={typesOfFood}
              onChange={(e) => setTypesOfFood(e.target.value)}
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
            <input
              type="number"
              placeholder="Number of Pax"
              value={numberOfPax}
              onChange={(e) => setNumberOfPax(e.target.value)}
            />
            <button className="dB" onClick={addFoodAssistance}>Add Food Request</button>
          </div>
        </div>
        <div className="table-wrapperfood">
          <div className="food-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type(s) of Food</th>
                  <th>Target Date</th>
                  <th>Contact Number</th>
                  <th>Location</th>
                  <th>Number of Pax</th>
                  <th>Approved</th> 
                </tr>
              </thead>
              <tbody>
                {foodAssistance.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.typesOfFood}</td>
                    <td>{new Date(request.targetDate).toLocaleDateString()}</td>
                    <td>{request.contactNumber}</td>
                    <td>{request.location}</td>
                    <td>{request.numberOfPax}</td>
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

export default Food;
