import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './food.css';
import logo from './imagenew.png';
import { Link } from 'react-router-dom';

const Food = () => {
  const [name, setName] = useState('');
  const [typesOfFood, setTypesOfFood] = useState('');
  const [typesOfFoodOther, setTypesOfFoodOther] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [locationOther, setLocationOther] = useState('');
  const [barangay, setBarangay] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [numberOfPax, setNumberOfPax] = useState('');
  const [foodAssistance, setFoodAssistance] = useState([]);
  const [hasRequestToday, setHasRequestToday] = useState(false); // New state to track requests for today

  const username = localStorage.getItem('username');
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

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
  
      // Check if a request has already been made today
      const requestToday = response.data.some(request =>
        new Date(request.submissionDate).toISOString().split('T')[0] === today
      );
  
      if (requestToday) {
        setHasRequestToday(true);
        localStorage.setItem('foodRequestDate', today); // Store today's date in localStorage
      }
    } catch (error) {
      console.error('Failed to fetch food requests:', error);
    }
  };
  

  const addFoodAssistance = async () => {
    if (hasRequestToday) {
      alert('You have already submitted a request today. Please try again tomorrow.');
      return;
    }
  
    if (!name || !contactNumber || !location || !targetDate || !numberOfPax || (!barangay && location !== 'Others')) {
      alert('All fields are required.');
      return;
    }
  
    const selectedFoodType = typesOfFood === "Others" ? typesOfFoodOther : typesOfFood;
    const fullLocation = location === "Others" ? locationOther : `${location} - ${barangay}, ${houseAddress}`;
    const newRequest = { 
      name, 
      typesOfFood: selectedFoodType, 
      contactNumber, 
      location: fullLocation, 
      targetDate, 
      numberOfPax, 
      username,
      submissionDate: today // Record today's date as submissionDate
    };
  
    try {
      const response = await axios.post(`/routes/accounts/food-assistance/add`, newRequest, {
        headers: { username }
      });
  
      setFoodAssistance([...foodAssistance, response.data.request]);
      setHasRequestToday(true); // Set flag to true after successful request
      localStorage.setItem('foodRequestDate', today); // Store today's date in localStorage
  
      resetForm();
      alert('Food request added successfully.');
    } catch (error) {
      console.error('Failed to add food request:', error.response ? error.response.data : error.message);
      alert('Failed to add food request. Please try again later.');
    }
  };
  

  const resetForm = () => {
    setName('');
    setTypesOfFood('');
    setTypesOfFoodOther('');
    setContactNumber('');
    setLocation('');
    setLocationOther('');
    setBarangay('');
    setHouseAddress('');
    setTargetDate('');
    setNumberOfPax('');
  };

  useEffect(() => {
    fetchFoodAssistance();
  
    // Check if a request has already been submitted today
    const storedDate = localStorage.getItem('foodRequestDate');
    if (storedDate === today) {
      setHasRequestToday(true);
    } else {
      setHasRequestToday(false);
    }
  }, []);
  

  const handleFoodTypeChange = (e) => {
    const selectedFood = e.target.value;
    if (selectedFood === "Others") {
      setTypesOfFood("Others");
      setTypesOfFoodOther('');
    } else {
      setTypesOfFood(selectedFood);
      setTypesOfFoodOther('');
    }
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);
    setBarangay('');
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="Options">
     <header className="header">
        <div className="logo">
          <img className="logo" src={logo} alt="Logo" />
        </div>
        <nav className="navigation">
          <div className="menu-icon" onClick={toggleMenu}>
            &#9776;
          </div>
          <ul className={isOpen ? "nav-links open" : "nav-links"}>
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
           <select value={typesOfFood} onChange={handleFoodTypeChange}>
              <option value="">Select Type of Food</option>
              {foodTypes.map((food) => (
                <option key={food} value={food}>{food}</option>
              ))}
            </select>
            {typesOfFood === "Others" && (
              <input
                type="text"
                placeholder="Specify Type of Food"
                value={typesOfFoodOther}
                onChange={(e) => setTypesOfFoodOther(e.target.value.replace(/[<>]/g, ''))}
              />
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
                placeholder="Please Specify Exact Location"
                value={locationOther}
                onChange={(e) => setLocationOther(e.target.value.replace(/[<>]/g, ''))}
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
              min="1"
              max="200"
            />
            <button className="dB" onClick={addFoodAssistance} disabled={hasRequestToday}>
  {hasRequestToday ? "Request Already Submitted" : "Add Food Request"}
</button>

          </div>
        </div>
        <div className="table-wrapperfood">
          <div className="food-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type of Food</th>
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
