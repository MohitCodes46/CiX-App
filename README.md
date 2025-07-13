# CiX Luxury App

A premium, minimalistic mobile app for the luxury apparel brand CiX, built with React Native and Expo.

## 🎯 Features

### ✨ Core Features
- **Luxury Design System**: Sophisticated color palette with deep violet, soft gold, and lilac accents
- **Onboarding Experience**: Animated brand logo reveal with elegant carousel
- **Authentication**: Sign in/Sign up with email, Google, and Apple
- **Product Catalog**: Browse clothing, watches, and accessories
- **Wishlist Management**: Save and manage favorite items
- **Shopping Cart**: Add items, manage quantities, and checkout
- **User Profile**: Personal information, order history, and settings

### 🚀 Advanced Features
- **Product Details**: Zoom functionality, size/color selection, styling tips
- **Push Notifications**: Exclusive drops, style tips, order updates
- **Payment Integration**: Multiple payment methods (cards, UPI, wallets)
- **Virtual Try-On**: AR camera integration for watches and accessories
- **Real-time Database**: Supabase integration for data persistence

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (Auth, Database, Storage)
- **Navigation**: React Navigation v6
- **UI Components**: Custom luxury design system
- **Notifications**: Expo Notifications
- **Camera**: Expo Camera for AR features
- **Payments**: Custom payment service (ready for Stripe/PayPal integration)

## 📱 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CiXApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key
   - Update `src/lib/supabase.ts` with your credentials:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

4. **Configure Expo**
   - Update `app.json` with your Expo project ID
   - Update notification service with your project ID:
   ```typescript
   projectId: 'YOUR_EXPO_PROJECT_ID'
   ```

5. **Run the app**
   ```bash
   npm start
   ```

## 🗄️ Database Schema

### Tables
- `users`: User profiles and preferences
- `products`: Product catalog with images, prices, variants
- `orders`: Order history and status
- `wishlist_items`: User wishlist
- `addresses`: Shipping addresses
- `payment_methods`: Saved payment methods

### Sample SQL for Supabase
```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  images TEXT[],
  sizes TEXT[],
  colors TEXT[],
  material TEXT,
  care_instructions TEXT,
  styling_tips TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  products JSONB,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Design System

### Colors
- **Primary**: Deep Violet (#8B5CF6)
- **Secondary**: Soft Gold (#F59E0B)
- **Accent**: Lilac (#E0E7FF)
- **Background**: White (#FFFFFF)
- **Surface**: Light Gray (#FAFAFA)

### Typography
- **Serif**: Georgia (headers)
- **Sans**: System (body text)
- **Weights**: Light (300) to Bold (700)

### Spacing
- **Base unit**: 16px
- **Scale**: xs(4), sm(8), base(16), lg(24), xl(32), 2xl(48), 3xl(64), 4xl(96)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PROJECT_ID=your_expo_project_id
```

### App Configuration
Update `app.json` for your specific needs:
```json
{
  "expo": {
    "name": "CiX",
    "slug": "cix-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#8B5CF6"
    },
    "scheme": "cix"
  }
}
```

## 🚀 Deployment

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### App Store Deployment
1. Configure app signing certificates
2. Update app metadata in App Store Connect
3. Submit for review

## 📱 Features in Detail

### Authentication Flow
- Email/password sign up and sign in
- Social authentication (Google, Apple)
- Password reset functionality
- Session management with Supabase

### Product Management
- Product catalog with categories
- Detailed product pages with zoom
- Size and color selection
- Wishlist functionality
- Stock management

### Shopping Experience
- Add to cart functionality
- Quantity management
- Coupon code support
- Multiple payment methods
- Order tracking

### User Experience
- Push notifications for exclusive drops
- Style tips and recommendations
- Virtual try-on for accessories
- Order history and tracking
- Address management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@cix.com or create an issue in the repository.

---

**CiX - Where elegance becomes identity.**
