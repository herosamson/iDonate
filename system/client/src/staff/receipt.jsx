import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './receipt.css';
import logo2 from './logo2.png';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ReceiptS() {
  const [proofs, setProofs] = useState([]);
  const [filteredProofs, setFilteredProofs] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await axios.get(`https://idonate1.onrender.com/routes/accounts/proofs/all`);
        const sortedProofs = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setProofs(sortedProofs);
        setFilteredProofs(sortedProofs);
      } catch (error) {
        console.error('Error fetching proofs of payment:', error);
        alert('Failed to fetch proofs of payment. Please try again later.');
      }
    };

    fetchProofs();
  }, []);

  useEffect(() => {
    const filterProofs = () => {
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      let filtered;
      if (filter === 'Today') {
        filtered = proofs.filter(proof => new Date(proof.date) >= todayStart);
      } else if (filter === 'This Week') {
        filtered = proofs.filter(proof => new Date(proof.date) >= weekStart);
      } else if (filter === 'This Month') {
        filtered = proofs.filter(proof => new Date(proof.date) >= monthStart);
      } else {
        filtered = proofs;
      }
      setFilteredProofs(filtered);
    };

    filterProofs();
  }, [filter, proofs]);

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
      alert("An error occurred during logout. Please try again.");
    }
  };

  const approvePayment = async (id) => {
    if (!window.confirm('Are you sure you want to approve this payment?')) {
      return;
    }

    try {
      const response = await axios.patch(`https://idonate1.onrender.com/routes/accounts/proofs/${id}/approve`);
      setProofs(proofs.map(proof => proof._id === id ? response.data : proof));
      alert('Payment approved successfully.');
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Failed to approve payment. Please try again later.');
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const title = 'MINOR BASILICA OF THE BLACK NAZARENE';
    const xPos = (doc.internal.pageSize.getWidth() - doc.getTextWidth(title)) / 2;
    doc.text(title, xPos, 22);

    const lineY = 28;
    const lineWidth = 1.2;
    doc.setLineWidth(lineWidth);
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 30;
    doc.line(margin, lineY, pageWidth - margin, lineY);

    doc.setFontSize(14);
    const title2 = 'SAINT JOHN THE BAPTIST PARISH | QUIAPO CHURCH';
    const xPos2 = (doc.internal.pageSize.getWidth() - doc.getTextWidth(title2)) / 2;
    doc.text(title2, xPos2, 38);

    doc.setFontSize(16);
    doc.text('Cash Donations Report', 14, 56);

    doc.autoTable({
      startY: 65,
      head: [['Name of Donor', 'Amount of Donation', 'Date of Donation', 'Status']],
      body: filteredProofs.map(proof => [
        proof.name || 'N/A',
        `${parseFloat(proof.amount).toLocaleString()} Pesos`,
        new Date(proof.date).toLocaleDateString(),
        proof.approved ? 'Verified' : 'Pending'
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: '#740000',
        textColor: 255,
      },
      styles: {
        fillColor: '#FFFFFF',
        textColor: 0,
      },
    });

    doc.save('iDonate_CashDonation-Report.pdf');
  };

  return (
    <div id="containerU">
      <div id="sidebarU">
        <ul>
          <li><img className="logoD" src={logo2} alt="Logo" /></li>
          <li><Link to="/staffDashboard">Staff Dashboard</Link></li>
          <li><Link to="/donations">Item Donations</Link></li>
          <li><Link to="/receiptS">Cash Donations</Link></li>
          <li><Link to="/inventoryS">Inventory</Link></li>
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div id="contentD">
        <h2>Cash Donations</h2>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        
        </div>
        <button className="print-report-button" onClick={downloadReport}>Download PDF Report</button>
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
            {filteredProofs.map((proof) => (
              <tr key={proof._id}>
                <td>{proof.name || 'N/A'}</td>
                <td>₱{parseFloat(proof.amount).toLocaleString()}</td>
                <td>{new Date(proof.date).toLocaleDateString()}</td>
                <td>
                  {proof.imagePath ? (
                    <a 
                      href={`https://idonate1.onrender.com/${proof.imagePath}`} 
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
                    <button className="enable-button"  onClick={() => approvePayment(proof._id)}>
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