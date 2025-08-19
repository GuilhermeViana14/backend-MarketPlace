const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Rotas públicas
router.get('/', getProducts);
router.get('/:id', getProduct);

// Rotas protegidas
router.post('/', protect, authorize('seller', 'admin'), createProduct);
router.get('/user/my-products', protect, getMyProducts);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
