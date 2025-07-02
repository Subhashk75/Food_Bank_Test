const mongoose = require('mongoose');
const { Transaction } = require('../models/Transaction');
const {Product} = require("../models/Product")

// @desc    Get all transactions
// @route   GET /api/v1/transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('product', 'name quantity unit')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching transactions',
      error: err.message 
    });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/v1/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product', 'name quantity unit');
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: transaction 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching transaction',
      error: err.message 
    });
  }
};

// @desc    Create new transaction (Distribute or Receive)
// @route   POST /api/v1/transactions
const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { product, quantity, unit, operation, purpose, batchSize } = req.body;

    // Validate required fields
    if (!product || !quantity || !unit || !operation || !purpose) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: product, quantity, unit, operation, purpose'
      });
    }

    // Check product exists
    const productDoc = await Product.findById(product).session(session);
    if (!productDoc) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Validate quantity for distribution
    if (operation === 'Distribute' && productDoc.quantity < quantity * unit) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. Available: ${productDoc.quantity}, Requested: ${quantity * unit}`
      });
    }

    // Create transaction
    const transaction = await Transaction.create([{
      product,
      quantity,
      unit,
      operation,
      purpose,
      batchSize,
      status: 'completed'
    }], { session });

    // Update product quantity
    const quantityChange = operation === 'Distribute' ? -quantity * unit : quantity * unit;
    await Product.findByIdAndUpdate(
      product,
      { $inc: { quantity: quantityChange } },
      { session, new: true }
    );

    await session.commitTransaction();
    
    const createdTransaction = await Transaction.findById(transaction[0]._id)
      .populate('product', 'name quantity unit');
    
    res.status(201).json({ 
      success: true, 
      data: createdTransaction 
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ 
      success: false, 
      message: 'Transaction creation failed',
      error: err.message 
    });
  } finally {
    session.endSession();
  }
};

// @desc    Update a transaction
// @route   PUT /api/v1/transactions/:id
const updateTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const transaction = await Transaction.findById(req.params.id).session(session);
    if (!transaction) {
      await session.abortTransaction();
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    // Prevent updating completed transactions
    if (transaction.status === 'completed') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Completed transactions cannot be modified'
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, session }
    ).populate('product', 'name quantity unit');

    await session.commitTransaction();
    res.status(200).json({ 
      success: true, 
      data: updatedTransaction 
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ 
      success: false, 
      message: 'Error updating transaction',
      error: err.message 
    });
  } finally {
    session.endSession();
  }
};

// @desc    Restore product quantities from transactions
// @route   POST /api/v1/transactions/restore
const restoreTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Reset all product quantities to 0
      await Product.updateMany({}, { $set: { quantity: 0 } }, { session });

      // Process all completed transactions in chronological order
      const transactions = await Transaction.find({ status: 'completed' })
        .sort({ createdAt: 1 })
        .session(session);

      for (const transaction of transactions) {
        const { product, quantity, unit, operation } = transaction;
        
        const quantityChange = operation === 'Receive' 
          ? quantity * unit 
          : -quantity * unit;

        await Product.findByIdAndUpdate(
          product,
          { $inc: { quantity: quantityChange } },
          { session }
        );
      }
    });

    res.status(200).json({
      success: true,
      message: 'Product quantities restored from transactions',
      transactionsProcessed: transactions.length
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to restore product quantities',
      error: err.message 
    });
  } finally {
    session.endSession();
  }
};
module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  restoreTransaction
};