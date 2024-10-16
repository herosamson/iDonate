import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './request.css';
import logo from './logo1.png';
import { Link } from 'react-router-dom';


const Request = () => {
  const [requests, setRequests] = useState([]);
  const [item, setItem] = useState('');
  const [typeOfDisaster, setTypeOfDisaster] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 
  
    try {
      const response = await fetch('https://idonatebackend.onrender.com/routes/accounts/logout', {
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
  
  const fetchRequests = async () => {
    try {
      const response = await axios.get('/routes/accounts/requests');
      const username = localStorage.getItem('username');
      const userRequests = response.data.filter(request => request.username === username);
      console.log('Fetched user requests:', userRequests);
      setRequests(userRequests);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const addRequest = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setError('User not logged in');
      return;
    }

    try {
      const newRequest = { item, typeOfDisaster, location, date, username };
      const response = await axios.post('/routes/accounts/requests/add', newRequest);
      console.log('Added request:', response.data.request);
      setRequests([...requests, response.data.request]);
      setItem('');
      setTypeOfDisaster('');
      setLocation('');
      setDate('');
      setError('');
    } catch (err) {
      console.error('Error adding request:', err.response ? err.response.data : err.message);
      setError('Error adding request. Please try again later.');
    }
  };

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`/routes/accounts/requests/delete/${id}`);
      setRequests(requests.filter(request => request._id !== id));
    } catch (err) {
      console.error('Error deleting request:', err.response ? err.response.data : err.message);
      setError('Error deleting request. Please try again later.');
    }
  };

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
        <Link to="/options">
          <div className="circle1">&lt;</div>
        </Link>
      </div>
      <div className="containerDo">
        <div className="request-container">
          {error && <p className="error-message">{error}</p>}
          <div className="input-container">
            <h3>Request Item:</h3>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Item"
            />
            <input
              type="text"
              value={typeOfDisaster}
              onChange={(e) => setTypeOfDisaster(e.target.value)}
              placeholder="Type of Disaster"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />
            <h3>Date:</h3>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={addRequest}>Add Request</button>
          </div>
        </div>
        <div className="table-wrapperRe">
          <div className="table-containerRe">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type of Disaster</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={index}>
                    <td>{request.item}</td>
                    <td>{request.typeOfDisaster}</td>
                    <td>{request.location}</td>
                    <td>{request.date}</td>
                    <td>
                      <button className="delete-button" onClick={() => deleteRequest(request._id)}>Delete</button>
                    </td>
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

export default Request;
