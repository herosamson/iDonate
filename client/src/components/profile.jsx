import React, { useEffect, useState, useCallback } from 'react';
import './profile.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from './logo1.png';

const Profile = ({ username }) => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]); // This will now hold pending items
  const [pendingItems, setPendingItems] = useState([]); // This will now hold received donations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    address: '',
    username: '',
  });

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

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await axios.get(`/routes/accounts/user/${username}`);
      const user = userResponse.data.user;
      const receivedDonations = userResponse.data.donations.filter(donation => donation.received);
      const pendingDonations = userResponse.data.donations.filter(donation => !donation.received);

      setUser(user);
      setDonations(pendingDonations); // Set pending items initially
      setPendingItems(receivedDonations); // Set received items initially
      setEditData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        contact: user.contact,
        address: user.address,
        username: user.username,
      });

    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [username]);
  
  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username, fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.includes('<') || value.includes('>')) {
      return;
    }

    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@(gmail\.com)$/;
    const contactRegex = /^09\d{9}$/;
  
    if (!nameRegex.test(editData.firstname)) {
      alert('First name must contain only letters.');
      return;
    }
  
    if (!nameRegex.test(editData.lastname)) {
      alert('Last name must contain only letters.');
      return;
    }
  
    if (!emailRegex.test(editData.email)) {
      alert('Email must be a valid Gmail.');
      return;
    }
  
    if (!contactRegex.test(editData.contact)) {
      alert('Please enter a valid Contact Number.');
      return;
    }
  
    try {
      const response = await axios.put(`/routes/accounts/user/${username}`, editData);
      setUser(response.data);
      localStorage.setItem('username', editData.username);
      setIsEditing(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.message.includes('Username already taken')) {
          alert('Username is already taken.');
        } else if (error.response.data.message.includes('Email or contact number already in use')) {
          alert('Email or contact number is already in use.');
        } else {
          alert('Error updating user data: ' + error.response.data.message);
        }
      } else {
        setError('Error updating user data');
        console.error("Error updating user data:", error);
      }
    }
  };
  

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      contact: user.contact,
      address: user.address,
      username: user.username,
    });
  };

  const handleViewItemsDonatedClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div class="loader loader_bubble"></div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

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
      <div className="back-buttonP">
        <Link to="/homepageuser">
          <div className="circleP">&lt;</div>
        </Link>
      </div>

      <div className="containerP">
        {isEditing ? (
          <div className="edit-container">
            <div className="edit-field">
              <label>First Name:</label>
              <input
                type="text"
                name="firstname"
                value={editData.firstname}
                onChange={handleChange}
                className="read-only" // Apply the read-only class
                readOnly
              />
            </div>
            <div className="edit-field">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastname"
                value={editData.lastname}
                onChange={handleChange}
                className="read-only" // Apply the read-only class
                readOnly
              />
            </div>
            <div className="edit-field">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="read-only" // Apply the read-only class
                readOnly
              />
            </div>
            <div className="edit-field">
              <label>Contact:</label>
              <input
                type="text"
                name="contact"
                value={editData.contact}
                onChange={handleChange}
              />
            </div>
            <div className="edit-field">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={editData.address}
                onChange={handleChange}
              />
            </div>

            <button className="save-buttonP" onClick={handleSave}>Save</button>
            <button className="cancel-buttonP" onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <div className="profile-info">
            <h2>My Information</h2>
            <p>Name: {user.firstname} {user.lastname}</p>
            <p>Email: {user.email}</p>
            <p>Contact: {user.contact}</p>
            <p>Address: {user.address}</p>
            <p>Username: {user.username}</p>
            <button className="edit-buttonpro" onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        )}

        <div className='Rcontainer'>
          <div id="Received-Table">
            <h3>Pending Items</h3> {/* Changed to Pending Items */}
            <table>
              <thead>
                <tr>
                  <th>Donation ID</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Date of Delivery</th>
                  <th>Expiration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, index) => (
                  <tr key={index}>
                    <td>{donation.donationId}</td>
                    <td>{donation.item}</td>
                    <td>{`${donation.quantity} ${donation.unit || ''}`}</td>
                    <td>{new Date(donation.date).toLocaleDateString()}</td>
                    <td>{donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{donation.received ? 'Through System: Delivered' : 'Through System: In Transit'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="dBP" onClick={handleViewItemsDonatedClick}>View Items Donated</button> {/* Changed button text */}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlayP">
          <div className="modalP">
            <div className="modal-headerP">
              <h2>Items Donated</h2> {/* Changed to Items Donated */}
              <span className="close-icon" onClick={closeModal}>&times;</span>
            </div>
            <div className="modal-contentP">
              <table>
                <thead>
                  <tr>
                    <th>Donation ID</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Date of Delivery</th>
                    <th>Expiration Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((item, index) => ( // Displaying the pending items now
                    <tr key={index}>
                      <td>{item.donationId}</td>
                      <td>{item.item}</td>
                      <td>{`${item.quantity} ${item.unit || ''}`}</td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}</td>
                      <td>{item.received ? 'Through System: Delivered' : 'Through System: In Transit'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
