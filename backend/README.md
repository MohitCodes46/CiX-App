# CiX Luxury Backend API

A comprehensive backend API for the CiX luxury apparel mobile application, built with Node.js, Express, and Supabase.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with social login support
- **Product Management**: Complete CRUD operations for luxury products
- **Order Processing**: Order creation, management, and payment integration
- **User Management**: Profile management, addresses, and payment methods
- **Wishlist System**: Add, remove, and manage wishlist items
- **Payment Integration**: Stripe payment processing with webhook support
- **Push Notifications**: Real-time notifications for order updates and exclusive drops
- **File Upload**: Image processing and storage with Supabase
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Email Notifications**: Automated emails for order confirmations and updates

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT, Supabase Auth
- **Payment**: Stripe
- **File Storage**: Supabase Storage
- **Email**: Nodemailer
- **Image Processing**: Sharp
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Supabase account and project
- Stripe account
- Email service (Gmail recommended)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006

   # Notification Configuration
   FCM_SERVER_KEY=your_fcm_server_key
   EXPO_ACCESS_TOKEN=your_expo_access_token
   ```

4. **Database Setup**
   
   Run the SQL scripts in your Supabase project:
   ```sql
   -- Create tables and setup RLS policies
   -- (See database-setup.sql for complete schema)
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/social-login` - Social media login
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

### Product Endpoints

- `GET /api/v1/products` - Get all products (with filtering)
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/search` - Search products
- `GET /api/v1/products/categories` - Get product categories
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)
- `PATCH /api/v1/products/:id/stock` - Update stock (Admin)

### Order Endpoints

- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders/:id/cancel` - Cancel order
- `POST /api/v1/orders/confirm-payment` - Confirm payment
- `GET /api/v1/orders/stats` - Get order statistics

### User Endpoints

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/avatar` - Update user avatar
- `GET /api/v1/users/addresses` - Get user addresses
- `POST /api/v1/users/addresses` - Add address
- `PUT /api/v1/users/addresses/:id` - Update address
- `DELETE /api/v1/users/addresses/:id` - Delete address
- `GET /api/v1/users/payment-methods` - Get payment methods
- `POST /api/v1/users/payment-methods` - Add payment method
- `DELETE /api/v1/users/payment-methods/:id` - Delete payment method

### Wishlist Endpoints

- `GET /api/v1/wishlist` - Get user wishlist
- `POST /api/v1/wishlist` - Add item to wishlist
- `DELETE /api/v1/wishlist/:productId` - Remove item from wishlist
- `GET /api/v1/wishlist/check/:productId` - Check if item in wishlist

### Payment Endpoints

- `POST /api/v1/payments/create-payment-intent` - Create payment intent
- `POST /api/v1/payments/confirm-payment` - Confirm payment
- `GET /api/v1/payments/payment-methods` - Get payment methods
- `POST /api/v1/payments/create-setup-intent` - Create setup intent
- `POST /api/v1/payments/webhook` - Stripe webhook handler

### Notification Endpoints

- `GET /api/v1/notifications` - Get user notifications
- `GET /api/v1/notifications/unread-count` - Get unread count
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/mark-all-read` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification
- `PUT /api/v1/notifications/push-token` - Update push token

### Upload Endpoints

- `POST /api/v1/uploads/avatar` - Upload user avatar
- `POST /api/v1/uploads/try-on` - Upload try-on image

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `SUPABASE_URL` | Supabase project URL | Yes | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes | - |
| `JWT_SECRET` | JWT secret key | Yes | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | - |
| `EMAIL_HOST` | SMTP host | Yes | - |
| `EMAIL_USER` | SMTP username | Yes | - |
| `EMAIL_PASS` | SMTP password | Yes | - |

### Database Schema

The backend uses Supabase with the following main tables:

- `users` - User profiles and authentication
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `wishlist_items` - User wishlists
- `addresses` - User addresses
- `payment_methods` - User payment methods
- `notifications` - Push notifications

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Helmet**: Security headers
- **File Upload Security**: File type and size validation
- **SQL Injection Protection**: Parameterized queries with Supabase

## 📱 Mobile App Integration

The backend is designed to work seamlessly with the CiX React Native mobile app:

- **Push Notifications**: Real-time updates via Expo notifications
- **Image Processing**: Optimized image uploads for mobile
- **Offline Support**: Graceful handling of network issues
- **Social Login**: Integration with Google and Apple authentication

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production database and services
   - Set up SSL certificates

2. **Process Management**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start src/server.js --name cix-backend
   ```

3. **Reverse Proxy**
   - Configure Nginx or Apache
   - Set up SSL termination
   - Configure load balancing if needed

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📊 Monitoring

- **Health Check**: `GET /api/v1/health`
- **Logging**: Structured logging with Winston
- **Error Tracking**: Comprehensive error handling and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete API implementation
- Authentication and authorization
- Product and order management
- Payment integration
- Push notifications
- File upload system
