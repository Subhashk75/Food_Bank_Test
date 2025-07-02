const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  restoreTransaction
} = require('../controllers/transactionController');

// Create a new transaction (e.g., receive or distribute)
router.post('/', async (req, res, next) => {
  try {
    await createTransaction(req, res);
    await restoreTransaction();
  } catch (error) {
    next(error);
  }
});

// Update an existing transaction
router.put('/:id', async (req, res, next) => {
  try {
    await updateTransaction(req, res);
    await restoreTransaction();
  } catch (error) {
    next(error);
  }
});

// Get all transactions
router.get('/', getAllTransactions);

// Get a specific transaction by ID
router.get('/:id', getTransactionById);
router.post("/restore" , restoreTransaction);
module.exports = router;
