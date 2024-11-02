import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './food.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Food = () => {
  const [name, setName] = useState('');
  const [typesOfFood, setTypesOfFood] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [barangay, setBarangay] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [numberOfPax, setNumberOfPax] = useState('');
  const [foodAssistance, setFoodAssistance] = useState([]);

  const username = localStorage.getItem('username');

  // Food types
  const foodTypes = ["Rice", "Canned Goods", "Instant Noodles", "Coffee", "Biscuits", "Water Bottles", "Others"];

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

  // Fetch food assistance data
  const fetchFoodAssistance = async () => {
    try {
      const response = await axios.get(`/routes/accounts/food-assistance`, {
        headers: { username }
      });
      setFoodAssistance(response.data);
    } catch (error) {
      console.error('Failed to fetch food requests:', error);
    }
  };

  // Add food assistance request
  const addFoodAssistance = async () => {
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    if (!name || !typesOfFood || !contactNumber || !location || !targetDate || !numberOfPax || (!barangay && location !== 'Others')) {
      alert('All fields are required.');
      return;
    }

    if (name.includes('<') || name.includes('>') || !lettersOnlyRegex.test(name)) {
      alert('Invalid characters in Name field.');
      return;
    }

    if (!/^\d{11}$/.test(contactNumber) || !/^09\d{9}$/.test(contactNumber)) {
      alert('Please enter a valid Contact Number.');
      return;
    }

    if (!/^\d+$/.test(numberOfPax)) {
      alert('Please enter a valid number for the Estimated Number of Pax.');
      return;
    }

    const fullLocation = location === "Others" ? location : `${location} - ${barangay}, ${houseAddress}`;
    const newRequest = { name, typesOfFood, contactNumber, location: fullLocation, targetDate, numberOfPax, username };

    try {
      const response = await axios.post(`/routes/accounts/food-assistance/add`, newRequest, {
        headers: { username }
      });
      setFoodAssistance([...foodAssistance, response.data.request]);
      // Clear form fields
      setName('');
      setTypesOfFood('');
      setContactNumber('');
      setLocation('');
      setBarangay('');
      setHouseAddress('');
      setTargetDate('');
      setNumberOfPax('');
      alert('Food request added successfully.');
    } catch (error) {
      console.error('Failed to add food request:', error.response ? error.response.data : error.message);
      alert('Failed to add food request. Please try again later.');
    }
  };

  useEffect(() => {
    fetchFoodAssistance();
  }, []);

  const handleFoodTypeChange = (e) => {
    const selectedFood = e.target.value;
    if (selectedFood === "Others") {
      setTypesOfFood(''); // Clear for text input
    } else {
      setTypesOfFood(selectedFood);
    }
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);
    setBarangay(''); // Reset barangay when location changes
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
        <div className="request-containerfood">
          <div className="input-container">
            <h3>Food Assistance:</h3>
            <input
              type="text"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/[<>]/g, ''))}
            />
            {typesOfFood === "Others" ? (
              <input
                type="text"
                placeholder="Specify Type(s) of Food"
                value={typesOfFood}
                onChange={(e) => setTypesOfFood(e.target.value.replace(/[<>]/g, ''))}
              />
            ) : (
              <select value={typesOfFood} onChange={handleFoodTypeChange}>
                <option value="">Select Type(s) of Food</option>
                {foodTypes.map((food) => (
                  <option key={food} value={food}>{food}</option>
                ))}
              </select>
            )}
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value.replace(/[<>]/g, ''))}
            />
            <select value={location} onChange={handleLocationChange}>
              <option value="">Select Location</option>
              {Object.keys(locations).map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
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
                  onChange={(e) => setHouseAddress(e.target.value.replace(/[<>]/g, ''))}
                />
              </>
            )}
            {location === "Others" && (
              <input
                type="text"
                placeholder="Specify Location"
                value={location}
                onChange={(e) => setLocation(e.target.value.replace(/[<>]/g, ''))}
              />
            )}
            <h3>Target Date:</h3>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={today}
            />
            <input
              type="number"
              placeholder="Number of Pax"
              value={numberOfPax}
              onChange={(e) => setNumberOfPax(e.target.value.replace(/[<>]/g, ''))}
            />
            <button className="dB" onClick={addFoodAssistance}>Add Food Request</button>
          </div>
        </div>
        <div className="table-wrapperfood">
          <div className="food-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type(s) of Food</th>
                  <th>Target Date</th>
                  <th>Contact Number</th>
                  <th>Location</th>
                  <th>Number of Pax</th>
                  <th>Approved</th> 
                </tr>
              </thead>
              <tbody>
                {foodAssistance.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.typesOfFood}</td>
                    <td>{new Date(request.targetDate).toLocaleDateString()}</td>
                    <td>{request.contactNumber}</td>
                    <td>{request.location}</td>
                    <td>{request.numberOfPax}</td>
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

export default Food;
