const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// Protected routes
router.post('/', auth, validateOrder, orderController.createOrder);
router.get('/', auth, orderController.getUserOrders);
router.get('/stats', auth, orderController.getOrderStats);
router.get('/:id', auth, orderController.getOrderById);
router.post('/:id/cancel', auth, orderController.cancelOrder);
router.post('/confirm-payment', auth, orderController.confirmPayment);

module.exports = router;
