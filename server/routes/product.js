const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  updateProduct,
  deleteProduct,
  updateProductQuantity
} = require('../controllers/productController');


router.route('/')
    .post(createProduct)
    .get(getAllProducts);

router.get('/search', searchProducts);

router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

router.patch('/:id/quantity', updateProductQuantity);

module.exports = router;