const express = require('express');
const router = express.Router();
const Order = require('../model/Order');
const Product = require('../model/Product');


// Create new orders
router.post('/', async (req, res) => {
    try {
      const { customerId, products } = req.body;
  
      // Validate products array
      if (!products || products.length === 0) {
        return res.status(400).json({ message: 'Products are required' });
      }
  
      let totalAmount = 0;
  
      // Calculate total amount
      for (const item of products) {
        const product = await Product.findById(item.productId);
  
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${item.productId}` });
        }
  
        totalAmount += product.price * item.quantity;
      }
  
      // Now create the order
      const newOrder = await Order.create({
        customerId,
        products,
        totalAmount,
        status: 'Pending', // default
      });
  
      res.status(201).json(newOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  

// Get all orders
// routes/order.js

router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('customerId', 'name')
      .populate('products.productId', 'name price');

    const filteredOrders = orders.map(order => {
      const validProducts = order.products.filter(p => p.productId && p.quantity > 0);
      order.products = validProducts;
      return order;
    });

    res.status(200).json(filteredOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order
router.patch('/status/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id).populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If accepting order, decrease stock
    if (status === 'Accepted') {
      for (const item of order.products) {
        const product = await Product.findById(item.productId._id);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Not enough stock for product ${product.name}` });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
