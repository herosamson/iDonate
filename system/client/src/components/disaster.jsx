import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './disaster.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Disaster = () => {
  const [name, setName] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [disasterTypeOther, setDisasterTypeOther] = useState('');
  const [numberOfPax, setNumberOfPax] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [locationOther, setLocationOther] = useState('');
  const [barangay, setBarangay] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [disasterRequests, setDisasterRequests] = useState([]);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  // Options for Disaster Type and Locations
  const disasterTypes = ["Typhoons", "Earthquakes", "Floods", "Volcanic Eruptions", "Landslides", "Fires"];
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
  };

  const fetchDisasterRequests = async () => {
    try {
      const response = await axios.get(`/routes/accounts/disaster-relief`, {
        headers: { username }
      });
      setDisasterRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch disaster requests:', error);
      alert('Failed to fetch disaster requests. Please try again later.');
    }
  };

  const addDisasterRequest = async () => {
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    const selectedDisasterType = disasterType === "Others" ? disasterTypeOther : disasterType;
    const selectedLocation = location === "Others" ? locationOther : location;

    if (!name || !selectedDisasterType || !numberOfPax || !contactNumber || !selectedLocation || (!barangay && selectedLocation !== 'Others')) {
      alert('All fields are required.');
      return;
    }

    const containsInvalidSymbols = (input) => /[<>]/.test(input);
    if (containsInvalidSymbols(name) || containsInvalidSymbols(selectedDisasterType) || containsInvalidSymbols(selectedLocation)) {
      alert('Symbols < and > are not allowed.');
      return;
    }

    if (!lettersOnlyRegex.test(name)) {
      alert('Please enter a valid Name.');
      return;
    }

    if (!/^\d+$/.test(numberOfPax) || numberOfPax > 500) {
      alert('Please enter a valid number for the Estimated Number of Pax (max 500).');
      return;
    }

    if (!/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number that starts with 09 and has exactly 11 digits.');
      return;
    }

    const fullLocation = selectedLocation === "Others" ? selectedLocation : `${selectedLocation} - ${barangay}, ${houseAddress}`;
    const newRequest = { name, disasterType: selectedDisasterType, numberOfPax, contactNumber, location: fullLocation, targetDate, username };

    try {
      const response = await axios.post(`/routes/accounts/disaster-relief/add`, newRequest, {
        headers: { username },
      });
      setDisasterRequests([...disasterRequests, response.data]);
      setName('');
      setDisasterType('');
      setDisasterTypeOther('');
      setNumberOfPax('');
      setContactNumber('');
      setLocation('');
      setLocationOther('');
      setBarangay('');
      setHouseAddress('');
      setTargetDate('');
      setError('');
      alert('Disaster relief request added successfully.');
    } catch (error) {
      console.error('Failed to add disaster relief request:', error.response ? error.response.data : error.message);
      alert('Failed to add disaster relief request. Please try again later.');
    }
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
    fetchDisasterRequests();
  }, []);

  const today = new Date().toISOString().split('T')[0];

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
        <div className="request-containerdisaster">
          <p className="error-message">{error}</p>
          <div className="input-container">
            <h3>Disaster Relief Assistance:</h3>
            <input
              type="text"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {disasterType === "Others" ? (
              <input
                type="text"
                placeholder="Please Specify Type of Disaster"
                value={disasterTypeOther}
                onChange={(e) => setDisasterTypeOther(e.target.value)}
              />
            ) : (
              <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)}>
                <option value="">Select Type of Disaster</option>
                {disasterTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
                <option value="Others">Others</option>
              </select>
            )}
            <input
              type="number"
              placeholder="Estimated Number of Pax"
              value={numberOfPax}
              onChange={(e) => setNumberOfPax(e.target.value)}
              min="1"
              max="500"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            {location === "Others" ? (
              <input
                type="text"
                placeholder="Please Specify Exact Location"
                value={locationOther}
                onChange={(e) => setLocationOther(e.target.value)}
              />
            ) : (
              <>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">Select Location</option>
                  {Object.keys(locations).map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  <option value="Others">Others</option>
                </select>
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
                      onChange={(e) => setHouseAddress(e.target.value)}
                    />
                  </>
                )}
              </>
            )}
            <h3>Target Date:</h3>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={today}
            />
            <button className="dB" onClick={addDisasterRequest}>Add Disaster Relief Request</button>
          </div>
        </div>
        <div className="table-wrapperdisaster">
          <div className="disaster-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type of Disaster Relief</th>
                  <th>Target Date</th>
                  <th>Contact Number</th>
                  <th>Location</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {disasterRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.disasterType}</td>
                    <td>{new Date(request.targetDate).toLocaleDateString()}</td>
                    <td>{request.contactNumber}</td>
                    <td>{request.location}</td>
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

export default Disaster;
