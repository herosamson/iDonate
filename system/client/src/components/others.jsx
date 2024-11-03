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
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const categoryItems = {
    Food: [
      'Canned Goods',
      'Noodles',
      'Cup Noodles',
      'Rice (25 kg)',
      'Water Bottles',
      'Other',
    ],
    Clothes: [
      'T-Shirt',
      'Socks',
      'Blanket',
      'Stuffed Toy',
      'Other',
    ],
    Hygiene: [
      'Shampoo',
      'Soap',
      'Tampons',
      'Toothbrush',
      'Toothpaste',
      'Other',
    ],
    Others: [],
    DisasterRelief: [
      'Canned Goods',
      'Instant Noodles',
      'Water Bottles',
      'Instant Coffee',
      'Biscuits',
      'Other',
    ],
  };

  const unitOptions = {
    default: ["Piece(s)", "Pack(s)", "Box(es)", "Sack(s)", "Bottle(s)", "Can(s)", "Other"],
    DisasterRelief: ["Piece(s)", "Pack(s)", "Box(es)", "Bottle(s)", "Can(s)", "Other"],
    Food: ["Piece(s)", "Pack(s)", "Box(es)", "Sack(s)", "Bottle(s)", "Can(s)", "Other"],
    Clothes: ["Piece(s)", "Pack(s)", "Box(es)", "Other"],
    Hygiene: ["Piece(s)", "Pack(s)", "Box(es)", "Other"],
    Others: ["Piece(s)", "Pack(s)", "Box(es)", "Other"],
  };

  const unitLimits = {
    "Piece(s)": 100,
    "Pack(s)": 50,
    "Box(es)": 20,
    "Sack(s)": 10,
    "Bottle(s)": 100,
    "Can(s)": 100,
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
    if (!quantity) {
      alert('Quantity is required.');
      return;
    }
    if (!unit && !customUnit) {
      alert('Unit is required.');
      return;
    }
    if (!/^\d+$/.test(quantity) || parseInt(quantity, 10) <= 0) {
      alert('Please enter a valid Quantity.');
      return;
    }
    const limit = unitLimits[unit] || 0;
    if (parseInt(quantity, 10) > limit) {
      alert(`Quantity for ${unit} cannot exceed ${limit}.`);
      return;
    }

    const selectedItem = category === 'Others' ? customItem : (item === 'Other' ? customItem : item);
    const selectedUnit = unit === 'Other' ? customUnit : unit;
    const normalizedItem = selectedItem.toLowerCase();

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

      alert('Please check and take note of the donation ID of these item/s from the profile page.');
      alert('Thank you for your in-kind donation'); 
      navigate('/profile');
    } catch (err) {
      console.error('Error submitting items:', err.response ? err.response.data : err.message);
      alert('Error submitting items.');
    }
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
              <option value="Food">Food</option>
              <option value="Clothes">Clothes</option>
              <option value="Hygiene">Hygiene Kit</option>
              <option value="DisasterRelief">Disaster Relief</option>
              <option value="Others">Others</option>
            </select>

            {category === 'Others' ? (
              <>
                <label htmlFor="customItem">Item<span style={{color: 'red'}}> *</span>:</label>
                <input
                  type="text"
                  value={customItem}
                  onChange={handleChange}
                  name="customItem"
                  placeholder="Specify item"
                  required
                />
              </>
            ) : (
              <>
                <label htmlFor="item">Item<span style={{color: 'red'}}> *</span>:</label>
                <select
                  id="item"
                  value={item}
                  onChange={handleChange}
                  name="item"
                  required
                >
                  <option value="">Select Item</option>
                  {categoryItems[category].map((itm, idx) => (
                    itm !== 'Other' ? <option key={idx} value={itm}>{itm}</option> : <option key={idx} value="Other">Other</option>
                  ))}
                </select>
                {item === 'Other' && (
                  <input
                    type="text"
                    value={customItem}
                    onChange={handleChange}
                    name="customItem"
                    placeholder="Specify item"
                    required
                  />
                )}
              </>
            )}

            {item && (
              <>
                <label htmlFor="unit">Unit<span style={{color: 'red'}}> *</span>:</label>
                <select
                  id="unit"
                  value={unit}
                  onChange={handleChange}
                  name="unit"
                  required
                >
                  <option value="">Select Unit</option>
                  {unitOptions[category || 'default'].map((unitOption, idx) => (
                    <option key={idx} value={unitOption}>{unitOption}</option>
                  ))}
                </select>
                {unit === 'Other' && (
                  <input
                    type="text"
                    value={customUnit}
                    onChange={handleChange}
                    name="customUnit"
                    placeholder="Enter unit"
                    required
                  />
                )}
              </>
            )}
            {category && item && (
              <>
                <label htmlFor="quantity">Quantity<span style={{color: 'red'}}> *</span>:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleChange}
                  name="quantity"
                  placeholder="Quantity"
                  min="1"
                  max={unitLimits[unit] || ''}
                  required
                />
              </>
            )}
            {category === 'Food' && (
              <>
                <label htmlFor="expirationDate">(If necessary) Expiration Date:</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={handleChange}
                  name="expirationDate"
                  min={today}
                />
              </>
            )}

            <button className="dB" onClick={addItem}>Add Item</button>
          </div>
        </div>
        <div className="table-wrapperDo">
          <div className="table-containerDo">
            <h3>Pending Items</h3>
            {pendingItems.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Expiration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((pendingItem, index) => (
                    <tr key={index}>
                      <td>{pendingItem.item}</td>
                      <td>{pendingItem.quantity}</td>
                      <td>{pendingItem.unit}</td>
                      <td>{pendingItem.expirationDate ? new Date(pendingItem.expirationDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="input-container1">
          <h3>Date of Delivery<span style={{color: 'red'}}> *</span>:</h3>
          <input
            type="date"
            value={date}
            onChange={handleChange}
            name="date"
            min={today}
            required
          />
          <button className="dB" onClick={submitItems}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Others;
