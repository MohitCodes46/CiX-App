// For mock mode, create a dummy stripe client
const isMockMode = !process.env.STRIPE_SECRET_KEY;

const stripe = isMockMode ? {
  paymentIntents: {
    create: (data) => Promise.resolve({
      id: 'pi_mock_' + Date.now(),
      client_secret: 'pi_mock_secret_' + Date.now(),
      amount: data.amount,
      currency: data.currency || 'usd'
    })
  },
  setupIntents: {
    create: (data) => Promise.resolve({
      id: 'seti_mock_' + Date.now(),
      client_secret: 'seti_mock_secret_' + Date.now()
    })
  },
  webhooks: {
    constructEvent: (payload, signature, secret) => ({
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_mock_' + Date.now() } }
    })
  }
} : require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
