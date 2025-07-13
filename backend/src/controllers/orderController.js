const OrderService = require('../services/orderService');

// Create new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = req.body;

    const result = await OrderService.createOrder(userId, orderData);

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const result = await OrderService.getUserOrders(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await OrderService.getOrderById(id, userId);

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await OrderService.cancelOrder(id, userId);

    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Confirm payment
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    await OrderService.confirmPayment(paymentIntentId);

    res.status(200).json({
      status: 'success',
      message: 'Payment confirmed successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await OrderService.getOrderStats(userId);

    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  confirmPayment,
  getOrderStats
};
