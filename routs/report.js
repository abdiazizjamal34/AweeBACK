// routes/report.js
const express = require('express');
const router = express.Router();
const Order = require('../model/Order');

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

router.get('/sales-by-date', async (req, res) => {
    try {
      const orders = await Order.find({ status: 'Delivered' });
  
      const salesByDate = {};
  
      orders.forEach(order => {
        const date = new Date(order.orderDate).toISOString().split('T')[0]; // get 'YYYY-MM-DD'
        if (!salesByDate[date]) {
          salesByDate[date] = 0;
        }
        salesByDate[date] += order.totalAmount;
      });
  
      // Convert into array sorted by date
      const result = Object.entries(salesByDate)
        .map(([date, totalSales]) => ({ date, totalSales }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error generating sales report', error: error.message });
    }
  });



  // Order Status Summary
router.get('/order-status-summary', async (req, res) => {
    try {
      const pendingCount = await Order.countDocuments({ status: 'Pending' });
      const acceptedCount = await Order.countDocuments({ status: 'Accepted' });
      const deliveredCount = await Order.countDocuments({ status: 'Delivered' });
  
      res.json({
        pending: pendingCount,
        accepted: acceptedCount,
        delivered: deliveredCount
      });
    } catch (error) {
      res.status(500).json({ message: 'Error generating order status report', error: error.message });
    }
  });
  




module.exports = router;
