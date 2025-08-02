const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  restoreTransaction
} = require('../controllers/transactionController');

const { authMiddleware, authorizeRoles } = require('../utils/auth');

// ✅ Create a new transaction (receive or distribute)
// Only 'admin' and 'staff' can create
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'staff'),
  createTransaction
);

// ✅ Update an existing transaction
// Only 'admin' can update
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  updateTransaction
);

// ✅ Get all transactions
// All roles: admin, staff, volunteer
router.get(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'staff', 'volunteer'),
  getAllTransactions
);

// ✅ Get a specific transaction by ID
router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'staff', 'volunteer'),
  getTransactionById
);

// ✅ Restore inventory from transactions
// Only 'admin' allowed
router.post(
  '/restore',
  authMiddleware,
  authorizeRoles('admin'),
  restoreTransaction
);

module.exports = router;
