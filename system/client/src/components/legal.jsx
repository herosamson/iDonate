import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './legal.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Legal = () => {
  const [name, setName] = useState('');
  const [legalType, setLegalType] = useState('');
  const [customLegalType, setCustomLegalType] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [legalRequests, setLegalRequests] = useState([]);
  const [error, setError] = useState('');
  const [hasRequestToday, setHasRequestToday] = useState(false);

  const username = localStorage.getItem('username');
  const today = new Date().toISOString().split('T')[0];

  const legalAssistanceTypes = [
    "Intellectual Property Law", "Family Law", "Corporate Law", "Criminal Law", "Tax Law",
    "Environmental Law", "Labour Law", "Constitutional Law", "Construction Law", "Contract",
    "Civil Procedure", "Financial Law", "Health Law", "Land Law", "Personal Injury Lawyer",
    "Legal Advice", "Corporate Lawyer", "Employment Lawyer", "Others"
  ];

  useEffect(() => {
    const storedDate = localStorage.getItem('legalRequestDate');
    if (storedDate === today) {
      setHasRequestToday(true);
    } else {
      setHasRequestToday(false);
    }
    fetchLegalRequests();
  }, []);

  const fetchLegalRequests = async () => {
    try {
      const response = await axios.get(`/routes/accounts/legal-assistance`, {
        headers: { username }
      });
      setLegalRequests(response.data);

      const requestToday = response.data.some(request =>
        new Date(request.submissionDate).toISOString().split('T')[0] === today
      );

      if (requestToday) {
        setHasRequestToday(true);
        localStorage.setItem('legalRequestDate', today);
      }
    } catch (error) {
      console.error('Failed to fetch legal requests:', error);
    }
  };

  const addLegalRequest = async () => {
    if (hasRequestToday) {
      alert('You have already submitted a request today. Please try again tomorrow.');
      return;
    }

    if (!name || !legalType || !contactNumber || !targetDate || (legalType === 'Others' && !customLegalType)) {
      alert('All fields are required.');
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      alert('Invalid characters in Name field.');
      return;
    }

    if (!/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number.');
      return;
    }

    const finalLegalType = legalType === "Others" ? customLegalType : legalType;
    const newRequest = { 
      name, 
      legalType: finalLegalType, 
      contactNumber, 
      targetDate, 
      username, 
      submissionDate: today 
    };

    try {
      const response = await axios.post(`/routes/accounts/legal-assistance/add`, newRequest, {
        headers: { username }
      });
      setLegalRequests([...legalRequests, response.data]);
      setHasRequestToday(true);
      localStorage.setItem('legalRequestDate', today);

      setName('');
      setLegalType('');
      setCustomLegalType('');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.includes('<') || value.includes('>')) return;

    switch (name) {
      case 'name':
        setName(value);
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

  const handleLegalTypeChange = (e) => {
    const selectedType = e.target.value;
    setLegalType(selectedType);
    if (selectedType !== "Others") setCustomLegalType('');
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="Options">
      <header className="header">
        <div className="logo">
          <img className="logo" src={logo} alt="Logo" />
        </div>
        <nav className="navigation">
          <div className="menu-icon" onClick={toggleMenu}>
            &#9776;
          </div>
          <ul className={isOpen ? "nav-links open" : "nav-links"}>
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
              onChange={handleChange}
            />
            {legalType === "Others" ? (
              <input
                type="text"
                placeholder="Specify Type of Legal Assistance"
                value={customLegalType}
                onChange={(e) => setCustomLegalType(e.target.value)}
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
            <button className="dB" onClick={addLegalRequest} disabled={hasRequestToday}>
              {hasRequestToday ? "Request Already Submitted" : "Add Legal Request"}
            </button>
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
