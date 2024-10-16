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

// Use routes from /routes/accounts
app.use('/routes/accounts', accountsRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all route to serve the React app (if no API route matches)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});


// 404 Handler for Non-Route and Non-Static Routes
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
