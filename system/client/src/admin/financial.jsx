import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './financial.css';
import logo2 from './logo2.png';
import axios from 'axios';


function Financial() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const [financialAssistance, setFinancialAssistance] = useState([]);

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
    fetchFinancialAssistance();
  }, []);

  const fetchFinancialAssistance = async () => {
    try {
      const response = await axios.get(`/routes/accounts/financial-assistance/all`);
      setFinancialAssistance(response.data);
    } catch (error) {
      console.error('Failed to fetch financial requests:', error);
    }
  };

  const approveRequest = async (id) => {
    try {
      await axios.patch(`/routes/accounts/financial-assistance/approve/${id}`);
      setFinancialAssistance(prevState => prevState.map(request =>
        request._id === id ? { ...request, approved: true } : request
      ));
    } catch (error) {
      console.error('Failed to approve financial request:', error);
      alert('Failed to approve financial request. Please try again later.');
    }
  };

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
        <h1>Financial Assistance</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Target Date</th>
              <th>Contact Number</th>
              <th>Reason</th>
              <th>Approved</th>
              <th>Actions</th>
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
                <td>
                {!request.approved ? (
                  <button className="enable-button" onClick={() => approveRequest(request._id)}>
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

export default Financial;
