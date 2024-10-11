require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const accountsRoutes = require('./routes/accounts');
const app = express();
const uri = process.env.MONGODB_URI; //process.env.MONGODB_URI
const port = process.env.PORT || 5001;
const path = require('path');

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // Specify the allowed origin
  credentials: true,               // Allow credentials (cookies, authorization headers, etc.)
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/routes/accounts', accountsRoutes);

// 404 Handler
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
 

app.use(express.static(path.join(dirname, "../Client/dist")));

// Catch-all route to serve the React app (if no API route matches)
app.get("*", (req, res) => {
   res.sendFile(path.join(dirname, "../Client/dist/index.html"), (err) => {
    if (err) {
   res.status(500).send(err);
  }
 });
});




