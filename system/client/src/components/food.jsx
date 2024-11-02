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
  const [customLocation, setCustomLocation] = useState(''); // New state for custom location

  const username = localStorage.getItem('username');

  const foodTypes = ["Rice", "Canned Goods", "Instant Noodles", "Coffee", "Biscuits", "Water Bottles", "Others"];
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

  const addFoodAssistance = async () => {
    if (!name || !typesOfFood || !contactNumber || !location || !targetDate || !numberOfPax || (!barangay && location !== 'Others')) {
      alert('All fields are required.');
      return;
    }

    const fullLocation = location === "Others" ? customLocation : `${location} - ${barangay}, ${houseAddress}`;
    const newRequest = { name, typesOfFood, contactNumber, location: fullLocation, targetDate, numberOfPax, username };

    try {
      const response = await axios.post(`/routes/accounts/food-assistance/add`, newRequest, {
        headers: { username }
      });
      setFoodAssistance([...foodAssistance, response.data.request]);
      setName('');
      setTypesOfFood('');
      setContactNumber('');
      setLocation('');
      setBarangay('');
      setHouseAddress('');
      setTargetDate('');
      setNumberOfPax('');
      setCustomLocation(''); // Clear custom location
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
    setTypesOfFood(selectedFood === "Others" ? "" : selectedFood);
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);
    setBarangay('');
    setCustomLocation(''); // Clear custom location when changing the location
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
        <div className="request-containerfood">
          <div className="input-container">
            <h3>Food Assistance:</h3>
            <input
              type="text"
              placeholder="Name/ Name of Organization"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/[<>]/g, ''))}
            />
            {typesOfFood === "" ? (
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
            {location === "Others" ? (
              <input
                type="text"
                placeholder="Specify Location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
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
              type="date"
              value={targetDate}
              min={today}
              onChange={(e) => setTargetDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="Number of Pax"
              value={numberOfPax}
              onChange={(e) => setNumberOfPax(e.target.value.replace(/[<>]/g, ''))}
            />
            <button onClick={addFoodAssistance}>Request</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Food;
