const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { supabase } = require('../config/supabase');

// Get user wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data: wishlistItems, error, count } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      data: {
        wishlist: wishlistItems || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
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

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      return res.status(400).json({
        status: 'error',
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const { data: wishlistItem, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId
      })
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Added to wishlist successfully',
      data: { wishlistItem }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Removed from wishlist successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Check if product is in wishlist
const checkWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const { data: wishlistItem } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    res.status(200).json({
      status: 'success',
      data: { inWishlist: !!wishlistItem }
    });
  } catch (error) {
    res.status(200).json({
      status: 'success',
      data: { inWishlist: false }
    });
  }
};

router.get('/', auth, getWishlist);
router.post('/', auth, addToWishlist);
router.delete('/:productId', auth, removeFromWishlist);
router.get('/check/:productId', auth, checkWishlistItem);

module.exports = router;
