const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routs/auth');
const productRoutes = require('./routs/product');
const customerRoutes = require('./routs/customer');
const transactionRoutes = require('./routs/transaction');
const dashboardRoutes = require('./routs/dashboard');
const orderRoutes = require('./routs/order');
const reportRoutes = require('./routs/report');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/auth',authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);





const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, "0.0.0.0", () => {
      console.log("Server running on all interfaces");
    });
      })
  .catch((err) => console.error(err));
