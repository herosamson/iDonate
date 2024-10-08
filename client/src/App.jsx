import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import About from './components/aboutus';
import Events from './components/events';
import Homepage from './homepage';
import Options from './components/options';
import CashOthers from './components/cashOthers';
import Cash from './components/cash';
import Others from './components/others';
import HomepageU from './homepageuser';
import Request from './components/request';
import Profile from './components/profile';
import StaffDashboard from './staff/staffDashboard';
import Donations from './staff/donations';
import DonationsAd from './admin/donations';
import Receipt from './components/receipt';
import Email from './components/email';
import Buttons from './components/buttons';
import Food from './components/food';
import Finance from './components/financial';
import Medical from './components/medical';
import Disaster from './components/disaster';
import Legal from './components/legal';
import EventsA from './admin/events';
import FinancialA from './admin/financial';
import MedicalA from './admin/medical';
import LegalA from './admin/legal';
import FoodA from './admin/food';
import DisasterA from './admin/disaster';
import Inventory from './admin/inventory';
import InventoryS from './staff/inventory';
import ReceiptS from './staff/receipt';
import Admin from './superadmin/dashboard';
import EventsSA from './superadmin/eventsA';
import InventorySA from './superadmin/inventoryA';
import StaffSA from './superadmin/staffA';
import Analytics from './admin/analytics';
import AdminSA from './superadmin/admin';
import ProtectedRoute from './components/protected';
import UseInactivityTimeout from './hooks/UseInactivityTimeout';
import Activity from './superadmin/activity';
import Verify from './components/verify';
import VerifyFP from './components/verifyotp';
import CPassword from './components/password';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [firstname, setFirstName] = useState(null);
  const [lastname, setLastName] = useState(null);
  const [contact, setContact] = useState(null);

  axios.defaults.baseURL =
  "http://localhost:5001";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('userId:', storedUserId);
    
    const storedUsername = localStorage.getItem('username');
    console.log('username:', storedUsername);
    
    const storedUserRole = localStorage.getItem('userRole');
    console.log('userRole:', storedUserRole);
    
    const storedFirstName = localStorage.getItem('firstname');
    console.log('firstname:', storedFirstName);
    
    const storedLastName = localStorage.getItem('lastname');
    console.log('lastname:', storedLastName);
    
    const storedContact = localStorage.getItem('contact');
    console.log('contact:', storedContact);
  
    if (storedUserId) setUserId(storedUserId);
    if (storedUsername) setUsername(storedUsername);
    if (storedUserRole) setUserRole(storedUserRole);
    if (storedFirstName) setFirstName(storedFirstName);
    if (storedLastName) setLastName(storedLastName);
    if (storedContact) setContact(storedContact);
  }, []);
  

  const handleLogin = (userId, username, role, firstname, lastname, contact) => {
    setUserId(userId);
    setUsername(username);
    setUserRole(role);
    setFirstName(firstname);
    setLastName(lastname);
    setLastName(contact);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('lastname', lastname);
    localStorage.setItem('contact', contact);

  };

  return (
    <BrowserRouter>
      <UseInactivityTimeout timeout={240000} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/email" element={<Email />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verifyFP" element={<VerifyFP />} />
        <Route path="/Cpassword" element={<CPassword />} />
        <Route path="/components/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/components/register" element={<Register onLogin={handleLogin} />} />

        <Route path="/staffDashboard" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/donations" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['staff']}>
            <Donations />
          </ProtectedRoute>
        } />
        <Route path="/inventoryS" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['staff']}>
            <InventoryS userId={userId}/>
          </ProtectedRoute>
        } />
        <Route path="/receiptS" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['staff']}>
            <ReceiptS />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/eventsA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <EventsA />
          </ProtectedRoute>
        } />
        <Route path="/foodA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <FoodA />
          </ProtectedRoute>
        } />
        <Route path="/financialA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <FinancialA />
          </ProtectedRoute>
        } />
        <Route path="/medicalA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <MedicalA />
          </ProtectedRoute>
        } />
        <Route path="/disasterA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <DisasterA />
          </ProtectedRoute>
        } />
        <Route path="/legalA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <LegalA />
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <Inventory userId={userId}/>
          </ProtectedRoute>
        } />
        <Route path="/donateA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <DonationsAd />
          </ProtectedRoute>
        } />

        <Route path="/options" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Options />
          </ProtectedRoute>
        } />
        <Route path="/cashOthers" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <CashOthers />
          </ProtectedRoute>
        } />
        <Route path="/cash" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Cash />
          </ProtectedRoute>
        } />
        <Route path="/others" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Others userId={userId} />
          </ProtectedRoute>
        } />
        <Route path="/homepageuser" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <HomepageU username={username} firstname={firstname} lastname={lastname} />
          </ProtectedRoute>
        } />
        <Route path="/request" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Request />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Profile username={username} />
          </ProtectedRoute>
        } />

        <Route path="/receipt" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Receipt />
          </ProtectedRoute>
        } />
        <Route path="/buttons" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Buttons />
          </ProtectedRoute>
        } />
        <Route path="/food" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Food userId={userId} />
          </ProtectedRoute>
        } />
        <Route path="/finance" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Finance userId={userId} />
          </ProtectedRoute>
        } />
        <Route path="/medical" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Medical userId={userId} />
          </ProtectedRoute>
        } />
        <Route path="/disaster" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Disaster userId={userId} />
          </ProtectedRoute>
        } />
        <Route path="/legal" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Legal userId={userId} />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/eventsSA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <EventsSA />
          </ProtectedRoute>
        } />
        <Route path="/inventorySA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <InventorySA userId={userId} />
          </ProtectedRoute>
        } />
        <Route path="/staffSA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <StaffSA />
          </ProtectedRoute>
        } />
        <Route path="/adminSA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <AdminSA />
          </ProtectedRoute>
        } />
        <Route path="/activity" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <Activity />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
