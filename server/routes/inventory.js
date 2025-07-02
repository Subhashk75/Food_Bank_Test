const express = require('express');
const router = express.Router();
const {
  getInventory,
  createInventoryItem,
  receiveInventory
} = require('../controllers/inventoryController');

router.get('/', getInventory);
router.post('/', createInventoryItem);
router.post('/receive', receiveInventory); // Add this line

module.exports = router;