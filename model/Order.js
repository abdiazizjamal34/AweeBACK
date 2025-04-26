// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Delivered', 'Canceled'],
    default: 'Pending'
  },
    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
