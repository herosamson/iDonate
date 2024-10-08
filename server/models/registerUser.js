const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  contact: { type: Number, required: true, unique: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Register', RegisterSchema);
