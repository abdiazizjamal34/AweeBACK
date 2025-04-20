const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controlls/dashboardController');

router.get('/summary', getDashboardSummary);

module.exports = router;
