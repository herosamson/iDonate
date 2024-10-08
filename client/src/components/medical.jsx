import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './medical.css';
import logo from './logo1.png';
import { Link } from 'react-router-dom';


const Medical = () => {
  const [name, setName] = useState('');
  const [typeOfMedicine, setTypeOfMedicine] = useState('');
  const [quantity, setQuantity] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [reason, setReason] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [medicalAssistance, setMedicalAssistance] = useState([]);

  const username = localStorage.getItem('username'); // Get the username from local storage

  // Fetch medical requests for the logged-in user
  const fetchMedicalAssistance = async () => {
    try {
      const response = await axios.get(`/routes/accounts/medical-assistance`, {
        headers: { username }
      });
      setMedicalAssistance(response.data);
    } catch (error) {
      console.error('Failed to fetch medical requests:', error);
      alert('Failed to fetch medical requests. Please try again later.');
    }
  };

  // Add medical assistance request
  const addMedicalAssistance = async () => {
    // Validate all fields are filled
    if (!name || !typeOfMedicine || !quantity || !contactNumber || !location || !reason || !targetDate) {
      alert('All fields are required.');
      return;
    }

    // Validate inputs
    if (name.includes('<') || name.includes('>')) {
      alert('Invalid characters in Name field.');
      return;
    }

    if (!/^\d+$/.test(quantity)) {
      alert('Please enter a valid number for Quantity.');
      return;
    }

    if (!/^\d{11}$/.test(contactNumber) || !/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number.');
      return;
    }

    const newRequest = { name, typeOfMedicine, quantity, contactNumber, location, reason, targetDate, username };
    try {
      const response = await axios.post(`/routes/accounts/medical-assistance/add`, newRequest, {
        headers: { username }
      });
      console.log('Added medical assistance:', response.data.request);
      setMedicalAssistance([...medicalAssistance, response.data.request]); // Update state with new request
      // Clear the form fields
      setName('');
      setTypeOfMedicine('');
      setQuantity('');
      setContactNumber('');
      setLocation('');
      setReason('');
      setTargetDate('');
      alert('Medical request added successfully.');
    } catch (error) {
      console.error('Failed to add medical assistance:', error.response ? error.response.data : error.message);
      alert('Failed to add medical assistance. Please try again later.');
    }
  };

  useEffect(() => {
    fetchMedicalAssistance(); // Fetch the medical requests when the component mounts
  }, []);

  const handleNameChange = (e) => {
    // Remove < and > symbols from the input
    setName(e.target.value.replace(/[<>]/g, ''));
  };

  const handleTypeOfMedicineChange = (e) => {
    // Remove < and > symbols from the input
    setTypeOfMedicine(e.target.value.replace(/[<>]/g, ''));
  };

  const handleQuantityChange = (e) => {
    // Remove < and > symbols from the input
    setQuantity(e.target.value.replace(/[<>]/g, ''));
  };

  const handleContactNumberChange = (e) => {
    // Remove < and > symbols from the input
    setContactNumber(e.target.value.replace(/[<>]/g, ''));
  };

  const handleLocationChange = (e) => {
    // Remove < and > symbols from the input
    setLocation(e.target.value.replace(/[<>]/g, ''));
  };

  const handleReasonChange = (e) => {
    // Remove < and > symbols from the input
    setReason(e.target.value.replace(/[<>]/g, ''));
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
        <div className="request-containermedical">
          <div className="input-container">
            <h3>Medical Assistance:</h3>
            <input
              type="text"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={handleNameChange}
            />
            <input
              type="text"
              placeholder="Type of Medicine"
              value={typeOfMedicine}
              onChange={handleTypeOfMedicineChange}
            />
            <input
              type="text"
              placeholder="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={handleContactNumberChange}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={handleLocationChange}
            />
            <input
              type="text"
              placeholder="What type of Disease/Illness/Sickness?"
              value={reason}
              onChange={handleReasonChange}
            />
            <h3>Target Date:</h3>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={today}
            />
            <button className="dB" onClick={addMedicalAssistance}>Add Medical Request</button>
          </div>
        </div>
        <div className="table-wrappermedical">
          <div className="medical-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type of Medicine</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Target Date</th>
                  <th>Contact Number</th>
                  <th>Reason</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {medicalAssistance.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.typeOfMedicine}</td>
                    <td>{request.quantity}</td>
                    <td>{request.location}</td>
                    <td>{new Date(request.targetDate).toLocaleDateString()}</td>
                    <td>{request.contactNumber}</td>
                    <td>{request.reason}</td>
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

export default Medical;
