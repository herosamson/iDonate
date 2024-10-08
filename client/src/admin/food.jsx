import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './food.css';
import logo2 from './logo2.png';
import axios from 'axios';


function Food() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [foodAssistance, setFoodAssistance] = useState([]);
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

  const fetchFoodAssistance = async () => {
    try {
      const response = await axios.get(`/routes/accounts/food-assistance/all`);
      setFoodAssistance(response.data);
    } catch (error) {
      console.error('Failed to fetch food requests:', error);
    }
  };

  const approveFoodRequest = async (id) => {
    try {
      await axios.post(`/routes/accounts/food-assistance/approve/${id}`);
      setFoodAssistance(prevState => prevState.map(request =>
        request._id === id ? { ...request, approved: true } : request
      ));
    } catch (error) {
      console.error('Failed to approve food request:', error);
    }
  };

  useEffect(() => {
    fetchFoodAssistance();
  }, []);

  return (
    <div id="containerU">
      <div id="sidebar">
      <ul>
          <li><img className="logoU" src={logo2} alt="Logo" /></li>
          <li><Link to="/analytics">Administrator Dashboard</Link></li>
          <li><Link to="/donateA">Item Donations</Link></li>
          <li><Link to="/eventsA">Events</Link></li>
          <li className="dropdown-toggle" onClick={toggleDropdown}>
            Request Assistance <span className="arrow">&#9660;</span>
          </li>
          {isDropdownOpen && (
            <ul className="dropdown-menuU">
              <li><Link to="/financialA" >Financial Assistance</Link></li>
              <li><Link to="/medicalA" >Medical Assistance</Link></li>
              <li><Link to="/legalA" >Legal Assistance</Link></li>
              <li><Link to="/foodA" >Food Subsidy</Link></li>
              <li><Link to="/disasterA" >Disaster Assistance</Link></li>
            </ul>
          )}
          <li><Link to="/inventory">Inventory</Link></li>
          <br />
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div id="contentD">
        <h1>Food Subsidy</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type(s) of Food</th>
              <th>Quantity</th>
              <th>Target Date</th>
              <th>Contact Number</th>
              <th>Location</th>
              <th>Number of Pax</th>
              <th>Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodAssistance.map((request) => (
              <tr key={request._id}>
                <td>{request.name}</td>
                <td>{request.typesOfFood}</td>
                <td>{request.quantity}</td>
                <td>{new Date(request.targetDate).toLocaleDateString()}</td>
                <td>{request.contactNumber}</td>
                <td>{request.location}</td>
                <td>{request.numberOfPax}</td>
                <td>{request.approved ? 'Yes' : 'No'}</td>
                <td>
                {!request.approved ? (
                  <button className="enable-button" onClick={() => approveFoodRequest(request._id)}>
                    Approve
                  </button>
                ) : (
                  <span>Approved</span>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Food;
