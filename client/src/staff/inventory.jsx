import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './inventory.css';
import { Link } from 'react-router-dom';
import logo2 from './logo2.png';

function Inventory() {
  // State Variables
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState([]);
  const [financialAssistance, setFinancialAssistance] = useState([]);
  const [medicalAssistance, setMedicalAssistance] = useState([]);
  const [legalAssistance, setLegalAssistance] = useState([]);
  const [foodAssistance, setFoodAssistance] = useState([]);
  const [disasterRelief, setDisasterRelief] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All'); // All, Consumed, Unconsumed
  const [filterCategory, setFilterCategory] = useState('All'); // All, Food, Hygiene, Clothes, Others
  const [filterExpiration, setFilterExpiration] = useState(''); // Date
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [consumeQuantity, setConsumeQuantity] = useState(1);
  const [consumeLocation, setConsumeLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Dropdown Toggles
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Logout Handler
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
        // Clear localStorage
        localStorage.clear();
        window.location.href = '/'; 
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };

  // Fetch Donations with Location
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/routes/accounts/donations/located`);
        setDonations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Fetch Assistance Requests and Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/routes/accounts/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    const fetchFinancialAssistance = async () => {
      try {
        const response = await axios.get(`/routes/accounts/financial-assistance/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setFinancialAssistance(unapproved);
      } catch (error) {
        console.error('Failed to fetch financial assistance requests:', error);
      }
    };

    const fetchMedicalAssistance = async () => {
      try {
        const response = await axios.get(`/routes/accounts/medical-assistance/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setMedicalAssistance(unapproved);
      } catch (error) {
        console.error('Failed to fetch medical assistance requests:', error);
      }
    };

    const fetchLegalAssistance = async () => {
      try {
        const response = await axios.get(`/routes/accounts/legal-assistance/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setLegalAssistance(unapproved);
      } catch (error) {
        console.error('Failed to fetch legal assistance requests:', error);
      }
    };

    const fetchFoodAssistance = async () => {
      try {
        const response = await axios.get(`/routes/accounts/food-assistance/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setFoodAssistance(unapproved);
      } catch (error) {
        console.error('Failed to fetch food assistance requests:', error);
      }
    };

    const fetchDisasterRelief = async () => {
      try {
        const response = await axios.get(`/routes/accounts/disaster-relief/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setDisasterRelief(unapproved);
      } catch (error) {
        console.error('Failed to fetch disaster relief requests:', error);
      }
    };

    // Fetch all data concurrently
    fetchEvents();
    fetchFinancialAssistance();
    fetchMedicalAssistance();
    fetchLegalAssistance();
    fetchFoodAssistance();
    fetchDisasterRelief();
  }, []);

  // Open Consume Modal
  const handleOpenModal = (donation) => {
    setCurrentDonation(donation);
    setConsumeQuantity(1);
    setConsumeLocation('');
    setCustomLocation('');
    setIsCustomLocation(false);
    setSelectedCategory('');
    setIsModalOpen(true);
  };

  // Close Consume Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDonation(null);
  };

  // Handle Category Selection in Modal
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (
      value === 'Events' ||
      value === 'Financial Assistance' ||
      value === 'Medical Assistance' ||
      value === 'Legal Assistance' ||
      value === 'Food Subsidy' ||
      value === 'Disaster Relief'
    ) {
      setIsCustomLocation(false);
      setCustomLocation('');
    } else if (value === 'Others') {
      setIsCustomLocation(true);
      setConsumeLocation('');
    }
  };

  // Handle Consume Form Submission
  const handleConsumeSubmit = async (e) => {
    e.preventDefault();
  
    let donatedTo;
    if (isCustomLocation) {
      donatedTo = [customLocation.trim()];
      if (donatedTo[0] === '') {
        alert('Please specify a valid location.');
        return;
      }
    } else {
      // Ensure both category and selection are available
      if (!selectedCategory || !consumeLocation) {
        alert('Please select both category and consumption location.');
        return;
      }
      donatedTo = [`${selectedCategory}: ${consumeLocation}`];
    }
  
    if (!donatedTo || donatedTo.length === 0) {
      alert('Please select or enter a consumption location.');
      return;
    }
  
    if (consumeQuantity < 1 || consumeQuantity > currentDonation.quantity) {
      alert('Please enter a valid quantity to consume.');
      return;
    }
  
    try {
      const response = await axios.put(`/routes/accounts/donations/consume/${currentDonation._id}`, {
        quantity: consumeQuantity,
        donatedTo, // Now an array
      });
  
      if (response.status === 200) {
        alert('Item consumed successfully.');
        // Update the donations list with the updated donation data
        setDonations(donations.map(donation => 
          donation._id === currentDonation._id ? response.data.donation : donation
        ));
        handleCloseModal();
      } else {
        alert('Failed to consume the item.');
      }
    } catch (error) {
      console.error('Error consuming the item:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while consuming the item.');
      }
    }
  };

  // Handle Filters
  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleFilterExpirationChange = (e) => {
    setFilterExpiration(e.target.value);
  };

  // Apply Filters to Donations
  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      // Exclude donations with 0 or less quantity
      if (donation.quantity <= 0) return false;

      // Filter by Status
      if (filterStatus === 'Consumed' && (!donation.donatedTo || donation.donatedTo.length === 0)) return false;
      if (filterStatus === 'Unconsumed' && (donation.donatedTo && donation.donatedTo.length > 0)) return false;

      // Filter by Category
      if (filterCategory !== 'All') {
        // Assuming 'item' corresponds to category
        // Modify this if you have a separate 'category' field
        const category = donation.item.toLowerCase();
        if (filterCategory === 'Food' && category !== 'food') return false;
        if (filterCategory === 'Hygiene' && category !== 'hygiene') return false;
        if (filterCategory === 'Clothes' && category !== 'clothes') return false;
        if (filterCategory === 'Others' && category !== 'others') return false;
      }

      // Filter by Expiration Date
      if (filterExpiration) {
        if (!donation.expirationDate) return false; // Exclude donations without expiration date
        const expirationDate = new Date(donation.expirationDate);
        return expirationDate <= new Date(filterExpiration);
      }

      return true;
    }).sort((a, b) => b.quantity - a.quantity);
  }, [donations, filterStatus, filterCategory, filterExpiration]);

  // Group Donations by Cabinet > Column > Row
  const groupedDonations = useMemo(() => {
    const group = {};

    donations.forEach(donation => {
      if (donation.location) {
        const { cabinet, column, row } = donation.location;
        if (!group[cabinet]) {
          group[cabinet] = {};
        }
        if (!group[cabinet][column]) {
          group[cabinet][column] = {};
        }
        group[cabinet][column][row] = donation;
      }
    });

    return group;
  }, [donations]);

  // Render Loading or Error States
  if (loading) {
    return <div className="loading">Loading donations...</div>;
  }

  if (error) {
    return <div className="error-message">Error loading donations. Please try again later.</div>;
  }

  return (
    <div id="containerU">
      <div id="sidebar">
      <ul>
          <li><img className="logoD" src={logo2} alt="Logo" /></li>
          <br />
          <br />
          <li><Link to="/staffDashboard">Staff Dashboard</Link></li>
          <li><Link to="/donations">Item Donations</Link></li>
          <li><Link to="/receiptS">Cash Donations</Link></li>
          <li><Link to="/inventoryS">Inventory</Link></li>
          <br />
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div id="contentDInventory">
        <h1>Inventory</h1>
        {filteredDonations.length === 0 ? (
          <p className="no-data">No located donations available.</p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Donation ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Expiration Date</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map(donation => (
                <tr key={donation._id}>
                  <td>{donation.donationId}</td>
                  <td>{donation.item}</td>
                  <td>{donation.quantity}</td>
                  <td>{donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'N/A'}</td>
                 
                  <td>
                    {donation.location
                      ? `Cabinet ${donation.location.cabinet}: Column ${donation.location.column}, Row ${donation.location.row}`
                      : 'Not assigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="summary-section">
          {Object.keys(groupedDonations).length === 0 ? (
            <p>No located donations to display.</p>
          ) : (
            Object.keys(groupedDonations).sort((a, b) => a - b).map(cabinet => (
              <div key={cabinet} className="cabinet">
                <h3><center>Cabinet {cabinet}</center></h3>
                <div className="columns">
                  {Object.keys(groupedDonations[cabinet]).sort((a, b) => a - b).map(column => (
                    <div key={column} className="column">
                      <h2><center>Column {column}</center></h2>
                      <div className="rows">
                        {Object.keys(groupedDonations[cabinet][column]).sort((a, b) => a - b).map(row => {
                          const donation = groupedDonations[cabinet][column][row];
                          return (
                            <div key={row} className="row">
                              <center>
                                <p><strong>Row {row}:</strong></p>
                                <p><strong>Item:</strong> {donation.item}</p>
                                <p><strong>Quantity:</strong> {donation.quantity}</p>
                                <p><strong>Expiration:</strong> {donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'N/A'}</p>
                              </center>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
