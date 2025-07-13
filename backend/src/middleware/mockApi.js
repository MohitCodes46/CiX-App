const mockData = require('../mockData');

// Mock API middleware for testing
const mockApi = (req, res, next) => {
  // Check if we should use mock data (when Supabase is not configured)
  const shouldUseMock = !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!shouldUseMock) {
    return next();
  }

  const { method, path, query, body } = req;
  
  console.log(`[MOCK API] ${method} ${path}`);

  // Mock authentication
  if (path.includes('/auth/login') && method === 'POST') {
    const { email, password } = body;
    
    if (email === 'john.doe@example.com' && password === 'password123') {
      return res.json({
        status: 'success',
        data: {
          user: mockData.users[0],
          token: 'mock-jwt-token-12345'
        }
      });
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
  }

  if (path.includes('/auth/register') && method === 'POST') {
    return res.json({
      status: 'success',
      message: 'Account created successfully! Please check your email to verify your account.',
      data: {
        user: {
          id: 'user-new',
          email: body.email,
          first_name: body.firstName,
          last_name: body.lastName
        }
      }
    });
  }

  // Mock products
  if (path.includes('/products') && method === 'GET') {
    const { category, search, page = 1, limit = 20 } = query;
    let filteredProducts = mockData.products;

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return res.json({
      status: 'success',
      data: {
        products: paginatedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredProducts.length,
          pages: Math.ceil(filteredProducts.length / limit)
        }
      }
    });
  }

  // Mock single product
  if (path.includes('/products/') && method === 'GET') {
    const productId = path.split('/').pop();
    const product = mockData.products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    return res.json({
      status: 'success',
      data: { product }
    });
  }

  // Mock categories
  if (path.includes('/categories') && method === 'GET') {
    return res.json({
      status: 'success',
      data: { categories: mockData.categories }
    });
  }

  // Mock collections
  if (path.includes('/collections') && method === 'GET') {
    return res.json({
      status: 'success',
      data: { collections: mockData.collections }
    });
  }

  // Mock user profile
  if (path.includes('/users/profile') && method === 'GET') {
    return res.json({
      status: 'success',
      data: { user: mockData.users[0] }
    });
  }

  // Mock addresses
  if (path.includes('/users/addresses') && method === 'GET') {
    return res.json({
      status: 'success',
      data: { addresses: mockData.addresses }
    });
  }

  // Mock wishlist
  if (path.includes('/wishlist') && method === 'GET') {
    const wishlistItems = mockData.wishlist.map(wish => {
      const product = mockData.products.find(p => p.id === wish.product_id);
      return {
        ...wish,
        product
      };
    });

    return res.json({
      status: 'success',
      data: {
        wishlist: wishlistItems,
        pagination: {
          page: 1,
          limit: 20,
          total: wishlistItems.length,
          pages: 1
        }
      }
    });
  }

  // Mock add to wishlist
  if (path.includes('/wishlist') && method === 'POST') {
    const { productId } = body;
    const product = mockData.products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    return res.json({
      status: 'success',
      message: 'Added to wishlist successfully',
      data: {
        wishlistItem: {
          id: `wish-${Date.now()}`,
          user_id: 'user-1',
          product_id: productId,
          product,
          created_at: new Date().toISOString()
        }
      }
    });
  }

  // Mock orders
  if (path.includes('/orders') && method === 'GET') {
    return res.json({
      status: 'success',
      data: {
        orders: mockData.orders.map(order => ({
          ...order,
          products: order.products.map(item => {
            const product = mockData.products.find(p => p.id === item.product_id);
            return { ...item, product };
          })
        }))
      }
    });
  }

  // Mock create order
  if (path.includes('/orders') && method === 'POST') {
    const { products, shipping_address, payment_method } = body;
    
    const orderTotal = products.reduce((sum, item) => {
      const product = mockData.products.find(p => p.id === item.productId);
      return sum + (product.price * item.quantity);
    }, 0);

    const newOrder = {
      id: `order-${Date.now()}`,
      user_id: 'user-1',
      products: products.map(item => {
        const product = mockData.products.find(p => p.id === item.productId);
        return {
          product_id: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: product.price
        };
      }),
      total_amount: orderTotal + 15, // Add shipping
      status: 'pending',
      shipping_address,
      payment_method,
      created_at: new Date().toISOString()
    };

    return res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: { order: newOrder }
    });
  }

  // Mock notifications
  if (path.includes('/notifications') && method === 'GET') {
    return res.json({
      status: 'success',
      data: {
        notifications: mockData.notifications,
        pagination: {
          page: 1,
          limit: 20,
          total: mockData.notifications.length,
          pages: 1
        }
      }
    });
  }

  // Mock health check
  if (path.includes('/health') && method === 'GET') {
    return res.json({
      status: 'success',
      message: 'CiX Luxury Backend is running (MOCK MODE)',
      timestamp: new Date().toISOString(),
      environment: 'mock',
      version: '1.0.0'
    });
  }

  // Default response for unmocked endpoints
  return res.status(404).json({
    status: 'error',
    message: 'Endpoint not found in mock mode'
  });
};

module.exports = mockApi; 