# CiX Luxury App Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Expo CLI installed
- PM2 installed (for backend)
- Production environment variables configured

## Environment Setup

### Backend (.env.production)
Edit `backend/.env.production` with your production values:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET
- STRIPE_SECRET_KEY
- EMAIL_HOST, EMAIL_USER, EMAIL_PASS
- Other production settings

### Frontend (.env.production)
Edit `.env.production` with your production values:
- EXPO_PUBLIC_API_URL (your backend domain)
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY
- EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY

## Deployment Steps

### 1. Backend Deployment
```bash
cd backend
npm install
pm2 start src/server.js --env production
pm2 save
pm2 startup
```

### 2. Frontend Deployment
```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to app stores
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

### 3. Monitoring
```bash
# Monitor backend
pm2 monit

# View logs
pm2 logs
```

## Production Checklist
- [ ] Environment variables configured
- [ ] Backend server running
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] App store submissions ready
- [ ] Monitoring and logging set up
