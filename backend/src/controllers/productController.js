const mockData = require('../mockData');

// Get all products
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
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

    res.status(200).json({
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
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = mockData.products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: { categories: mockData.categories }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get collections
const getCollections = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: { collections: mockData.collections }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...req.body,
      created_at: new Date().toISOString()
    };

    mockData.products.push(newProduct);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product: newProduct }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = mockData.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    mockData.products[productIndex] = {
      ...mockData.products[productIndex],
      ...req.body,
      id // Ensure ID doesn't change
    };

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product: mockData.products[productIndex] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = mockData.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const deletedProduct = mockData.products.splice(productIndex, 1)[0];

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
      data: { product: deletedProduct }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q, category, price_min, price_max, sort } = req.query;
    let filteredProducts = mockData.products;

    if (q) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (price_min) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(price_min));
    }

    if (price_max) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(price_max));
    }

    if (sort) {
      switch (sort) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        products: filteredProducts,
        total: filteredProducts.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get product by ID (alias for getProduct)
const getProductById = getProduct;

// Update stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { in_stock } = req.body;
    
    const productIndex = mockData.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    mockData.products[productIndex].in_stock = in_stock;

    res.status(200).json({
      status: 'success',
      message: 'Stock updated successfully',
      data: { product: mockData.products[productIndex] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getProductById,
  searchProducts,
  getCategories,
  getCollections,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
}; 