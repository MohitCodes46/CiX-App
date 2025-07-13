#!/bin/bash

# CiX Luxury App Deployment Script
# This script prepares both frontend and backend for production deployment

set -e  # Exit on any error

echo "🚀 Starting CiX Luxury App Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v expo &> /dev/null; then
        print_warning "Expo CLI not found. Installing..."
        npm install -g @expo/cli
    fi
    
    print_status "Dependencies check passed"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env.production" ]; then
        print_warning "Backend .env.production not found. Creating from template..."
        cp production.env.example backend/.env.production
        print_warning "Please edit backend/.env.production with your production values"
    fi
    
    # Frontend environment
    if [ ! -f ".env.production" ]; then
        print_warning "Frontend .env.production not found. Creating from template..."
        cp production.env.example .env.production
        print_warning "Please edit .env.production with your production values"
    fi
    
    print_status "Environment files ready"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    print_status "Dependencies installed"
}

# Lint and type-check
lint_and_check() {
    print_status "Running linting and type checking..."
    
    # Frontend linting
    print_status "Linting frontend..."
    if npm run lint 2>/dev/null; then
        print_status "Frontend linting passed"
    else
        print_warning "Frontend linting failed or not configured"
    fi
    
    # Backend linting
    print_status "Linting backend..."
    cd backend
    if npm run lint 2>/dev/null; then
        print_status "Backend linting passed"
    else
        print_warning "Backend linting failed or not configured"
    fi
    cd ..
    
    print_status "Linting and type checking completed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend for production..."
    
    # Check if EAS is configured
    if [ ! -f "eas.json" ]; then
        print_error "eas.json not found. Please configure EAS build"
        exit 1
    fi
    
    print_status "Frontend build configuration ready"
    print_warning "To build for production, run:"
    echo "  eas build --platform ios --profile production"
    echo "  eas build --platform android --profile production"
}

# Setup backend for production
setup_backend() {
    print_status "Setting up backend for production..."
    
    cd backend
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        print_warning "PM2 not found. Installing..."
        npm install -g pm2
    fi
    
    # Create logs directory
    mkdir -p logs
    
    print_status "Backend production setup ready"
    print_warning "To start backend in production, run:"
    echo "  cd backend"
    echo "  pm2 start src/server.js --env production"
    
    cd ..
}

# Create deployment documentation
create_docs() {
    print_status "Creating deployment documentation..."
    
    cat > DEPLOYMENT_GUIDE.md << 'EOF'
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
EOF

    print_status "Deployment documentation created: DEPLOYMENT_GUIDE.md"
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    check_dependencies
    setup_environment
    install_dependencies
    lint_and_check
    build_frontend
    setup_backend
    create_docs
    
    print_status "Deployment preparation completed!"
    print_status "Next steps:"
    echo "1. Edit environment files with production values"
    echo "2. Deploy backend to your server"
    echo "3. Build and submit frontend to app stores"
    echo "4. See DEPLOYMENT_GUIDE.md for detailed instructions"
}

# Run main function
main "$@"
