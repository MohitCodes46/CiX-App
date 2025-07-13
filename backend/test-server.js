const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CiX Luxury Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Test endpoints
app.get('/api/v1/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend API is working correctly',
    endpoints: {
      auth: '/api/v1/auth/*',
      products: '/api/v1/products/*',
      orders: '/api/v1/orders/*',
      users: '/api/v1/users/*',
      wishlist: '/api/v1/wishlist/*',
      payments: '/api/v1/payments/*',
      notifications: '/api/v1/notifications/*',
      uploads: '/api/v1/uploads/*'
    }
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CiX Luxury Backend Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🧪 Test Endpoint: http://localhost:${PORT}/api/v1/test`);
});
