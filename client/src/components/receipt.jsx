import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './receipt.css';
import logo from './logo1.png';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const Receipt = () => {
  const [donorDetails, setDonorDetails] = useState({
    name: '',
    amount: '',
    date: '',
    image: null
  });
  const [proofsOfPayment, setProofsOfPayment] = useState([]);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username'); // Get the username from local storage

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (`0${today.getMonth() + 1}`).slice(-2); // Months are zero-based
    const day = (`0${today.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const addProofOfPayment = async () => {
    if (!donorDetails.amount || !donorDetails.date || !donorDetails.image) {
      alert('Amount, date, and image are required.');
      return;
    }

    if (!/^\d+$/.test(donorDetails.amount)) {
      alert('Please enter a valid Amount.');
      return;
    }

    const donationDate = new Date(donorDetails.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    const formData = new FormData();
    formData.append('username', username);
    formData.append('amount', donorDetails.amount);
    formData.append('date', donorDetails.date);
    formData.append('image', donorDetails.image); // Ensure this is an actual file

    try {
      const response = await axios.post('/routes/accounts/addProof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Proof of payment added:', response.data);
      setProofsOfPayment([...proofsOfPayment, response.data]); // Update state with new proof
      setDonorDetails({
        name: '',
        amount: '',
        date: getTodayDate(), // Reset to today's date
        image: null,
      });
      setError('');
      alert('Proof of payment added successfully.');
    } catch (error) {
      console.error('Failed to add proof of payment:', error.response ? error.response.data : error.message);
      setError('Failed to add proof of payment. Please try again later.');
      alert('Failed to add proof of payment. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Validate input to exclude < and > symbols
    if (value && (value.includes('<') || value.includes('>'))) {
      return; // If contains < or >, do not update state
    }

    if (name === 'amount' && !/^\d*$/.test(value)) {
      return; // If not numeric characters, do not update state
    }

    if (name === 'image') {
      setDonorDetails({
        ...donorDetails,
        [name]: files[0]
      });
    } else {
      setDonorDetails({
        ...donorDetails,
        [name]: value
      });
    }
  };

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await axios.get('/routes/accounts/proofs', {
          params: { username, approved: true }
        });
        setProofsOfPayment(response.data);
      } catch (error) {
        console.error('Error fetching proofs of payment:', error);
      }
    };

    fetchProofs();

    // Set default date to today
    setDonorDetails(prevDetails => ({
      ...prevDetails,
      date: getTodayDate()
    }));
  }, [username]);

  const generatePDF = (proof) => {
    const doc = new jsPDF();
    doc.setFontSize(25);
    doc.setFont('helvetica', 'bold');
    doc.text('iDonate', 105, 40, { align: 'center' });
    doc.setFontSize(12);
    doc.text('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ', 105, 50, { align: 'center' });
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('MINOR BASILICA OF THE BLACK NAZARENE', 105, 60, { align: 'center' });
    doc.text('SAINT JOHN THE BAPTIST | QUIAPO CHURCH', 105, 70, { align: 'center' });
    doc.text('**************************************************************************************', 105, 80, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name of Donor: ${proof.name}`, 105, 90, { align: 'center' });
    doc.text(`Amount of Donation: ${parseFloat(proof.amount).toLocaleString()} Pesos`, 105, 100, { align: 'center' });
    doc.text(`Date of Donation: ${new Date(proof.date).toLocaleDateString()}`, 105, 110, { align: 'center' });
    doc.text('*******************************************************************', 105, 120, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your donation!', 105, 130, { align: 'center' });
    doc.save('QuiapoChurch-Receipt.pdf');
  };

  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 

    try {
      const response = await fetch('http://localhost:5001/routes/accounts/logout', { // Ensure the URL is correct
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
      <div className="back-button">
        <Link to="/cash">
          <div className="circle">&lt;</div>
        </Link>
      </div>
      <div className="container-wrapperReceipt">
        <div className="containerReceipt">
          <form>
            <div className="form-group">
              <label>Name (optional):</label>
              <input
                type="text"
                name="name"
                value={donorDetails.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Amount of Donation based on Proof of Cash Donation:</label>
              <input
                type="text"
                name="amount"
                value={donorDetails.amount}
                onChange={handleChange}
                required
                placeholder="Enter amount in numbers"
              />
            </div>
            <div className="form-group">
              <label>Upload Proof of Cash Donation:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Donation:</label>
              <input
                type="date"
                name="date"
                value={donorDetails.date}
                onChange={handleChange}
                required
                max={getTodayDate()} // Disable future dates
              />
            </div>
            <button type="button" className="dB" onClick={addProofOfPayment}>
              Submit
            </button>
          </form>
        </div>
        <div className="Rcontainer1">
          <div id="Received-Table1">
            <h3>Cash Donated</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Proof of Cash Donation</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {proofsOfPayment.map(proof => (
                  <tr key={proof._id}>
                    <td>{proof.name || 'N/A'}</td>
                    <td>₱{parseFloat(proof.amount).toLocaleString()}</td>
                    <td>{new Date(proof.date).toLocaleDateString()}</td>
                    <td>{proof.approved ? 'Approved' : 'Pending'}</td>
                    <td>
                      {proof.imagePath ? (
                        <a 
                        href={`http://localhost:5001/${proof.imagePath}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="viewb"
                        >
                          View Image
                        </a>
                      ) : 'No Image'}
                    </td>
                    <td>
                      {proof.approved && (
                        <button className="dB" onClick={() => generatePDF(proof)}>Get Receipt</button>
                      )}
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

export default Receipt;
