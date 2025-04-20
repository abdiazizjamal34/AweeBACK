const Transaction = require('../model/Transaction');
const Customer = require('../model/Customer');
const Product = require('../model/Product'); // optional
// const Invoice = require('../model/Invoice'); // optional

const getDashboardSummary = async (req, res) => {
  try {
    const incomeTotal = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenseTotal = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalIncome = incomeTotal[0]?.total || 0;
    const totalExpense = expenseTotal[0]?.total || 0;
    const netProfit = totalIncome - totalExpense;

    const customerCount = await Customer.countDocuments();
    const productCount = await Product?.countDocuments?.() || 0;
    // const invoiceCount = await Invoice?.countDocuments?.() || 0;

    res.status(200).json({
      totalIncome,
      totalExpense,
      netProfit,
      customerCount,
      productCount,
    //   invoiceCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating dashboard summary', error: err.message });
  }
};

module.exports = { getDashboardSummary };
