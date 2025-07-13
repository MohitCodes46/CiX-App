const { supabase } = require('../config/supabase');
const stripe = require('../config/stripe');
const transporter = require('../config/email');

class OrderService {
  // Create new order
  static async createOrder(userId, orderData) {
    try {
      const { products, shippingAddress, paymentMethod, totalAmount } = orderData;

      // Validate products and check stock
      await this.validateOrderProducts(products);

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          userId,
          orderType: 'luxury_apparel'
        }
      });

      // Create order in database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          products: products,
          total_amount: totalAmount,
          status: 'pending',
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          stripe_payment_intent_id: paymentIntent.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update product stock
      await this.updateProductStock(products);

      return {
        order,
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user orders
  static async getUserOrders(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { data: orders, error, count } = await supabase
        .from('orders')
        .select(`
          *,
          products:products->product_id(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(error.message);
      }

      return {
        orders: orders || [],
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

  // Get order by ID
  static async getOrderById(orderId, userId) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          products:products->product_id(*)
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, status, userId = null) {
    try {
      let query = supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      // If userId provided, ensure user owns the order
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: order, error } = await query
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Send status update email
      await this.sendOrderStatusEmail(order);

      return order;
    } catch (error) {
      throw error;
    }
  }

  // Confirm payment
  static async confirmPayment(paymentIntentId) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

      if (error) {
        throw new Error('Order not found');
      }

      // Update order status to confirmed
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          payment_confirmed_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Send confirmation email
      await this.sendOrderConfirmationEmail(order);

      return { message: 'Payment confirmed successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(orderId, userId) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error('Order not found');
      }

      if (order.status === 'cancelled') {
        throw new Error('Order is already cancelled');
      }

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Restore product stock
      await this.restoreProductStock(order.products);

      // Send cancellation email
      await this.sendOrderCancellationEmail(order);

      return { message: 'Order cancelled successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Validate order products
  static async validateOrderProducts(products) {
    for (const item of products) {
      const { data: product, error } = await supabase
        .from('products')
        .select('in_stock, name')
        .eq('id', item.product_id)
        .single();

      if (error) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      if (product.in_stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }
  }

  // Update product stock
  static async updateProductStock(products) {
    for (const item of products) {
      await supabase.rpc('decrease_product_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      });
    }
  }

  // Restore product stock
  static async restoreProductStock(products) {
    for (const item of products) {
      await supabase.rpc('increase_product_stock', {
        product_id: item.product_id,
        quantity: item.quantity
      });
    }
  }

  // Send order confirmation email
  static async sendOrderConfirmationEmail(order) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('email, first_name')
        .eq('id', order.user_id)
        .single();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Order Confirmed - #${order.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6;">Order Confirmed!</h2>
            <p>Dear ${user.first_name},</p>
            <p>Your order #${order.id} has been confirmed and is being processed.</p>
            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Total Amount:</strong> $${order.total_amount}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            <p>We'll notify you when your order ships.</p>
            <p>Best regards,<br>The CiX Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  }

  // Send order status email
  static async sendOrderStatusEmail(order) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('email, first_name')
        .eq('id', order.user_id)
        .single();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Order Update - #${order.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6;">Order Status Update</h2>
            <p>Dear ${user.first_name},</p>
            <p>Your order #${order.id} status has been updated to: <strong>${order.status}</strong></p>
            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>Track your order in the CiX app.</p>
            <p>Best regards,<br>The CiX Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending order status email:', error);
    }
  }

  // Send order cancellation email
  static async sendOrderCancellationEmail(order) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('email, first_name')
        .eq('id', order.user_id)
        .single();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Order Cancelled - #${order.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6;">Order Cancelled</h2>
            <p>Dear ${user.first_name},</p>
            <p>Your order #${order.id} has been cancelled as requested.</p>
            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Status:</strong> Cancelled</p>
              <p><strong>Cancelled:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br>The CiX Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending order cancellation email:', error);
    }
  }

  // Get order statistics
  static async getOrderStats(userId) {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount')
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      const stats = {
        total: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
        byStatus: {}
      };

      orders.forEach(order => {
        stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
      });

      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderService;
