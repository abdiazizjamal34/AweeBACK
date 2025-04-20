const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  deleteTransaction
} = require('../controlls/transactionController');

router.post('/', createTransaction);
router.get('/', getTransactions);
router.delete('/:id', deleteTransaction);

module.exports = router;
