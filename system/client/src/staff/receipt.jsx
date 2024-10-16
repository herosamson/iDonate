import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './receipt.css';
import logo2 from './logo2.png';
import axios from 'axios';

function ReceiptS() {
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await axios.get(`https://idonatebackend.onrender.com/routes/accounts/proofs/all`);
        const sortedProofs = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setProofs(sortedProofs);
      } catch (error) {
        console.error('Error fetching proofs of payment:', error);
        alert('Failed to fetch proofs of payment. Please try again later.');
      }
    };

    fetchProofs();
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
        localStorage.clear();
        window.location.href = '/'; 
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  const approvePayment = async (id) => {
    if (!window.confirm('Are you sure you want to approve this payment?')) {
      return;
    }

    try {
      const response = await axios.patch(`https://idonatebackend.onrender.com/routes/accounts/proofs/${id}/approve`);
      setProofs(proofs.map(proof => proof._id === id ? response.data : proof));
      alert('Payment approved successfully.');
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Failed to approve payment. Please try again later.');
    }
  };

  return (
    <div id="containerU">
      <div id="sidebarU">
      <ul>
          <li><img className="logoD" src={logo2} alt="Logo" /></li>
          <br />
          <br />
          <li><Link to="/staffDashboard">Staff Dashboard</Link></li>
          <li><Link to="/donations">Item Donations</Link></li>
          <li><Link to="/receiptS">Cash Donations</Link></li>
          <li><Link to="/inventoryS">Inventory</Link></li>
          <br />
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div id="contentD">
        <h2>Cash Donations</h2>
        <table>
          <thead>
            <tr>
              <th>Name of Donor</th>
              <th>Amount of Donation</th>
              <th>Date of Donation</th>
              <th>Proof of Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {proofs.map((proof) => (
              <tr key={proof._id}>
                <td>{proof.name || 'N/A'}</td>
                <td>₱{parseFloat(proof.amount).toLocaleString()}</td>
                <td>{new Date(proof.date).toLocaleDateString()}</td>
                <td>
                  {proof.imagePath ? (
                    <a 
                      href={`https://idonatebackend.onrender.com/${proof.imagePath}`} // Adjust the URL based on your backend
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="view-image-button"
                    >
                      View Image
                    </a>
                  ) : 'No Image'}
                </td>
                <td>
                  {proof.approved ? (
                    <span className="verified-status">Verified</span>
                  ) : (
                    <button className="approve-button" onClick={() => approvePayment(proof._id)}>
                      Good
                    </button>
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

export default ReceiptS;
