const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { uploadProductImages } = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', adminAuth, uploadProductImages, validateProduct, productController.createProduct);
router.put('/:id', adminAuth, uploadProductImages, validateProduct, productController.updateProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);
router.patch('/:id/stock', adminAuth, productController.updateStock);

module.exports = router;
