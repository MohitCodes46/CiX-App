# Supabase Setup Guide for CiX App

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: CiX App
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
6. Click "Create new project"

### 2. Get Project Credentials

1. Go to Settings → API
2. Copy your:
   - **Project URL**
   - **Anon public key**

### 3. Update App Configuration

Update `src/lib/supabase.ts`:
```typescript
const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

## 🗄️ Database Setup

### 1. Create Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
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
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  products JSONB,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlist_items table
CREATE TABLE public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  product_id UUID REFERENCES public.products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create addresses table
CREATE TABLE public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  last4 TEXT,
  brand TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON public.products
  FOR SELECT USING (true);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view own wishlist" ON public.wishlist_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist" ON public.wishlist_items
  FOR ALL USING (auth.uid() = user_id);

-- Addresses policies
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- Payment methods policies
CREATE POLICY "Users can view own payment methods" ON public.payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);
```

### 3. Create Functions

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 🔐 Authentication Setup

### 1. Configure Auth Settings

1. Go to Authentication → Settings
2. Configure:
   - **Site URL**: Your app's URL
   - **Redirect URLs**: Add your app's redirect URLs
   - **Email Templates**: Customize welcome and reset emails

### 2. Enable Social Providers

#### Google OAuth
1. Go to Authentication → Providers
2. Enable Google
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret

#### Apple OAuth
1. Enable Apple provider
2. Add your Apple OAuth credentials:
   - Service ID
   - Key ID
   - Private Key

### 3. Configure Email Templates

Customize email templates in Authentication → Email Templates:
- Welcome email
- Password reset
- Email change confirmation

## 📊 Sample Data

### Insert Sample Products

```sql
INSERT INTO public.products (name, description, price, category, subcategory, images, sizes, colors, material, care_instructions, styling_tips) VALUES
(
  'Elegant Evening Dress',
  'A stunning evening dress crafted from the finest silk, featuring an elegant design that celebrates femininity and sophistication.',
  599.00,
  'Clothing',
  'Dresses',
  ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Burgundy'],
  '100% Silk',
  'Dry clean only. Store in a cool, dry place.',
  'Pair with statement jewelry and elegant heels for a complete look.'
),
(
  'Luxury Watch',
  'Timeless elegance meets modern sophistication in this premium timepiece.',
  1299.00,
  'Watches',
  'Classic',
  ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'],
  ARRAY['Small', 'Medium', 'Large'],
  ARRAY['Silver', 'Gold', 'Rose Gold'],
  'Stainless Steel',
  'Clean with a soft cloth. Avoid water exposure.',
  'Perfect for both formal and casual occasions.'
),
(
  'Designer Handbag',
  'Crafted from premium leather, this handbag combines luxury with functionality.',
  899.00,
  'Accessories',
  'Bags',
  ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'],
  ARRAY['One Size'],
  ARRAY['Black', 'Brown', 'Cream'],
  'Genuine Leather',
  'Clean with leather cleaner. Store in dust bag.',
  'Versatile design perfect for day to evening wear.'
);
```

## 🔧 Storage Setup

### 1. Create Storage Buckets

```sql
-- Create buckets for different content types
INSERT INTO storage.buckets (id, name, public) VALUES
('product-images', 'product-images', true),
('user-avatars', 'user-avatars', true),
('try-on-images', 'try-on-images', false);
```

### 2. Set Storage Policies

```sql
-- Product images are publicly readable
CREATE POLICY "Product images are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Users can upload their own avatars
CREATE POLICY "Users can upload own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view their own try-on images
CREATE POLICY "Users can view own try-on images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'try-on-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 🚀 Testing

### 1. Test Authentication

1. Run the app
2. Try signing up with email
3. Test social login (if configured)
4. Verify user creation in database

### 2. Test Database Operations

1. Browse products
2. Add items to wishlist
3. Create orders
4. Test user profile updates

### 3. Test Storage

1. Upload product images
2. Test user avatar upload
3. Verify public access to images

## 🔍 Monitoring

### 1. Database Monitoring

- Go to Dashboard → Database
- Monitor query performance
- Check for slow queries

### 2. Auth Monitoring

- Go to Authentication → Users
- Monitor user sign-ups
- Check failed login attempts

### 3. Storage Monitoring

- Go to Storage → Objects
- Monitor storage usage
- Check file access patterns

## 🛠️ Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Check if policies are correctly applied
   - Verify user authentication status

2. **Storage Access Denied**
   - Check bucket policies
   - Verify file paths and permissions

3. **Auth Redirect Issues**
   - Verify redirect URLs in auth settings
   - Check app scheme configuration

### Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
