import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './staffA.css';
import logo2 from './logo2.png';

function Staff() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editStaffId, setEditStaffId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });
  const [newStaff, setNewStaff] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });
  const [newAdmin, setNewAdmin] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });
  const [showStaffModal, setShowStaffModal] = useState(false);
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'user') {
      setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
    } else if (type === 'staff') {
      setNewStaff((prevStaff) => ({ ...prevStaff, [name]: value }));
    } else if (type === 'admin') {
      setNewAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));
    }
  };
  const validateStaffInput = () => {
    const { firstname, lastname, contact, email, username, password } = newStaff;

    const isAlphaWithSpaces = (str) => /^[A-Za-z\s]+$/.test(str);
    const isValidEmail = (email) => email.endsWith('@gmail.com') || email.endsWith('@yahoo.com');
    const isUniqueUsername = (username) => 
        !users.some((user) => user.username === username) &&
        !staff.some((staff) => staff.username === username) &&
        !admins.some((admin) => admin.username === username);
    const isUniqueContact = (contact) => 
        !users.some((user) => user.contact === contact) &&
        !staff.some((staff) => staff.contact === contact) &&
        !admins.some((admin) => admin.contact === contact);
    const isUniqueEmail = (email) => 
        !users.some((user) => user.email === email) &&
        !staff.some((staff) => staff.email === email) &&
        !admins.some((admin) => admin.email === email);
    const isValidPassword = (password) => /^(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

    if (!isAlphaWithSpaces(firstname) || !isAlphaWithSpaces(lastname)) {
        alert('First name and Last name should contain letters only (spaces are allowed).');
        return false;
    }

    if (contact.length !== 11 || isNaN(contact) || !isUniqueContact(contact) || !/^09\d{9}$/.test(contact)) {
        alert('Please enter a valid Contact Number.');
        return false;
    }

    if (!isValidEmail(email) || !isUniqueEmail(email)) {
        alert('Email should be either @gmail.com or @yahoo.com and unique.');
        return false;
    }

    if (!isUniqueUsername(username)) {
        alert('Username must be unique.');
        return false;
    }

    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long and contain at least 1 number.');
        return false;
    }

    return true;
};

  const handleAddStaff = async () => {
    if (Object.values(newStaff).some((field) => field === '')) {
      alert('Please fill in all fields');
      return;
    }

    if (!validateStaffInput()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/routes/accounts/stafff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaff),
      });

      if (response.ok) {
        const addedStaff = await response.json();
        setStaff((prevStaff) => [...prevStaff, addedStaff]);
        setShowStaffModal(false);
        setNewStaff({
          firstname: '',
          lastname: '',
          contact: '',
          address: '',
          email: '',
          username: '',
          password: '',
        });
      } else {
        console.error('Failed to add staff');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:5001/routes/accounts/staff');
      const data = await response.json();
      if (Array.isArray(data)) {
        setStaff(data);
      } else {
        setStaff([]);
        console.error('Expected an array but got:', data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        const response = await fetch(`/routes/accounts/staff/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (response.ok) {
          setStaff(staff.filter(staffMember => staffMember._id !== id));
          alert(data.message);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error deleting staff member:', error);
        alert('Failed to delete staff member');
      }
    }
  };

  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 
  
    try {
      const response = await fetch('http://localhost:5001/routes/accounts/logout', {
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (staffMember) => {
    setEditStaffId(staffMember._id);
    setEditFormData({
      firstname: staffMember.firstname,
      lastname: staffMember.lastname,
      email: staffMember.email,
      contact: staffMember.contact,
      username: staffMember.username,
    });
    setNewPassword('');
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update staff details
      const response = await fetch(`http://localhost:5001/routes/accounts/staff/${editStaffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Update password if new password is provided
      if (newPassword) {
        const passwordResponse = await fetch(`http://localhost:5001/routes/accounts/staff/${editStaffId}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword })
        });
        const passwordData = await passwordResponse.json();
        if (!passwordResponse.ok) {
          alert(passwordData.message);
          return;
        }
      }

      fetchStaff(); // Refresh staff list
      alert(data.message);
      setEditStaffId(null);
      setEditFormData({});
      setNewPassword('');
    } catch (error) {
      console.error('Error updating staff member:', error);
      alert('Failed to update staff member');
    }
  };

  const handleCancelEdit = () => {
    setEditStaffId(null);
    setEditFormData({});
    setNewPassword('');
  };

  const filteredStaff = staff.filter(staffMember => {
    const searchLower = searchQuery.toLowerCase();
    const firstnameMatch = staffMember.firstname.toLowerCase().includes(searchLower);
    const lastnameMatch = staffMember.lastname.toLowerCase().includes(searchLower);
    const emailMatch = staffMember.email.toLowerCase().includes(searchLower);
    const contactMatch = staffMember.contact.toLowerCase().includes(searchLower);
    const usernameMatch = staffMember.username.toLowerCase().includes(searchLower);
    return firstnameMatch || lastnameMatch || emailMatch || contactMatch || usernameMatch;
  });

  return (
    <div id="container">
      <div id="sidebar">
      <ul>
          <li><img className="logoU" src={logo2} alt="Logo" /></li>
          <br />
          <li className="dropdown-toggle" onClick={toggleDropdownA}>
            Accounts Management<span className="arrow">&#9660;</span>
          </li>
          {isDropdownOpenA && (
            <ul className="dropdown-menuU">
          <li><Link to="/admin">Donors </Link></li>
          <li><Link to="/adminSA">Administrator </Link></li>
          <li><Link to="/staffSA">Staff </Link></li>
            </ul>
          )}
          <li><Link to="/eventsSA">Events</Link></li>
          <li><Link to="/inventorySA">Inventory</Link></li>
          <li><Link to="/activity">Activity Logs</Link></li>
          <br />
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div id="content">
        <h1>Staff Management</h1>
        <div className="search-container" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-start' }}>
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ width: '200px', height: '30px', borderRadius: '5px' }}
          />
        </div>
        <table className="staff-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staffMember) => (
              <tr key={staffMember._id}>
                {editStaffId === staffMember._id ? (
                  <>
                    <td><input type="text" name="firstname" value={editFormData.firstname} onChange={handleEditFormChange} /></td>
                    <td><input type="text" name="lastname" value={editFormData.lastname} onChange={handleEditFormChange} /></td>
                    <td><input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} /></td>
                    <td><input type="text" name="contact" value={editFormData.contact} onChange={handleEditFormChange} /></td>
                    <td><input type="text" name="username" value={editFormData.username} onChange={handleEditFormChange} /></td>
                    <td><input type="password" placeholder="New password" value={newPassword} onChange={handleNewPasswordChange} /></td>
                    <td>
                      <button className="addToStaffBtn" onClick={handleEditFormSubmit}>Save</button>
                      <button className="deleteBtn" onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{staffMember.firstname}</td>
                    <td>{staffMember.lastname}</td>
                    <td>{staffMember.email}</td>
                    <td>
                      <button className="addToStaffBtn" onClick={() => handleEditClick(staffMember)}>Edit</button>
                      <button className="deleteBtn" onClick={() => handleDelete(staffMember._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="tn" onClick={() => setShowStaffModal(true)}>Add Staff</button>
      </div>
      {/* Staff Modal */}
      {showStaffModal && (
        <div className="modal-overlayAccounts">
        <div className="modalAccounts">
        <span className="close-icon" onClick={() => setShowStaffModal(false)}>&times;</span>
          <div className="modal-headerAccounts">
            <h2>Add New Staff</h2>
            <input type="text" name="firstname" placeholder="First Name" value={newStaff.firstname} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="lastname" placeholder="Last Name" value={newStaff.lastname} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="contact" placeholder="Contact Number" value={newStaff.contact} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="address" placeholder="Address" value={newStaff.address} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="email" placeholder="Email" value={newStaff.email} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="username" placeholder="Username" value={newStaff.username} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="password" name="password" placeholder="Password" value={newStaff.password} onChange={(e) => handleInputChange(e, 'staff')} />
            <button className="sBtn1" onClick={handleAddStaff}>Save</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
