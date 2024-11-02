import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './others.css'; 
import logo from './imagenew.png';
import { Link, useNavigate } from 'react-router-dom';

const Others = () => {
  const [donations, setDonations] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [item, setItem] = useState('');
  const [customItem, setCustomItem] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState('');
  const [isPendingItemsVisible, setIsPendingItemsVisible] = useState(false);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const categoryItems = {
    Food: ['Canned Goods', 'Noodles', 'Cup Noodles', 'Rice', 'Water Bottles', 'Other'],
    Clothes: ['T-Shirt', 'Socks', 'Blanket', 'Stuffed Toy', 'Other'],
    HygieneKit: ['Shampoo', 'Soap', 'Tampons', 'Toothbrush', 'Toothpaste', 'Other'],
    Others: [],
    DisasterRelief: ['Water Bottles', 'Canned Goods', 'Noodles', 'Rice', 'Other'],
  };

  const applicableUnits = {
    Food: ['Piece(s)', 'Pack(s)', 'Box(es)', 'Sack(s)', 'Bottle(s)', 'Can(s)'],
    Clothes: ['Piece(s)', 'Pack(s)'],
    HygieneKit: ['Piece(s)', 'Bottle(s)'],
    DisasterRelief: ['Piece(s)', 'Pack(s)', 'Box(es)', 'Sack(s)', 'Bottle(s)', 'Can(s)'],
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 

    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/logout', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
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

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/routes/accounts/donations');
      const donations = response.data;

      const username = localStorage.getItem('username');
      if (!username) {
        console.error('Username not found in localStorage');
        return;
      }

      const userDonations = donations.filter(donation => donation.user && donation.user.username === username);
      setDonations(userDonations);
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  const addItem = () => {
  const username = localStorage.getItem('username');
  if (!username) {
    setError('User not logged in');
    return;
  }
  if (!category) {
    alert('Category is required.');
    return;
  }
  if (!item && !customItem) {
    alert('Item is required.');
    return;
  }
  if (!quantity || isNaN(quantity)) {
    alert('Please enter a valid Quantity.');
    return;
  }
  if (!unit && !customUnit) {
    alert('Unit is required.');
    return;
  }

  // Quantity limits based on unit
  const quantityLimits = {
    "Piece(s)": 100,
    "Pack(s)": 50,
    "Box(es)": 10,
    "Sack(s)": 10,
    "Bottle(s)": 50,
    "Can(s)": 50,
  };

  const selectedUnit = unit === 'Other' ? customUnit : unit;
  const selectedItem = item === 'Other' || category === 'Others' ? customItem : item;
  const normalizedItem = selectedItem.toLowerCase();

  if (quantityLimits[selectedUnit] && parseInt(quantity, 10) > quantityLimits[selectedUnit]) {
    alert(`Quantity limit for ${selectedUnit} is ${quantityLimits[selectedUnit]}.`);
    return;
  }

  if (pendingItems.some(pendingItem => pendingItem.item.toLowerCase() === normalizedItem)) {
    alert('This item is already in the pending list.');
    return;
  }

  const newItem = { 
    item: selectedItem, 
    quantity, 
    unit: selectedUnit, 
    expirationDate, 
    username, 
    category 
  };

  setPendingItems([...pendingItems, newItem]);
  setItem('');
  setCustomItem('');
  setQuantity('');
  setUnit('');
  setCustomUnit('');
  setExpirationDate('');
  setError('');
  setIsPendingItemsVisible(true);
};


  const submitItems = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setError('User not logged in');
      return;
    }

    if (!date) {
      alert('Date of Delivery is required.');
      return;
    }

    try {
      const itemsToSubmit = pendingItems.map(pendingItem => ({
        item: pendingItem.item,
        quantity: pendingItem.quantity,
        unit: pendingItem.unit,
        expirationDate: pendingItem.expirationDate,
        username,
        category: pendingItem.category
      }));

      const response = await axios.post('/routes/accounts/donations/add', {
        items: itemsToSubmit,
        date,
        username
      });

      setDonations([...donations, ...response.data.donations]);
      setPendingItems([]);
      setDate('');
      setError('');
      setIsPendingItemsVisible(false);

      alert('Please check and take note of the donation ID of these item/s from the profile page.');
      window.alert('Thank you for your in-kind donation'); 
      navigate('/profile');
    } catch (err) {
      console.error('Error submitting items:', err.response ? err.response.data : err.message);
      alert('Error submitting items.');
    }
  };

  const deletePendingItem = (index) => {
    const updatedPendingItems = pendingItems.filter((_, i) => i !== index);
    setPendingItems(updatedPendingItems);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
  
    if (value.includes('<') || value.includes('>')) {
      return;
    }
    switch (name) {
      case 'category':
        setCategory(value);
        setItem('');
        setCustomItem('');
        setUnit('');
        setCustomUnit('');
        break;
      case 'item':
        setItem(value);
        setCustomItem('');
        setUnit('');
        setCustomUnit('');
        break;
      case 'customItem':
        if (lettersOnlyRegex.test(value) || value === '') {
          setCustomItem(value);
        } else {
          alert('Please enter letters only for custom items.');
        }
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'unit':
        setUnit(value);
        setCustomUnit('');
        break;
      case 'customUnit':
        if (lettersOnlyRegex.test(value) || value === '') {
          setCustomUnit(value);
        } else {
          alert('Please enter letters only for custom units.');
        }
        break;
      case 'date':
        setDate(value);
        break;
      case 'expirationDate':
        setExpirationDate(value);
        break;
      default:
        break;
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const oneMonthFromToday = new Date();
  oneMonthFromToday.setMonth(oneMonthFromToday.getMonth() + 1);
  const minDeliveryDate = oneMonthFromToday.toISOString().split('T')[0];

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
        <Link to="/cashOthers">
          <div className="circle1">&#8592;</div>
        </Link>
      </div>
      <div className="containerDo">
        <div className="donation-container">
          {error && <p className="error-message">{error}</p>}
          <div className="input-container">
            <label htmlFor="category">Category<span style={{color: 'red'}}> *</span>:</label>
            <select 
              id="category"
              value={category} 
              onChange={handleChange} 
              name="category" 
              required
            >
              <option value="">Select Category</option>
              {Object.keys(categoryItems).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="item">Item Name<span style={{color: 'red'}}> *</span>:</label>
            {category === 'Others' ? (
              <input
                type="text"
                id="customItem"
                value={customItem}
                onChange={handleChange}
                name="customItem"
                required
                placeholder="Custom item name"
              />
            ) : (
              <select
                id="item"
                value={item}
                onChange={handleChange}
                name="item"
                required
              >
                <option value="">Select an item</option>
                {categoryItems[category].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="quantity">Quantity<span style={{color: 'red'}}> *</span>:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleChange}
              name="quantity"
              min="1"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="unit">Unit<span style={{color: 'red'}}> *</span>:</label>
            {applicableUnits[category] && applicableUnits[category].includes('Other') ? (
              <input
                type="text"
                id="customUnit"
                value={customUnit}
                onChange={handleChange}
                name="customUnit"
                required
                placeholder="Custom unit name"
              />
            ) : (
              <select
                id="unit"
                value={unit}
                onChange={handleChange}
                name="unit"
                required
              >
                <option value="">Select unit</option>
                {applicableUnits[category]?.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            )}
          </div>
          {['Food', 'DisasterRelief'].includes(category) && (
            <div className="input-container">
              <label htmlFor="expirationDate">Expiration Date:</label>
              <input
                type="date"
                id="expirationDate"
                value={expirationDate}
                onChange={handleChange}
                name="expirationDate"
                min={today}
              />
            </div>
          )}
          <button className="dB" onClick={addItem}>Add Item</button>
        </div>
        <div className="table-wrapperDo">
        <div className="table-containerDo">
        <h2>Pending Items</h2>
        {pendingItems.length === 0 && <p>No items added yet.</p>}
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Expiration Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingItems.map((pendingItem, index) => (
              <tr key={index}>
                <td>{pendingItem.item}</td>
                <td>{pendingItem.quantity}</td>
                <td>{pendingItem.unit}</td>
                <td>{pendingItem.expirationDate || '-'}</td>
                <td>
                  <button onClick={() => deletePendingItem(index)}>Delete</button>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
        </div>
        </div>
        <div className="input-container1">
          <label htmlFor="date">Date of Delivery<span style={{color: 'red'}}> *</span>:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleChange}
            name="date"
            min={minDeliveryDate}
            required
          />
        </div>
        <button className="dB" onClick={submitItems} disabled={pendingItems.length === 0}>
          Submit All Items
        </button>
      </div>
    </div>
  );
};

export default Others;