// routes/report.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Generate simple report
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Delivered' });

    let totalSales = 0;
    let totalOrders = orders.length;
    let totalCustomers = new Set(orders.map(order => order.customerId)).size;

    orders.forEach(order => {
      totalSales += order.totalAmount;
    });

    res.json({
      totalSales,
      totalOrders,
      totalCustomers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

module.exports = router;
