const express = require('express');
const router = express.Router();
const { createDistributions } = require('../controllers/distributionController');

// POST /api/distributions
router.post('/', createDistributions);

module.exports = router;
