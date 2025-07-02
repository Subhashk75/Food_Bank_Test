const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory
} = require('../controllers/categoryController');

router.route('/')
    .get(getAllCategories)
    .post(createCategory);

module.exports = router;