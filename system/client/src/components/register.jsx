import React, { useState } from 'react';
import './register.css';
import logo from './logo1.png';
import pic from './pic2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validTextRegex = /^[^<>]*$/;
    const validNumberRegex = /^\d*$/;

    // Validate address and username against forbidden characters
    if ((name === 'address' || name === 'username') && !validTextRegex.test(value)) {
      return;
    }

    // Validate contact to be numbers only and max length 11
    if (name === 'contact' && (!validNumberRegex.test(value) || value.length > 11)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    // First name validation
    if (!formData.firstname.trim() || !/^[a-zA-Z\s]*$/.test(formData.firstname)) {
      errors.push('Please enter a valid First name.');
    }

    // Last name validation
    if (!formData.lastname.trim() || !/^[a-zA-Z\s]*$/.test(formData.lastname)) {
      errors.push('Please enter a valid Last name.');
    }

    // Email validation
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid Email Address.');
    } else if (!formData.email.includes('gmail.com')) {
      errors.push('Please enter a valid Email Address (Gmail).');
    }

    // Username validation
    if (!formData.username.trim() || /[<>]/.test(formData.username)) {
      errors.push('Please enter a valid Username.');
    }

    // Address validation
    if (!formData.address.trim() || /[<>]/.test(formData.address)) {
      errors.push('Please enter a valid address.');
    }

    // Contact number validation
    if (!formData.contact.trim() || formData.contact.length !== 11 || !/^09\d{9}$/.test(formData.contact)) {
      errors.push('Please enter a valid Contact Number.');
    }

    // Password validation
    if (!formData.password.trim() || formData.password.length < 8 || !/\d/.test(formData.password)) {
      errors.push('Password must be at least 8 characters long and contain a number.');
    }

    // Confirm Password match
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match.');
    }

    // If no errors, proceed with registration
    if (errors.length === 0) {
      try {
        const response = await fetch('https://idonatebackend.onrender.com/routes/accounts/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register');
        }

        const { userId, username, email } = await response.json();

        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);

        onLogin(userId, username);

        navigate('/verify', { state: { userId, email } });
      } catch (error) {
        alert('Registration failed: ' + error.message);
      }
    } else {
      alert(errors.join('\n'));
    }
  };

  return (
    <div className="app-container">
      <div className="registration-container">
        <div className="registration-form">
          <div className="logoR-container">
            <Link to="/">
              <img className="logoR" src={logo} alt="Logo" />
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name: Juan"
              required
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name: Dela Cruz"
              required
            />
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Contact Number: 09123456789"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address: 123 Tirso Cruz St. Quiapo, Manila"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email: juan@gmail.com"
              required
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            
            {/* Password Field with Toggle Icon */}
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Field with Toggle Icon */}
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="button-container">
              <button type="submit">Register</button>
            </div>
            <div className="bottom-text">
              <p>
                Already have an account? <Link to="/components/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
        <div className="picture-container">
          <img className="picture" src={pic} alt="Registration" />
        </div>
      </div>
    </div>
  );
}

export default Register;
