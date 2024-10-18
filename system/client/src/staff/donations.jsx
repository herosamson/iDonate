import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './donations.css'; 
import { Link } from 'react-router-dom';
import logo2 from './logo2.png';
import logo1 from './logo1.png'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Donations = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenV, setModalOpenV] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [location, setLocation] = useState({ cabinet: '', column: '', row: '' });
  const [locationError, setLocationError] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    name: '',
    contact: '',
    item: '',
    quantity: '',
    expirationDate: '',
    dateOfDelivery: '',
  });
  const [addDonationError, setAddDonationError] = useState('');
  const [addCabinetModalOpen, setAddCabinetModalOpen] = useState(false);
  const [newCabinet, setNewCabinet] = useState({
    cabinetNumber: '',
    columns: '',
    rows: '',
  });
  const [addCabinetError, setAddCabinetError] = useState('');
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const [cabinets, setCabinets] = useState([]);
  const [availableCabinets, setAvailableCabinets] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [availableRows, setAvailableRows] = useState([]);

  const fetchCabinets = async () => {
    try {
      const response = await axios.get('/routes/accounts/cabinets');
      setCabinets(response.data);
    } catch (error) {
      console.error('Error fetching cabinets:', error);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchCabinets();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/routes/accounts/donations');
      const sortedDonations = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDonations(sortedDonations);
    } catch (error) {
      setError('Error fetching donations');
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`/routes/accounts/donations/accept/${id}`);
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation._id === id ? { ...donation, received: true } : donation
        )
      );
    } catch (error) {
      console.error('Error accepting donation:', error);
      alert('Failed to accept donation. Please try again.');
    }
  };

  const handleView = (donation) => {
    setSelectedDonation(donation);
    setModalOpenV(true);
  };

  const handleLocate = (donation) => {
    setSelectedDonation(donation);
    setLocation({ cabinet: '', column: '', row: '' });
    setLocationError('');
    setModalOpen(true);
  };

  const submitLocation = async () => {
    const { cabinet, column, row } = location;

    if (cabinet === '' || column === '' || row === '') {
      setLocationError('Cabinet, Column, and Row are required.');
      return;
    }

    try {
      const response = await axios.put(`/routes/accounts/donations/locate/${selectedDonation._id}`, {
        cabinet: Number(cabinet),
        column: Number(column),
        row: Number(row),
      });

      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation._id === selectedDonation._id ? response.data.donation : donation
        )
      );

      alert('Location assigned successfully.');
      setModalOpen(false);
    } catch (error) {
      console.error('Error assigning location:', error);
      setLocationError(error.response?.data?.message || 'Failed to assign location.');
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
      alert('Error logging out. Please try again.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDonations = donations.filter(donation => {
    const searchLower = searchQuery.toLowerCase();
    const donationIdMatch =  (donation.donationId || '').toLowerCase().includes(searchLower);
    const itemMatch = donation.item.toLowerCase().includes(searchLower);
    const contactMatch = typeof donation.contact === 'string' && donation.contact.toLowerCase().includes(searchLower);
    const dateMatch = new Date(donation.date).toLocaleDateString().toLowerCase().includes(searchLower);
    const cabinetMatch = donation.location?.cabinet?.toString().includes(searchLower);
    const columnMatch = donation.location?.column?.toString().includes(searchLower);
    const rowMatch = donation.location?.row?.toString().includes(searchLower);
    return donationIdMatch || itemMatch || contactMatch || dateMatch || cabinetMatch || columnMatch || rowMatch;
  });

  const imageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous'); // To handle CORS issues
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  const generatePDF = async (donation) => {
    try {
      const logoBase64 = await imageToBase64(logo1);
      
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [54, 85.6], // ID-1 size: 85.6mm x 54mm
      });

      const imgProps = doc.getImageProperties(logoBase64);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 50; // Adjust as needed
      const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
      const logoX = (pdfWidth - logoWidth) / 2;
      doc.addImage(logoBase64, 'PNG', logoX, 5, logoWidth, logoHeight);
      const item = donation.item;
      const expirationDate = donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'N/A';
      const locationText = donation.location 
        ? `Cabinet ${donation.location.cabinet}: Column ${donation.location.column}, Row ${donation.location.row}`
        : 'N/A';
      const donationId = donation.donationId;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(12);

      let yPosition = 25; 

      const content = [
        { label: 'Item:', value: item },
        { label: 'Expiration Date:', value: expirationDate },
        { label: 'Location:', value: locationText },
      ];

      content.forEach((entry) => {
        const text = `${entry.label} ${entry.value}`;
        const textWidth = doc.getTextWidth(text);
        doc.text(text, (pdfWidth - textWidth) / 2, yPosition);
        yPosition += 6; 
      });

      doc.setFontSize(8);
      const donationIdText = `Donation ID: ${donationId}`;
      const donationIdWidth = doc.getTextWidth(donationIdText);
      doc.text(donationIdText, (pdfWidth - donationIdWidth) / 2, 50); // Adjust y position as needed

      doc.save(`Donation_${donationId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleAddDonationSubmit = async (e) => {
    e.preventDefault();
    setAddDonationError('');

    if (!newDonation.name || !newDonation.contact || !newDonation.item || !newDonation.quantity || !newDonation.dateOfDelivery) {
      setAddDonationError('Please fill in all required fields.');
      return;
    }
    const contactRegex = /^09\d{9}$/;
    if (!contactRegex.test(newDonation.contact)) {
      setAddDonationError('Contact must start with "09" and be exactly 11 digits.');
      return;
    }

    const today = new Date();
    const deliveryDate = new Date(newDonation.dateOfDelivery);
    today.setHours(0, 0, 0, 0);
    deliveryDate.setHours(0, 0, 0, 0);
    if (deliveryDate > today) {
      setAddDonationError('Date of Delivery cannot be in the future.');
      return;
    }
    try {
      const donationData = {
        name: newDonation.name,
        contact: newDonation.contact,
        item: newDonation.item,
        quantity: newDonation.quantity,
        expirationDate: newDonation.expirationDate || null,
        dateOfDelivery: newDonation.dateOfDelivery,
      };
      const response = await axios.post('/routes/accounts/donations/addSingle', donationData);
      if (response.status === 201) {
        setAddModalOpen(false);
        setNewDonation({
          name: '',
          contact: '',
          item: '',
          quantity: '',
          expirationDate: '',
          dateOfDelivery: '',
        });
        setDonations((prevDonations) => [response.data.donation, ...prevDonations]);
      } else {
        setAddDonationError('Failed to add donation. Please try again.');
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      setAddDonationError(error.response?.data?.message || 'Failed to add donation.');
    }
  };

  const handleAddCabinetSubmit = async (e) => {
    e.preventDefault();
    setAddCabinetError('');

    const { cabinetNumber, columns, rows } = newCabinet;
    if (!cabinetNumber || !columns || !rows) {
      setAddCabinetError('Please fill in all required fields.');
      return;
    }

    if (columns < 1 || columns > 10 || rows < 1 || rows > 10) {
      setAddCabinetError('Columns and Rows must be between 1 and 10.');
      return;
    }

    try {
      const response = await axios.post('/routes/accounts/addCabinet', {
        cabinetNumber: Number(cabinetNumber),
        columns: Number(columns),
        rows: Number(rows),
      });

      if (response.status === 201) {
        alert('Cabinet added successfully.');
        setAddCabinetModalOpen(false);
        setNewCabinet({
          cabinetNumber: '',
          columns: '',
          rows: '',
        });
        fetchCabinets(); // Refresh the cabinets list
      } else {
        setAddCabinetError('Failed to add cabinet. Please try again.');
      }
    } catch (error) {
      console.error('Error adding cabinet:', error);
      setAddCabinetError(error.response?.data?.message || 'Failed to add cabinet.');
    }
  };

  const computeAvailableCabinets = () => {
    const available = cabinets.filter(cabinet => {
      for(let col = 1; col <= cabinet.columns; col++) {
        const occupiedRows = donations.filter(donation => 
          donation.location?.cabinet === cabinet.cabinetNumber && 
          donation.location?.column === col
        ).length;
        if(occupiedRows < cabinet.rows) {
          return true;
        }
      }
      return false;
    }).map(cabinet => cabinet.cabinetNumber);
    
    setAvailableCabinets(available);
  };

  const computeAvailableColumns = (cabinetNumber) => {
    const cabinet = cabinets.find(cab => cab.cabinetNumber === Number(cabinetNumber));
    if(!cabinet) {
      setAvailableColumns([]);
      return;
    }

    let firstAvailableColumn = null;
    for(let col = 1; col <= cabinet.columns; col++) {
      const occupiedRows = donations.filter(donation => 
        donation.location?.cabinet === cabinetNumber && 
        donation.location?.column === col
      ).length;
      if(occupiedRows < cabinet.rows) {
        firstAvailableColumn = col;
        break;
      }
    }

    if(firstAvailableColumn) {
      setAvailableColumns([firstAvailableColumn]);
    } else {
      setAvailableColumns([]);
    }
  };
  const computeAvailableRows = (cabinetNumber, columnNumber) => {
    const cabinet = cabinets.find(cab => cab.cabinetNumber === Number(cabinetNumber));
    if(!cabinet) {
      setAvailableRows([]);
      return;
    }

    let firstAvailableRow = null;
    for(let row = 1; row <= cabinet.rows; row++) {
      const isOccupied = donations.some(donation => 
        donation.location?.cabinet === cabinetNumber && 
        donation.location?.column === columnNumber && 
        donation.location?.row === row
      );
      if(!isOccupied) {
        firstAvailableRow = row;
        break;
      }
    }

    if(firstAvailableRow) {
      setAvailableRows([firstAvailableRow]);
    } else {
      setAvailableRows([]);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      computeAvailableCabinets();
    }
  }, [modalOpen, donations, cabinets]);

  useEffect(() => {
    if (location.cabinet) {
      computeAvailableColumns(location.cabinet);
      setLocation(prev => ({ ...prev, column: '', row: '' }));
      setAvailableRows([]);
    } else {
      setAvailableColumns([]);
      setAvailableRows([]);
    }
  }, [location.cabinet]);

  useEffect(() => {
    if (location.cabinet && location.column) {
      computeAvailableRows(location.cabinet, location.column);
      setLocation(prev => ({ ...prev, row: '' }));
    } else {
      setAvailableRows([]);
    }
  }, [location.cabinet, location.column]);
  const getAvailableCabinetNumbers = () => {
    const allCabinetNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
    const usedCabinets = cabinets.map(cab => cab.cabinetNumber);
    return allCabinetNumbers.filter(number => !usedCabinets.includes(number));
  };

  if (loading) return <div class="loader loader_bubble"></div>;
  if (error) return <div>{error}</div>;

  return (
    <div id="containerD">
      <div id="sidebarD">
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
      <div id="contentD">
        <h2>Receiving and Tracking of Item Donations from Donors</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search donations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            style={{ width: '200px', height: '30px', borderRadius: '5px' }}
          />
        </div>
        <button 
            className="add-donation-button" 
            onClick={() => setAddModalOpen(true)}
            disabled={getAvailableCabinetNumbers().length === 0 && cabinets.length >= 10}
          >
            Add Donation
          </button>
        <table>
          <thead>
            <tr>
              <th>Donation ID</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Date of Delivery</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map(donation => (
              <tr key={donation._id}>
                <td>{donation.donationId}</td>
                <td>{donation.item}</td>
                <td>
                  {donation.unit ? `${donation.quantity} ${donation.unit}` : donation.quantity}
                </td>
                <td>{new Date(donation.date).toLocaleDateString()}</td>
                <td>
                  {donation.user ? (
                    donation.received ? 'Through system: Delivered' : 'Through system: In Transit'
                  ) : (
                    'Through walk-in: Delivered'
                  )}
                </td>
                <td>
                  {donation.location && donation.location.cabinet
                    ? `Cabinet ${donation.location.cabinet}: Column ${donation.location.column}, Row ${donation.location.row}`
                    : 'Not assigned'}
                </td>
                <td>
                  {donation.user ? (
                    !donation.received ? (
                      <button className="enable-button" onClick={() => handleAccept(donation._id)}>Receive</button>
                    ) : (
                      <>
                        <button className="view-button" onClick={() => handleView(donation)}>View</button>
                        {!donation.location && (
                          <button className="locate-button" onClick={() => handleLocate(donation)}>Locate</button>
                        )}
                        {donation.location && (
                          <button className="print-button" onClick={() => generatePDF(donation)}>Print Location</button>
                        )}
                      </>
                    )
                  ) : (
                    <>
                      <button className="view-button" onClick={() => handleView(donation)}>View</button>
                      {!donation.location ? (
                        <button className="locate-button" onClick={() => handleLocate(donation)}>Locate</button>
                      ) : (
                        <button className="print-button" onClick={() => generatePDF(donation)}>Print Location</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {addModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close-button" onClick={() => setAddModalOpen(false)}>&times;</span>
              <h2>Add Donation for Walk-in Donor</h2>
              <form onSubmit={handleAddDonationSubmit}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={newDonation.name}
                    onChange={(e) => setNewDonation({ ...newDonation, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact:</label>
                  <input
                    type="text" // Changed from "number" to "text" to allow leading zeros
                    value={newDonation.contact}
                    onChange={(e) => setNewDonation({ ...newDonation, contact: e.target.value })}
                    required
                    placeholder="e.g., 09123456789"
                  />
                </div>
                <div className="form-group">
                  <label>Item:</label>
                  <input
                    type="text"
                    value={newDonation.item}
                    onChange={(e) => setNewDonation({ ...newDonation, item: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={newDonation.quantity}
                    onChange={(e) => setNewDonation({ ...newDonation, quantity: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Expiration Date (Optional):</label>
                  <input
                    type="date"
                    value={newDonation.expirationDate}
                    onChange={(e) => setNewDonation({ ...newDonation, expirationDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Delivery:</label>
                  <input
                    type="date"
                    value={newDonation.dateOfDelivery}
                    onChange={(e) => setNewDonation({ ...newDonation, dateOfDelivery: e.target.value })}
                    required
                    max={new Date().toISOString().split("T")[0]} // Prevent future dates
                  />
                </div>
                {addDonationError && <p className="error">{addDonationError}</p>}
                <button type="submit" className="submit-buttonAdd">Submit</button>
              </form>
            </div>
          </div>
        )}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close-button" onClick={() => setModalOpen(false)}>&times;</span>
              {!selectedDonation?.location ? (
                <div className="modal-headerAccounts">
                  <h2>Assign Location</h2>
                  <form>
                    <div className="form-group">
                      <label>Cabinet:</label>
                      <select
                        value={location.cabinet}
                        onChange={(e) => setLocation({ ...location, cabinet: e.target.value })}
                        required
                        className="location-select"
                      >
                        <option value="">Select Cabinet</option>
                        {availableCabinets.map(cabinetNumber => (
                          <option key={cabinetNumber} value={cabinetNumber}>
                            {cabinetNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    {availableColumns.length > 0 && (
                      <div className="form-group">
                        <label>Column:</label>
                        <select
                          value={location.column}
                          onChange={(e) => setLocation({ ...location, column: e.target.value })}
                          required
                          className="location-select"
                        >
                          <option value="">Select Column</option>
                          {availableColumns.map(col => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {availableRows.length > 0 && (
                      <div className="form-group">
                        <label>Row:</label>
                        <select
                          value={location.row}
                          onChange={(e) => setLocation({ ...location, row: e.target.value })}
                          required
                          className="location-select"
                        >
                          <option value="">Select Row</option>
                          {availableRows.map(row => (
                            <option key={row} value={row}>
                              {row}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {locationError && <p className="error">{locationError}</p>}
                    <button type="button" onClick={submitLocation} className="submit-buttonLoc">Submit</button>
                  </form>
                </div>
              ) : (
                <>
                  <h2>Donor Details</h2>
                  {selectedDonation && (
                    <div>
                      <p><strong>UserID:</strong> {selectedDonation.user?._id || 'N/A'}</p>
                      <p><strong>First Name:</strong> {selectedDonation.user?.firstname || selectedDonation.firstname || 'N/A'}</p>
                      <p><strong>Last Name:</strong> {selectedDonation.user?.lastname || selectedDonation.lastname || 'N/A'}</p>
                      <p><strong>Contact:</strong> {selectedDonation.user?.contact || selectedDonation.contact || 'N/A'}</p>
                      <p><strong>Location:</strong> Cabinet {selectedDonation.location.cabinet}: Column {selectedDonation.location.column}, Row {selectedDonation.location.row}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {modalOpenV && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close-button" onClick={() => setModalOpenV(false)}>&times;</span>
              <h2>Donor Details</h2>
              {selectedDonation ? (
                selectedDonation.user ? (
                  <div>
                    <p><strong>UserID:</strong> {selectedDonation.user._id}</p>
                    <p><strong>Donor Name:</strong> {selectedDonation.user.firstname} {selectedDonation.user.lastname}</p>
                    <p><strong>Contact:</strong> {selectedDonation.user.contact}</p>
                  </div>
                ) : (
                  <div>
                    <p><strong>Name:</strong> {selectedDonation.firstname} {selectedDonation.lastname}</p>
                    <p><strong>Contact:</strong> {selectedDonation.contact}</p>
                  </div>
                )
              ) : (
                <p>No donation selected.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
