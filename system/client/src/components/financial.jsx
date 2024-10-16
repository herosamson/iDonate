import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './financial.css';
import logo from './logo1.png';
import { Link } from 'react-router-dom';


const Financial = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reason, setReason] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [financialAssistance, setFinancialAssistance] = useState([]);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username'); // Get the username from local storage

  // Fetch financial requests for the logged-in user
  const fetchFinancialAssistance = async () => {
    try {
      const response = await axios.get(`/routes/accounts/financial-assistance`, {
        headers: { username }
      });
      setFinancialAssistance(response.data);
    } catch (error) {
      console.error('Failed to fetch financial requests:', error);
      alert('Failed to fetch financial requests. Please try again later.');
    }
  };

  // Add financial request
  const addFinancialAssistance = async () => {
    // Validate all fields are filled
    if (!name || !amount || !contactNumber || !reason || !targetDate) {
      alert('All fields are required.');
      return;
    }

    // Validate inputs
    if (name.includes('<') || name.includes('>')) {
      alert('Invalid characters in Name field.');
      return;
    }
    if (!/^\d+$/.test(amount)) {
      alert('Please enter a valid number for Amount.');
      return;
    }

    if (!/^\d{11}$/.test(contactNumber) || !/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number.');
      return;
    }

    const newRequest = { name, amount, contactNumber, reason, targetDate, username };
    try {
      const response = await axios.post(`/routes/accounts/financial-assistance/add`, newRequest, {
        headers: { username }
      });
      console.log('Added financial request:', response.data);
      setFinancialAssistance([...financialAssistance, response.data]); // Update state with new request
      // Clear the form fields
      setName('');
      setAmount('');
      setContactNumber('');
      setReason('');
      setTargetDate('');
      setError('');
      alert('Financial request added successfully.');
    } catch (error) {
      console.error('Failed to add financial request:', error.response ? error.response.data : error.message);
      setError('Failed to add financial request. Please try again later.');
      alert('Failed to add financial request. Please try again later.');
    }
  };

  useEffect(() => {
    fetchFinancialAssistance(); // Fetch the financial requests when the component mounts
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate input to exclude < and > symbols
    if (value.includes('<') || value.includes('>')) {
      return; // If contains < or >, do not update state
    }

    // Update state based on input name
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'amount':
        setAmount(value);
        break;
      case 'contactNumber':
        setContactNumber(value);
        break;
      case 'reason':
        setReason(value);
        break;
      case 'targetDate':
        setTargetDate(value);
        break;
      default:
        break;
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
        <div className="request-containerfinance">
          {error && <p className="error-message">{error}</p>}
          <div className="input-container">
            <h3>Financial Assistance:</h3>
            <input
              type="text"
              name="name"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="amount"
              placeholder="Amount"
              value={amount}
              onChange={handleChange}
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={handleChange}
            />
            <input
              type="text"
              name="reason"
              placeholder="Para saan ito gagamitin?"
              value={reason}
              onChange={handleChange}
            />
            <h3>Target Date:</h3>
            <input
              type="date"
              name="targetDate"
              value={targetDate}
              onChange={handleChange}
              min={today}
            />
            <button className="dB" onClick={addFinancialAssistance}>Add Financial Request</button>
          </div>
        </div>
        <div className="table-wrapperfinance">
          <div className="finance-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Target Date</th>
                  <th>Contact Number</th>
                  <th>Reason</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {financialAssistance.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.amount}</td>
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

export default Financial;
