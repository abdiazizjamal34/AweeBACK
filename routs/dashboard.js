const express = require('express');
const router = express.Router();
// const { getDashboardSummary } = require('../controlls/dashboardController');
const Product = require('../model/Product');

// router.get('/summary', getDashboardSummary);
router.get('/', async (req , res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalStock = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: '$stock' }
                }
            }
        ]);

    const totalValue = await Product.aggregate([
        {
            $group: {
                _id: null,
                totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
            }
        }
    ]);

  res.status(200).json({
    totalProducts,
    totalStock: totalStock[0]?.totalStock || 0,
    totalValue: totalValue[0]?.totalValue || 0
  })
    } catch (err) {
        res.status(500).json({ message: 'Error generating dashboard summary', error: err.message });
    }

});

module.exports = router;