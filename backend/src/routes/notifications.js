const express = require('express');
const router = express.Router();
const NotificationService = require('../services/notificationService');
const { auth } = require('../middleware/auth');

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const result = await NotificationService.getUserNotifications(
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

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await NotificationService.markNotificationAsRead(id, userId);

    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await NotificationService.markAllNotificationsAsRead(userId);

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await NotificationService.deleteNotification(id, userId);

    res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update push token
const updatePushToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pushToken } = req.body;

    await NotificationService.updatePushToken(userId, pushToken);

    res.status(200).json({
      status: 'success',
      message: 'Push token updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await NotificationService.getUnreadNotificationCount(userId);

    res.status(200).json({
      status: 'success',
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

router.get('/', auth, getUserNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.patch('/:id/read', auth, markNotificationAsRead);
router.patch('/mark-all-read', auth, markAllNotificationsAsRead);
router.delete('/:id', auth, deleteNotification);
router.put('/push-token', auth, updatePushToken);

module.exports = router;
