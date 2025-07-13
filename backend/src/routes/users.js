const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validateAddress } = require('../middleware/validation');
const { uploadUserAvatar } = require('../middleware/upload');

// Protected routes
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.put('/avatar', auth, uploadUserAvatar, userController.updateUserAvatar);

// Address routes
router.get('/addresses', auth, userController.getUserAddresses);
router.post('/addresses', auth, validateAddress, userController.addUserAddress);
router.put('/addresses/:id', auth, validateAddress, userController.updateUserAddress);
router.delete('/addresses/:id', auth, userController.deleteUserAddress);

// Payment method routes
router.get('/payment-methods', auth, userController.getUserPaymentMethods);
router.post('/payment-methods', auth, userController.addUserPaymentMethod);
router.delete('/payment-methods/:id', auth, userController.deleteUserPaymentMethod);

module.exports = router;
