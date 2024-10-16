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
  origin: 'https://idonate-3zc8.onrender.com', // Specify the allowed origin
  credentials: true,                          // Allow credentials (cookies, authorization headers, etc.)
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/routes/accounts', accountsRoutes); // It's recommended to prefix API routes with /api

// Serve Frontend Static Files
// Adjust the path below to point to your frontend's build directory
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Catch-All Route to Serve index.html for Client-Side Routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// 404 Handler (Optional: Can be removed if the catch-all route handles frontend routes)
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
