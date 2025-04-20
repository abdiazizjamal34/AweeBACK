const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true },
  address: { type: String },
  balance: { type: Number, default: 0 } // for tracking debt/credit
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
