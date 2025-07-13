const { supabase } = require('../config/supabase');

class NotificationService {
  // Send push notification to user
  static async sendPushNotification(userId, notification) {
    try {
      // Get user's push token
      const { data: user, error } = await supabase
        .from('users')
        .select('push_token')
        .eq('id', userId)
        .single();

      if (error || !user.push_token) {
        throw new Error('User push token not found');
      }

      // Send notification via Expo
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          to: user.push_token,
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
          priority: 'high'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send push notification');
      }

      // Save notification to database
      await this.saveNotification(userId, notification);

      return { success: true };
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  // Save notification to database
  static async saveNotification(userId, notification) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notification.title,
          body: notification.body,
          type: notification.type || 'general',
          data: notification.data || {},
          read: false
        });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }

  // Get user notifications
  static async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const { data: notifications, error, count } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(error.message);
      }

      return {
        notifications: notifications || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Mark notification as read
  static async markNotificationAsRead(notificationId, userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllNotificationsAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId, userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Send exclusive drop notification
  static async sendExclusiveDropNotification(productId) {
    try {
      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('name, category')
        .eq('id', productId)
        .single();

      if (productError) {
        throw new Error('Product not found');
      }

      // Get all users who have notifications enabled
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, push_token')
        .not('push_token', 'is', null);

      if (usersError) {
        throw new Error(usersError.message);
      }

      // Send notifications to all users
      const notification = {
        title: 'Exclusive Drop Alert! 🎉',
        body: `${product.name} is now available for pre-order. Don't miss out on this luxury piece!`,
        type: 'exclusive_drop',
        data: {
          productId,
          category: product.category
        }
      };

      const promises = users.map(user => 
        this.sendPushNotification(user.id, notification)
      );

      await Promise.allSettled(promises);

      return { 
        success: true, 
        sentTo: users.length 
      };
    } catch (error) {
      throw error;
    }
  }

  // Send style tip notification
  static async sendStyleTipNotification() {
    try {
      const styleTips = [
        'Elevate your look with our latest styling guide. Discover how to pair your favorite pieces!',
        'New styling inspiration just dropped! Check out our latest fashion tips and trends.',
        'Transform your wardrobe with our expert styling advice. Your perfect look awaits!',
        'Discover the art of luxury styling with our curated fashion tips and tricks.'
      ];

      const randomTip = styleTips[Math.floor(Math.random() * styleTips.length)];

      // Get all users who have notifications enabled
      const { data: users, error } = await supabase
        .from('users')
        .select('id, push_token')
        .not('push_token', 'is', null);

      if (error) {
        throw new Error(error.message);
      }

      const notification = {
        title: 'Style Tip of the Day 💎',
        body: randomTip,
        type: 'style_tip',
        data: {
          tip: randomTip
        }
      };

      const promises = users.map(user => 
        this.sendPushNotification(user.id, notification)
      );

      await Promise.allSettled(promises);

      return { 
        success: true, 
        sentTo: users.length 
      };
    } catch (error) {
      throw error;
    }
  }

  // Send restock notification
  static async sendRestockNotification(productId) {
    try {
      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('name')
        .eq('id', productId)
        .single();

      if (productError) {
        throw new Error('Product not found');
      }

      // Get users who have this product in their wishlist
      const { data: wishlistUsers, error: wishlistError } = await supabase
        .from('wishlist_items')
        .select('user_id')
        .eq('product_id', productId);

      if (wishlistError) {
        throw new Error(wishlistError.message);
      }

      const notification = {
        title: 'Back in Stock! ✨',
        body: `${product.name} is back in stock. Order now before it sells out again!`,
        type: 'restock',
        data: {
          productId
        }
      };

      const promises = wishlistUsers.map(item => 
        this.sendPushNotification(item.user_id, notification)
      );

      await Promise.allSettled(promises);

      return { 
        success: true, 
        sentTo: wishlistUsers.length 
      };
    } catch (error) {
      throw error;
    }
  }

  // Send order update notification
  static async sendOrderUpdateNotification(orderId, status) {
    try {
      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('user_id, total_amount')
        .eq('id', orderId)
        .single();

      if (orderError) {
        throw new Error('Order not found');
      }

      const statusMessages = {
        'processing': 'Your order is being processed',
        'shipped': 'Your order has been shipped',
        'delivered': 'Your order has been delivered',
        'cancelled': 'Your order has been cancelled'
      };

      const notification = {
        title: 'Order Update 📦',
        body: `${statusMessages[status] || 'Your order status has been updated'}. Track your package in the app.`,
        type: 'order_update',
        data: {
          orderId,
          status
        }
      };

      await this.sendPushNotification(order.user_id, notification);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Update user push token
  static async updatePushToken(userId, pushToken) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ push_token: pushToken })
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Get notification count
  static async getUnreadNotificationCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationService;
