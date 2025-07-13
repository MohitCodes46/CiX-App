const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Webhook server is running',
    timestamp: new Date().toISOString()
  });
});

// Stripe webhook endpoint
app.post('/api/v1/payments/webhook', (req, res) => {
  console.log('🔔 Stripe webhook received:', req.body);
  
  // Log the webhook data
  console.log('Event type:', req.body.type);
  console.log('Event data:', JSON.stringify(req.body.data, null, 2));
  
  // Respond to Stripe
  res.json({ received: true });
});

// Test endpoint
app.get('/api/v1/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Webhook server is ready for Stripe',
    webhook_url: 'https://your-ngrok-url.ngrok.io/api/v1/payments/webhook'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/v1/health`);
  console.log(`🔔 Webhook: http://localhost:${PORT}/api/v1/payments/webhook`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/v1/test`);
});
