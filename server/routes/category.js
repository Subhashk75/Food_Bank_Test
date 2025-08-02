const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory
} = require('../controllers/categoryController');

const { authMiddleware, authorizeRoles } = require('../utils/auth');

// ✅ Get all categories
// Accessible by all roles
router.get(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'staff', 'volunteer'),
  getAllCategories
);

// ✅ Create a new category
// Only 'admin' and 'staff' allowed
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'staff'),
  createCategory
);

module.exports = router;
