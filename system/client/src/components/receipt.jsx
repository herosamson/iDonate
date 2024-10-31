import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './receipt.css';
import logo from './logo1.png';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

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
  const contact = localStorage.getItem('contact'); 
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

  const formData = new FormData();
  formData.append('username', username);  // Username from local storage
  formData.append('amount', donorDetails.amount);
  formData.append('date', donorDetails.date);
  formData.append('image', donorDetails.image);  // Image is required
  formData.append('contact', contact);   // Include the contact from local storage

  // Append name only if it's provided
  if (donorDetails.name.trim() !== '') {
    formData.append('name', donorDetails.name);  // Add the optional name here
  }

  try {
    const response = await axios.post('/routes/accounts/addProof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setProofsOfPayment([...proofsOfPayment, response.data]);
    setDonorDetails({
      name: '',
      amount: '',
      date: getTodayDate(),
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

  // Regular expression for validating alphabetic characters and spaces
  const lettersOnlyRegex = /^[A-Za-z\s]*$/;

  if (value && (value.includes('<') || value.includes('>'))) {
    return; // If contains < or >, do not update state
  }

  // Validate name input to allow only letters and spaces
  if (name === 'name' && !lettersOnlyRegex.test(value)) {
    alert('Please enter letters only for the name.');
    return;
  }

  // Validate amount input to allow only numeric characters
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

  const generatePDF = async (proof) => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape', // Change to landscape for 8.5 x 4.25
        unit: 'in', // Change to inches
        format: [8.5, 4.25], // Set the paper size to 8.5 x 4.25 inches
      });
  
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let currentY = 0.2; // Starting Y position with some margin
  
      const img = new Image();
      img.src = logo;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const imgWidth = 2; // Set desired width in inches
        const imgHeight = (img.naturalHeight / img.naturalWidth) * imgWidth; // Maintain aspect ratio
        doc.addImage(img, 'PNG', (pageWidth - imgWidth) / 2, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 0.1; // Increase Y position after adding image
        currentY += 0.3; // Space below the receipt title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('MINOR BASILICA OF THE BLACK NAZARENE', pageWidth / 2, currentY, { align: 'center' });
        currentY += 0.2; // Space below the organization name
        currentY += 0.1; // Additional space after line
        doc.text('SAINT JOHN THE BAPTIST | QUIAPO CHURCH', pageWidth / 2, currentY, { align: 'center' });
        currentY += 0.1; // Space below the second organization name
        currentY += 0.1; // Space below the second organization name
        doc.setLineWidth(0.02); // Set the line width to a thinner value
        doc.line(1, currentY, pageWidth - 1, currentY); // Draw line after the receipt ID
        currentY += 0.2; // Additional space after line
        currentY += 0.1; // Space below the second organization name
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Donation Receipt', pageWidth / 2, currentY, { align: 'center' });
        currentY += 0.4; // Space below the receipt title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const receiptData = [
          { label: 'Name of Donor', value: proof.name || 'Anonymous' },
          { label: 'Amount of Donation', value: `${parseFloat(proof.amount).toLocaleString()} pesos` },
          { label: 'Date of Donation', value: new Date(proof.date).toLocaleDateString() },
        ];
        receiptData.forEach(item => {
          doc.setFont('helvetica', 'bold');
          doc.text(`${item.label}:`, 1, currentY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${item.value}`, 3, currentY); // Adjusted x position for the value
          currentY += 0.3; // Space between items
        });
        doc.setLineWidth(0.02); // Set the line width to a thinner value
        doc.line(1, currentY, pageWidth - 1, currentY); // Draw line after the receipt ID
        currentY += 0.15; // Additional space after line
        currentY += 0.2; // Space before the thank you note
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your generous donation!', pageWidth / 2, currentY, { align: 'center' });
        currentY += 0.2; // Space below the thank you note
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Receipt generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: 'center' });
        doc.save(`iDonate_Proof.pdf`);
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 

    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/logout', { // Ensure the URL is correct
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
        <Link to="/receipt">
          <div className="circle">&#8592;</div>
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
              <label>Amount of Donation based on Proof of Cash Donation<span style={{color: 'red'}}> *</span>:</label>
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
              <label>Upload Proof of Cash Donation<span style={{color: 'red'}}> *</span>:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Donation<span style={{color: 'red'}}> *</span>:</label>
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
            <h3>Proof of Payment</h3>
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
                    <td>{proof.name || 'Anonymous'}</td>
                    <td>₱{parseFloat(proof.amount).toLocaleString()}</td>
                    <td>{new Date(proof.date).toLocaleDateString()}</td>
                    <td>{proof.approved ? 'Received' : 'Pending'}</td>
                    <td>
                      {proof.imagePath ? (
                        <a 
                          href={`https://idonate1.onrender.com/${proof.imagePath}`}
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
                        <button className="dB" onClick={() => generatePDF(proof)}>Get Proof</button>
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
