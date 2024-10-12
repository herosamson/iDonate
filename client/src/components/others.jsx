import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './others.css'; // Assuming you have appropriate CSS
import logo from './logo1.png';
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
  const [category, setCategory] = useState(''); // New state for category
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 

    try {
      const response = await fetch('https://idonatebackend.onrender.com/routes/accounts/logout', {
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

    if (!item || !quantity || (!unit && !customUnit)) {
      alert('Item, Quantity, and Unit are required.');
      return;
    }

    if (!/^\d+$/.test(quantity)) {
      alert('Please enter a valid Quantity.');
      return;
    }

    const selectedItem = item === 'Others' ? customItem : item;
    const selectedUnit = unit === 'Other' ? customUnit : unit;
    const normalizedItem = selectedItem.toLowerCase();

    if (pendingItems.some(pendingItem => pendingItem.item.toLowerCase() === normalizedItem)) {
      alert('This item is already in the pending list.');
      return;
    }

    const newItem = { item: selectedItem, quantity, unit: selectedUnit, expirationDate, username, category }; // Include category
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
        category: pendingItem.category // Include category
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

    if (value.includes('<') || value.includes('>')) {
      return;
    }

    switch (name) {
      case 'item':
        setItem(value);
        setUnit('');
        setCustomUnit('');
        break;
      case 'customItem':
        setCustomItem(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'unit':
        setUnit(value);
        setCustomUnit('');
        break;
      case 'customUnit':
        setCustomUnit(value);
        break;
      case 'date':
        setDate(value);
        break;
      case 'expirationDate':
        setExpirationDate(value);
        break;
      case 'category': // Handle category change
        setCategory(value);
        break;
      default:
        break;
    }
  };

  // Get the current date in YYYY-MM-DD format
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
          <div className="circle1">&lt;</div>
        </Link>
      </div>
      <div className="containerDo">
        <div className="donation-container">
          {error && <p className="error-message">{error}</p>}
          <div className="input-container">
            <h3>Donations:</h3>
            <select value={category} onChange={handleChange} name="category">
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Clothes">Clothes</option>
              <option value="Hygiene">Hygiene</option>
              <option value="Others">Others</option>
            </select>
            {item === 'Others' ? (
              <input
                type="text"
                value={customItem}
                onChange={handleChange}
                name="customItem"
                placeholder="Specify item"
              />
            ) : (
              <select
                value={item}
                onChange={handleChange}
                name="item"
              >
                <option value="">Select item</option>
                <option value="Blanket">Blanket</option>
                <option value="Canned Goods">Canned Goods</option>
                <option value="Medicine">Medicine</option>
                <option value="Noodles">Noodles</option>
                <option value="Cup Noodles">Cup Noodles</option>
                <option value="Pillow">Pillow</option>
                <option value="Rice">Sack of Rice (25 kg)</option>
                <option value="Shampoo">Shampoo</option>
                <option value="Soap">Soap</option>
                <option value="Socks">Socks</option>
                <option value="Stuffed Toy">Stuffed Toy</option>
                <option value="Tampons">Tampons</option>
                <option value="Toothbrush">Toothbrush</option>
                <option value="Toothpaste">Toothpaste</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Water">Water Bottles</option>
                <option value="Wheelchair">Wheelchair</option>
                <option value="Others">Others:</option>
              </select>
            )}

            {unit === 'Other' ? (
              <input
                type="text"
                value={customUnit}
                onChange={handleChange}
                name="customUnit"
                placeholder="Enter unit"
              />
            ) : (
              <select
                value={unit}
                onChange={handleChange}
                name="unit"
                required
              >
                <option value="">Select Unit</option>
                <option value="Piece(s)">Piece(s)</option>
                <option value="Pack(s)">Pack(s)</option>
                <option value="Box(es)">Box(es)</option>
                <option value="Sack(s)">Sack(s)</option>
                <option value="Bottle(s)">Bottle(s)</option>
                <option value="Can(s)">Can(s)</option>
                <option value="Other">Other</option>
              </select>
            )}

            <input
              type="text"
              value={quantity}
              onChange={handleChange}
              name="quantity"
              placeholder="Quantity"
            />
            <h3>(If necessary) Expiration Date:</h3>
            <input
              type="date"
              value={expirationDate}
              onChange={handleChange}
              name="expirationDate"
              min={today}
            />
            <button className="dB" onClick={addItem}>Add Item</button>
          </div>
        </div>
        {isPendingItemsVisible && (
          <>
            <div className="table-wrapperDo">
              <div className="table-containerDo">
                <h3>Pending Items</h3>
                {pendingItems.length > 0 && (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Expiration Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingItems.map((pendingItem, index) => (
                          <tr key={index}>
                            <td>{pendingItem.item}</td>
                            <td>{pendingItem.quantity} {pendingItem.unit}</td>
                            <td>{pendingItem.expirationDate ? new Date(pendingItem.expirationDate).toLocaleDateString() : 'N/A'}</td>
                            <td>
                              <button className="delete-button" onClick={() => deletePendingItem(index)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
            <div className="input-container1">
              <h3>Date of Delivery:</h3>
              <input
                type="date"
                value={date}
                onChange={handleChange}
                name="date"
                min={today}
              />
              <button className="dB" onClick={submitItems}>Submit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Others;
