require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const accountsRoutes = require('./routes/accounts');
const path = require('path');
const app = express();

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5001;

// CORS Configuration
app.use(cors({
  origin: 'https://idonate-3zc8.onrender.com', // Replace with your frontend's actual URL
  credentials: true,                          // Allow credentials (cookies, authorization headers, etc.)
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/routes/accounts', accountsRoutes); // Prefixed with /api to distinguish from frontend routes

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, 'client', 'dist'))); // Updated to 'dist'

// Catch-All Route to Serve index.html for Client-Side Routing
app.get('*', (req, res) => {
  // If the request starts with /api or /uploads, pass to the next middleware (404 handler)
  if (req.path.startsWith('/routes/') || req.path.startsWith('/uploads/')) {
    return res.status(404).send("Route not found");
  }

  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// 404 Handler for Non-API and Non-Static Routes
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Connect to MongoDB and Start Server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log('MongoDB is connected');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
