const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const { auth } = require('../middleware/auth');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', paymentMethodType = 'card' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: [paymentMethodType],
      metadata: {
        userId: req.user.id
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
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

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      res.status(200).json({
        status: 'success',
        message: 'Payment confirmed successfully',
        data: { paymentIntent }
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get payment methods
const getPaymentMethods = async (req, res) => {
  try {
    const { data: paymentMethods, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      data: { paymentMethods: paymentMethods || [] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create setup intent for saving payment methods
const createSetupIntent = async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
      metadata: {
        userId: req.user.id
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Webhook handler for Stripe events
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: `Webhook Error: ${err.message}`
    });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object.id);
        break;
      
      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Webhook processing failed'
    });
  }
};

router.post('/create-payment-intent', auth, createPaymentIntent);
router.post('/confirm-payment', auth, confirmPayment);
router.get('/payment-methods', auth, getPaymentMethods);
router.post('/create-setup-intent', auth, createSetupIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
