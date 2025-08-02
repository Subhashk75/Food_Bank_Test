const mongoose = require('mongoose');
const { Transaction } = require('../models/Transaction');
const {Product} = require("../models/Product")

// @desc    Get all transactions
// @route   GET /api/v1/transactions
const getAllTransactions = async (req, res) => {
  try {
   const transactions = await Transaction.find()
          .populate('product', 'name')
          .sort({ createdAt: -1 });

     
      console.log(transactions);
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
  try {
    const { product, quantity, unit, operation, purpose, batchSize } = req.body;

    // Validate required fields
    if (!product || !quantity || !unit || !operation || !purpose) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate operation type
    if (!['Distribute', 'Receive'].includes(operation)) {
      return res.status(400).json({ success: false, message: 'Invalid operation type' });
    }

    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Map units to base quantities
    const unitMap = { pcs: 1, kg: 1, g: 0.001, l: 1, ml: 0.001, box: 10, pack: 5 };
    const multiplier = unitMap[unit] || 1;
    const quantityInBase = quantity * multiplier;

    // Check for sufficient stock in distribution
    if (operation === 'Distribute' && productDoc.quantity < quantityInBase) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${productDoc.quantity}, Needed: ${quantityInBase}`
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      product,
      quantity,
      unit,
      operation,
      purpose,
      batchSize: batchSize || null, // optional
      status: 'completed'
    });

    // Update product quantity
    const quantityChange = operation === 'Distribute' ? -quantityInBase : quantityInBase;
    await Product.findByIdAndUpdate(product, { $inc: { quantity: quantityChange } });

    return res.status(201).json({ success: true, data: transaction });

  } catch (err) {
    console.error("Transaction Error:", err);
    return res.status(500).json({ success: false, message: 'Transaction creation failed', error: err.message });
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