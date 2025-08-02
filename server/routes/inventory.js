const express = require('express');
const router = express.Router();
const {
  getInventory,
  createInventoryItem,
  receiveInventory
} = require('../controllers/inventoryController');

const { authMiddleware, authorizeRoles } = require('../utils/auth');

// ✅ GET inventory list (admin, staff, volunteer)
router.get(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'staff', 'volunteer'),
  getInventory
);

// ✅ POST create new inventory item (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  createInventoryItem
);

// ✅ POST receive inventory (admin, staff only)
router.post(
  '/receive',
  authMiddleware,
  authorizeRoles('admin', 'staff'),
  receiveInventory
);

module.exports = router;
