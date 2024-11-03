import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './medical.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Medical = () => {
  const [name, setName] = useState('');
  const [typeOfMedicine, setTypeOfMedicine] = useState('');
  const [customTypeOfMedicine, setCustomTypeOfMedicine] = useState(''); // New state for custom medicine
  const [quantity, setQuantity] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState(''); // New state for custom location
  const [barangay, setBarangay] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [reason, setReason] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [medicalAssistance, setMedicalAssistance] = useState([]);

  const username = localStorage.getItem('username');

  // Medicine options
  const medicineTypes = [
    "Biogesic", "Neozep", "Solmux", "Ceterizine", "Amlodipine", "Amoxicillin", "Bioflu", 
    "Decolgen", "Tempra", "Medicol", "Tuseran", "Robitussin", "Diatabs", "Dolfenal", 
    "Buscopan", "Ventolin", "Lagundi", "Sinutab", "Others"
  ];

  const locations = {
    "Tondo": Array.from({ length: 267 }, (_, i) => `Barangay ${i + 1}`),
    "San Nicolas": Array.from({ length: 19 }, (_, i) => `Barangay ${268 + i}`),
    "Binondo": Array.from({ length: 10 }, (_, i) => `Barangay ${287 + i}`),
    "Santa Cruz": Array.from({ length: 86 }, (_, i) => `Barangay ${297 + i}`),
    "Quiapo": [...Array.from({ length: 4 }, (_, i) => `Barangay ${306 + i}`), ...Array.from({ length: 12 }, (_, i) => `Barangay ${383 + i}`)],
    "Sampaloc": Array.from({ length: 192 }, (_, i) => `Barangay ${395 + i}`),
    "Santa Mesa": Array.from({ length: 50 }, (_, i) => `Barangay ${587 + i}`),
    "San Miguel": Array.from({ length: 12 }, (_, i) => `Barangay ${637 + i}`),
    "Port Area": Array.from({ length: 5 }, (_, i) => `Barangay ${649 + i}`),
    "Intramuros": Array.from({ length: 5 }, (_, i) => `Barangay ${654 + i}`),
    "Ermita": Array.from({ length: 12 }, (_, i) => `Barangay ${659 + i}`),
    "Paco": Array.from({ length: 26 }, (_, i) => `Barangay ${662 + i}`),
    "Malate": Array.from({ length: 57 }, (_, i) => `Barangay ${688 + i}`),
    "Others": []
  };

  // Fetch medical assistance data
  const fetchMedicalAssistance = async () => {
    try {
      const response = await axios.get(`/routes/accounts/medical-assistance`, {
        headers: { username }
      });
      setMedicalAssistance(response.data);
    } catch (error) {
      console.error('Failed to fetch medical requests:', error);
      alert('Failed to fetch medical requests. Please try again later.');
    }
  };

  // Add medical assistance request
  const addMedicalAssistance = async () => {
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    if (!name || !typeOfMedicine || !quantity || !contactNumber || !location || !reason || !targetDate || (!barangay && location !== 'Others')) {
      alert('All fields are required.');
      return;
    }

    if (name.includes('<') || name.includes('>') || !lettersOnlyRegex.test(name)) {
      alert('Invalid characters in Name field.');
      return;
    }

    if (!/^\d+$/.test(quantity)) {
      alert('Please enter a valid number for Quantity.');
      return;
    }

    if (!/^\d{11}$/.test(contactNumber) || !/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number.');
      return;
    }

    const fullLocation = location === "Others" ? customLocation : `${location} - ${barangay}, ${houseAddress}`;
    const newRequest = { name, typeOfMedicine: typeOfMedicine === "Others" ? customTypeOfMedicine : typeOfMedicine, quantity, contactNumber, location: fullLocation, reason, targetDate, username };

    try {
      const response = await axios.post(`/routes/accounts/medical-assistance/add`, newRequest, {
        headers: { username }
      });
      setMedicalAssistance([...medicalAssistance, response.data.request]);
      // Clear form
      setName('');
      setTypeOfMedicine('');
      setCustomTypeOfMedicine('');
      setQuantity('');
      setContactNumber('');
      setLocation('');
      setCustomLocation('');
      setBarangay('');
      setHouseAddress('');
      setReason('');
      setTargetDate('');
      alert('Medical request added successfully.');
    } catch (error) {
      console.error('Failed to add medical assistance:', error.response ? error.response.data : error.message);
      alert('Failed to add medical assistance. Please try again later.');
    }
  };

  useEffect(() => {
    fetchMedicalAssistance();
  }, []);

  const handleTypeOfMedicineChange = (e) => {
    const selectedMedicine = e.target.value;
    setTypeOfMedicine(selectedMedicine);
    if (selectedMedicine === "Others") {
      setCustomTypeOfMedicine(''); // Clear custom input
    }
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);
    setBarangay(''); // Reset barangay when location changes
    if (selectedLocation !== "Others") {
      setCustomLocation(''); // Clear custom location input
    }
  };

  // Get the current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

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
        <div className="request-containermedical">
          <div className="input-container">
            <h3>Medical Assistance:</h3>
            <input
              type="text"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/[<>]/g, ''))}
            />
            {typeOfMedicine === "Others" ? (
              <input
                type="text"
                placeholder="Specify Type of Medicine"
                value={customTypeOfMedicine}
                onChange={(e) => setCustomTypeOfMedicine(e.target.value.replace(/[<>]/g, ''))}
              />
            ) : (
              <select value={typeOfMedicine} onChange={handleTypeOfMedicineChange}>
                <option value="">Select Type of Medicine</option>
                {medicineTypes.map((medicine) => (
                  <option key={medicine} value={medicine}>{medicine}</option>
                ))}
              </select>
            )}
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/[<>]/g, ''))}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value.replace(/[<>]/g, ''))}
            />
            {location === "Others" ? (
              <input
                type="text"
                placeholder="Specify Location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value.replace(/[<>]/g, ''))}
              />
            ) : (
              <select value={location} onChange={handleLocationChange}>
                <option value="">Select Location</option>
                {Object.keys(locations).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            )}
            {location && location !== "Others" && (
              <>
                <select value={barangay} onChange={(e) => setBarangay(e.target.value)}>
                  <option value="">Select Barangay</option>
                  {locations[location].map((brgy) => (
                    <option key={brgy} value={brgy}>{brgy}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Please Specify Exact Location"
                  value={houseAddress}
                  onChange={(e) => setHouseAddress(e.target.value.replace(/[<>]/g, ''))}
                />
              </>
            )}
            <input
              type="text"
              placeholder="What type of Disease/Illness/Sickness?"
              value={reason}
              onChange={(e) => setReason(e.target.value.replace(/[<>]/g, ''))}
            />
            <h3>Target Date:</h3>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={today}
            />
            <button className="dB" onClick={addMedicalAssistance}>Add Medical Request</button>
          </div>
        </div>
        <div className="table-wrappermedical">
          <div className="medical-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type of Medicine</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Target Date</th>
                  <th>Contact Number</th>
                  <th>Reason</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {medicalAssistance.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.typeOfMedicine}</td>
                    <td>{request.quantity}</td>
                    <td>{request.location}</td>
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

export default Medical;
