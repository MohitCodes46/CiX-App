// Mock data for CiX Luxury App testing
const mockData = {
  users: [
    {
      id: 'user-1',
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      avatar_url: null,
      created_at: '2024-01-15T10:30:00Z',
      role: 'user'
    },
    {
      id: 'user-2', 
      email: 'jane.smith@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      avatar_url: null,
      created_at: '2024-01-20T14:45:00Z',
      role: 'user'
    }
  ],

  products: [
    {
      id: 'prod-1',
      name: 'Elegant Evening Dress',
      description: 'A stunning evening dress crafted from the finest silk, featuring an elegant design that celebrates femininity and sophistication. Perfect for special occasions and formal events.',
      price: 599.99,
      original_price: 799.99,
      category: 'Dresses',
      subcategory: 'Evening',
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Burgundy'],
      material: '100% Silk',
      care_instructions: 'Dry clean only. Store in a cool, dry place.',
      styling_tips: 'Pair with statement jewelry and elegant heels for a complete look.',
      in_stock: true,
      rating: 4.8,
      reviews: 124,
      created_at: '2024-01-10T09:00:00Z'
    },
    {
      id: 'prod-2',
      name: 'Classic Luxury Watch',
      description: 'Timeless design meets modern precision. This classic watch features premium materials and exceptional craftsmanship.',
      price: 1299.99,
      original_price: 1599.99,
      category: 'Watches',
      subcategory: 'Classic',
      images: [
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'
      ],
      sizes: ['38mm', '40mm', '42mm'],
      colors: ['Silver', 'Gold', 'Rose Gold'],
      material: 'Stainless Steel',
      care_instructions: 'Clean with soft cloth. Avoid water exposure.',
      styling_tips: 'Perfect for both casual and formal occasions.',
      in_stock: true,
      rating: 4.9,
      reviews: 89,
      created_at: '2024-01-12T11:30:00Z'
    },
    {
      id: 'prod-3',
      name: 'Designer Handbag',
      description: 'Luxurious leather handbag with premium hardware and spacious interior. The perfect accessory for any outfit.',
      price: 899.99,
      original_price: 1199.99,
      category: 'Accessories',
      subcategory: 'Bags',
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'
      ],
      sizes: ['One Size'],
      colors: ['Brown', 'Black', 'Tan'],
      material: 'Genuine Leather',
      care_instructions: 'Clean with leather cleaner. Store in dust bag.',
      styling_tips: 'Versatile design that complements any ensemble.',
      in_stock: true,
      rating: 4.7,
      reviews: 156,
      created_at: '2024-01-14T16:20:00Z'
    },
    {
      id: 'prod-4',
      name: 'Silk Blouse',
      description: 'Elegant silk blouse with a modern cut and sophisticated details. Perfect for professional and casual settings.',
      price: 299.99,
      original_price: 399.99,
      category: 'Clothing',
      subcategory: 'Tops',
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Blush', 'Navy'],
      material: '100% Silk',
      care_instructions: 'Hand wash cold. Iron on low heat.',
      styling_tips: 'Pair with tailored pants or a pencil skirt.',
      in_stock: true,
      rating: 4.6,
      reviews: 203,
      created_at: '2024-01-16T13:15:00Z'
    },
    {
      id: 'prod-5',
      name: 'Diamond Earrings',
      description: 'Exquisite diamond earrings featuring brilliant-cut stones in a classic setting. Timeless elegance for any occasion.',
      price: 2499.99,
      original_price: 2999.99,
      category: 'Accessories',
      subcategory: 'Jewelry',
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'
      ],
      sizes: ['One Size'],
      colors: ['White Gold', 'Yellow Gold'],
      material: '18K Gold, Diamonds',
      care_instructions: 'Clean with jewelry cleaner. Store in jewelry box.',
      styling_tips: 'Perfect for special occasions and formal events.',
      in_stock: true,
      rating: 4.9,
      reviews: 67,
      created_at: '2024-01-18T10:45:00Z'
    }
  ],

  categories: [
    { id: 1, name: 'Clothing', icon: 'shirt-outline' },
    { id: 2, name: 'Watches', icon: 'time-outline' },
    { id: 3, name: 'Accessories', icon: 'diamond-outline' }
  ],

  collections: [
    {
      id: 1,
      title: 'Luxe Summer Edit',
      subtitle: 'Elegant pieces for warm days',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    },
    {
      id: 2,
      title: 'Timeless Watches',
      subtitle: 'Classic sophistication',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'
    },
    {
      id: 3,
      title: 'Occasion Wear',
      subtitle: 'Dresses that make memories',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
    }
  ],

  orders: [
    {
      id: 'order-1',
      user_id: 'user-1',
      products: [
        {
          product_id: 'prod-1',
          quantity: 1,
          size: 'M',
          color: 'Black',
          price: 599.99
        }
      ],
      total_amount: 614.99,
      status: 'delivered',
      shipping_address: {
        first_name: 'John',
        last_name: 'Doe',
        address_line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA',
        phone: '+1-555-0123'
      },
      payment_method: 'card',
      created_at: '2024-01-25T14:30:00Z'
    }
  ],

  wishlist: [
    {
      id: 'wish-1',
      user_id: 'user-1',
      product_id: 'prod-2',
      created_at: '2024-01-26T09:15:00Z'
    },
    {
      id: 'wish-2',
      user_id: 'user-1',
      product_id: 'prod-5',
      created_at: '2024-01-26T10:30:00Z'
    }
  ],

  addresses: [
    {
      id: 'addr-1',
      user_id: 'user-1',
      first_name: 'John',
      last_name: 'Doe',
      address_line1: '123 Main Street',
      address_line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'USA',
      phone: '+1-555-0123',
      is_default: true
    },
    {
      id: 'addr-2',
      user_id: 'user-1',
      first_name: 'John',
      last_name: 'Doe',
      address_line1: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      postal_code: '90210',
      country: 'USA',
      phone: '+1-555-0456',
      is_default: false
    }
  ],

  notifications: [
    {
      id: 'notif-1',
      user_id: 'user-1',
      title: 'Order Shipped',
      message: 'Your order #order-1 has been shipped and is on its way!',
      type: 'order_update',
      read: false,
      created_at: '2024-01-26T11:00:00Z'
    },
    {
      id: 'notif-2',
      user_id: 'user-1',
      title: 'New Collection',
      message: 'Check out our latest luxury collection!',
      type: 'marketing',
      read: true,
      created_at: '2024-01-25T16:30:00Z'
    }
  ]
};

module.exports = mockData; 