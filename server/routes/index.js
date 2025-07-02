// routes/index.js
const express = require('express');
const router = express.Router();

const productRoutes = require('./product');
const categoryRoutes = require('./category');
const transactionRoutes = require('./transaction');
const distributionRoutes = require('./distribution');
const inventoryRoutes = require('./Inventory'); // Fixed: Create a separate inventory routes file
const userRoutes = require('./user');

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/distribution', distributionRoutes);
router.use('/inventory', inventoryRoutes); // Now points to correct inventory routes
router.use('/users', userRoutes);

module.exports = router;