import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './financial.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Financial = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState(''); // State for custom reason
  const [targetDate, setTargetDate] = useState('');
  const [financialAssistance, setFinancialAssistance] = useState([]);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username'); // Get the username from local storage

  // List of reasons for financial assistance
  const reasonOptions = [
    "Educational Support", 
    "Food Assistance", 
    "Medical Expenses", 
    "Burial Assistance", 
    "Disability Support", 
    "Others"
  ];

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
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    
    // Validate all fields are filled
    if (!name || !amount || !contactNumber || !reason || !targetDate || (reason === 'Others' && !customReason)) {
      alert('All fields are required.');
      return;
    }

    // Validate inputs: Name must contain only letters and spaces, and no < or >
    if (name.includes('<') || name.includes('>') || !lettersOnlyRegex.test(name)) {
      alert('Invalid characters in Name field. Please enter letters only.');
      return;
    }
    
    // Validate Reason field if custom reason is selected
    if (reason === 'Others' && (customReason.includes('<') || customReason.includes('>') || !lettersOnlyRegex.test(customReason))) {
      alert('Invalid characters in Reason field. Please enter letters only.');
      return;
    }

    // Validate Amount: Must be a number and not exceed 10,000
    if (!/^\d+$/.test(amount) || parseInt(amount, 10) > 10000) {
      alert('Please enter a valid number for Amount not exceeding 10,000.');
      return;
    }

    // Validate Contact Number: Must start with 09 and be exactly 11 digits
    if (!/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number that starts with 09 and has exactly 11 digits.');
      return;
    }

    // Use custom reason if "Others" is selected, else use the selected reason
    const finalReason = reason === 'Others' ? customReason : reason;

    // Create a new financial assistance request
    const newRequest = { name, amount, contactNumber, reason: finalReason, targetDate, username };

    try {
      const response = await axios.post(`/routes/accounts/financial-assistance/add`, newRequest, {
        headers: { username }
      });

      setFinancialAssistance([...financialAssistance, response.data]);
      
      // Clear the form fields
      setName('');
      setAmount('');
      setContactNumber('');
      setReason('');
      setCustomReason(''); // Clear custom reason field
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

    // Exclude < and > symbols
    if (value.includes('<') || value.includes('>')) return;

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
      case 'targetDate':
        setTargetDate(value);
        break;
      default:
        break;
    }
  };

  const handleReasonChange = (e) => {
    const selectedReason = e.target.value;
    setReason(selectedReason);
    if (selectedReason !== "Others") setCustomReason(''); // Clear custom reason if another option is selected
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
          <div className="circle1">&#8592;</div>
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
              type="number"
              name="amount"
              placeholder="Amount (max 10,000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value > 10000 ? 10000 : e.target.value)}
              min="1"
              max="10000"
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={handleChange}
            />
            {reason === "Others" ? (
              <input
                type="text"
                placeholder="Specify Reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            ) : (
              <select value={reason} onChange={handleReasonChange}>
                <option value="">Select Reason</option>
                {reasonOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
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
