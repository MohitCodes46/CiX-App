#!/usr/bin/env node

// Simple backend startup script for testing with mock data
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

console.log('🚀 Starting CiX Luxury Backend in MOCK MODE...');
console.log('📱 This mode uses mock data for testing');
console.log('🔗 API Base URL: http://localhost:3001/api/v1');
console.log('📊 Health Check: http://localhost:3001/api/v1/health');

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('📋 Available mock endpoints:');
  console.log('   - GET  /api/v1/health');
  console.log('   - POST /api/v1/auth/login');
  console.log('   - POST /api/v1/auth/register');
  console.log('   - GET  /api/v1/products');
  console.log('   - GET  /api/v1/products/:id');
  console.log('   - GET  /api/v1/categories');
  console.log('   - GET  /api/v1/collections');
  console.log('   - GET  /api/v1/users/profile');
  console.log('   - GET  /api/v1/users/addresses');
  console.log('   - GET  /api/v1/wishlist');
  console.log('   - POST /api/v1/wishlist');
  console.log('   - GET  /api/v1/orders');
  console.log('   - POST /api/v1/orders');
  console.log('   - GET  /api/v1/notifications');
  console.log('');
  console.log('🔐 Test login credentials:');
  console.log('   Email: john.doe@example.com');
  console.log('   Password: password123');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
}); 