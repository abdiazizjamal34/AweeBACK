const express = require('express');
const router = express.Router();
const Order = require('../model/Order');
const Product = require('../model/Product');


// Create new order
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
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Update Order Status
router.patch('/status/:id', async (req, res) => {
    try {
      const { status } = req.body;
  
      if (!['Pending', 'Accepted', 'Delivered', 'Canceled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

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
