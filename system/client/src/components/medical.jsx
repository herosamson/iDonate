import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './medical.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Medical = () => {
  const [name, setName] = useState('');
  const [typeOfMedicine, setTypeOfMedicine] = useState('');
  const [quantity, setQuantity] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
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
    "Tondo": Array.from({ length: 267 }, (_, i) => `Barangay ${i + 1}`), // Barangay 1 to 267
    "San Nicolas": Array.from({ length: 19 }, (_, i) => `Barangay ${268 + i}`), // Barangay 268 to 286
    "Binondo": Array.from({ length: 10 }, (_, i) => `Barangay ${287 + i}`), // Barangay 287 to 296
    "Santa Cruz": Array.from({ length: 86 }, (_, i) => `Barangay ${297 + i}`), // Barangay 297 to 382
    "Quiapo": [...Array.from({ length: 4 }, (_, i) => `Barangay ${306 + i}`), ...Array.from({ length: 12 }, (_, i) => `Barangay ${383 + i}`)], // Barangay 306-309, 383-394
    "Sampaloc": Array.from({ length: 192 }, (_, i) => `Barangay ${395 + i}`), // Barangay 395 to 586
    "Santa Mesa": Array.from({ length: 50 }, (_, i) => `Barangay ${587 + i}`), // Barangay 587 to 636
    "San Miguel": Array.from({ length: 12 }, (_, i) => `Barangay ${637 + i}`), // Barangay 637 to 648
    "Port Area": Array.from({ length: 5 }, (_, i) => `Barangay ${649 + i}`), // Barangay 649 to 653
    "Intramuros": Array.from({ length: 5 }, (_, i) => `Barangay ${654 + i}`), // Barangay 654 to 658
    "Ermita": Array.from({ length: 12 }, (_, i) => `Barangay ${659 + i}`), // Barangay 659 to 670
    "Paco": Array.from({ length: 26 }, (_, i) => `Barangay ${662 + i}`), // Barangay 662 to 687
    "Malate": Array.from({ length: 57 }, (_, i) => `Barangay ${688 + i}`), // Barangay 688 to 744
    "Others": []
  };

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

  const addMedicalAssistance = async () => {
    if (!name || !typeOfMedicine || !quantity || !contactNumber || !location || !reason || !targetDate || (!barangay && location !== 'Others')) {
      alert('All fields are required.');
      return;
    }

    const fullLocation = location === "Others" ? location : `${location} - ${barangay}, ${houseAddress}`;
    const newRequest = { name, typeOfMedicine, quantity, contactNumber, location: fullLocation, reason, targetDate, username };

    try {
      const response = await axios.post(`/routes/accounts/medical-assistance/add`, newRequest, {
        headers: { username }
      });
      setMedicalAssistance([...medicalAssistance, response.data.request]);
      setName('');
      setTypeOfMedicine('');
      setQuantity('');
      setContactNumber('');
      setLocation('');
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
    setTypeOfMedicine(selectedMedicine === "Others" ? "" : selectedMedicine);
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation === "Others" ? "" : selectedLocation);
    setBarangay(''); 
  };

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
        localStorage.clear();
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
            {typeOfMedicine === "" ? (
              <input
                type="text"
                placeholder="Specify Type of Medicine"
                value={typeOfMedicine}
                onChange={(e) => setTypeOfMedicine(e.target.value.replace(/[<>]/g, ''))}
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
            {location === "" ? (
              <input
                type="text"
                placeholder="Specify Location"
                value={location}
                onChange={(e) => setLocation(e.target.value.replace(/[<>]/g, ''))}
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
                  placeholder="House Address"
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
