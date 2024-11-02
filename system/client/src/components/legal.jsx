import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './legal.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Legal = () => {
  const [name, setName] = useState('');
  const [legalType, setLegalType] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [legalRequests, setLegalRequests] = useState([]);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  const legalAssistanceTypes = [
    "Intellectual Property Law", "Family Law", "Corporate Law", "Criminal Law", "Tax Law",
    "Environmental Law", "Labour Law", "Constitutional Law", "Construction Law", "Contract",
    "Civil Procedure", "Financial Law", "Health Law", "Land Law", "Personal Injury Lawyer",
    "Legal Advice", "Corporate Lawyer", "Employment Lawyer", "Legal Advice", "Others"
  ];

  const fetchLegalRequests = async () => {
    try {
      const response = await axios.get(`/routes/accounts/legal-assistance`, {
        headers: { username }
      });
      setLegalRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch legal requests:', error);
      alert('Failed to fetch legal requests. Please try again later.');
    }
  };

  const addLegalRequest = async () => {
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    if (!name || !legalType || !contactNumber || !targetDate) {
      alert('All fields are required.');
      return;
    }

    if (name.includes('<') || name.includes('>') || !lettersOnlyRegex.test(name)) {
      alert('Invalid characters in Name field.');
      return;
    }

    if (!/^\d{11}$/.test(contactNumber) || !/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number.');
      return;
    }

    const newRequest = { name, legalType, contactNumber, targetDate, username };
    try {
      const response = await axios.post(`/routes/accounts/legal-assistance/add`, newRequest, {
        headers: { username }
      });
      setLegalRequests([...legalRequests, response.data]);
      setName('');
      setLegalType('');
      setContactNumber('');
      setTargetDate('');
      setError('');
      alert('Legal request added successfully.');
    } catch (error) {
      console.error('Failed to add legal request:', error.response ? error.response.data : error.message);
      setError('Failed to add legal request. Please try again later.');
      alert('Failed to add legal request. Please try again later.');
    }
  };

  useEffect(() => {
    fetchLegalRequests();
  }, []);

  const handleLegalTypeChange = (e) => {
    const selectedType = e.target.value;
    setLegalType(selectedType === "Others" ? "" : selectedType);
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
        localStorage.clear();
        window.location.href = '/'; 
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
        <div className="request-containerlegal">
          {error && <p className="error-message">{error}</p>}
          <div className="input-container">
            <h3>Legal Assistance:</h3>
            <input
              type="text"
              name="name"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/[<>]/g, ''))}
            />
            {legalType === "" ? (
              <input
                type="text"
                name="legalType"
                placeholder="Specify Type of Legal Assistance"
                value={legalType}
                onChange={(e) => setLegalType(e.target.value)}
              />
            ) : (
              <select name="legalType" value={legalType} onChange={handleLegalTypeChange}>
                <option value="">Select Type of Legal Assistance</option>
                {legalAssistanceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            )}
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value.replace(/[<>]/g, ''))}
            />
            <h3>Target Date:</h3>
            <input
              type="date"
              name="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={today}
            />
            <button className="dB" onClick={addLegalRequest}>Add Legal Request</button>
          </div>
        </div>
        <div className="table-wrapperlegal">
          <div className="legal-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type of Legal Assistance</th>
                  <th>Contact Number</th>
                  <th>Target Date</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {legalRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.legalType}</td>
                    <td>{request.contactNumber}</td>
                    <td>{new Date(request.targetDate).toLocaleDateString()}</td>
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

export default Legal;
