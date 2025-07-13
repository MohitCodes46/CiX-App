# CiX Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Update the `.env` file with your actual credentials:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration (Required)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN=7d

# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration (Required for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Other configurations...
```

### 3. Database Setup
1. Create a Supabase project at https://supabase.com
2. Run the SQL script in your Supabase SQL editor:
   ```bash
   # Copy the contents of database-setup.sql and run in Supabase
   ```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start

# Test mode (without database)
node test-server.js
```

## �� API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (Admin)

### Orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order by ID

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/addresses` - Get user addresses

### Wishlist
- `GET /api/v1/wishlist` - Get user wishlist
- `POST /api/v1/wishlist` - Add to wishlist
- `DELETE /api/v1/wishlist/:productId` - Remove from wishlist

### Payments
- `POST /api/v1/payments/create-payment-intent` - Create payment intent
- `POST /api/v1/payments/confirm-payment` - Confirm payment

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/push-token` - Update push token

## 🔧 Configuration Options

### Environment Variables
All configuration is done through environment variables. See `.env.example` for the complete list.

### Database Schema
The backend uses Supabase with the following main tables:
- `users` - User profiles and authentication
- `products` - Product catalog
- `orders` - Order management
- `wishlist_items` - User wishlists
- `addresses` - User addresses
- `payment_methods` - User payment methods
- `notifications` - Push notifications

### Security Features
- JWT-based authentication
- Rate limiting
- CORS protection
- Input validation
- File upload security
- SQL injection protection

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/v1/health
```

### Test Endpoint
```bash
curl http://localhost:3001/api/v1/test
```

## 📱 Mobile App Integration

The backend is designed to work with the CiX React Native mobile app:
- Push notifications via Expo
- Image upload and processing
- Real-time order updates
- Social login integration

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
1. Set `NODE_ENV=production`
2. Configure production environment variables
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name cix-backend
   ```

## 🆘 Troubleshooting

### Common Issues

1. **Missing Supabase Configuration**
   - Ensure all Supabase environment variables are set
   - Verify your Supabase project is active

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill existing processes using the port

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check if RLS policies are properly configured

4. **Payment Integration Issues**
   - Verify Stripe credentials
   - Check webhook configuration

### Logs
Check the logs directory for detailed error information:
```bash
tail -f logs/error.log
```

## 📞 Support

For issues and questions:
1. Check the logs for error details
2. Verify environment configuration
3. Test with the health check endpoint
4. Review the API documentation

## 🔄 Updates

To update the backend:
1. Pull the latest changes
2. Run `npm install` for new dependencies
3. Update environment variables if needed
4. Restart the server
