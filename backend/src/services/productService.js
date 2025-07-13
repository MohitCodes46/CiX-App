const { supabase } = require('../config/supabase');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ProductService {
  // Get all products with filtering and pagination
  static async getProducts(filters = {}, page = 1, limit = 20) {
    try {
      let query = supabase
        .from('products')
        .select('*');

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.subcategory) {
        query = query.eq('subcategory', filters.subcategory);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Order by creation date
      query = query.order('created_at', { ascending: false });

      const { data: products, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        products: products || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  // Create new product
  static async createProduct(productData, images = []) {
    try {
      // Process and upload images
      const imageUrls = await this.processAndUploadImages(images);

      const { data: product, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          images: imageUrls
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  // Update product
  static async updateProduct(id, updateData, newImages = []) {
    try {
      let imageUrls = updateData.images || [];

      // Process new images if provided
      if (newImages.length > 0) {
        const newImageUrls = await this.processAndUploadImages(newImages);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const { data: product, error } = await supabase
        .from('products')
        .update({
          ...updateData,
          images: imageUrls
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      // Get product images
      const { data: product } = await supabase
        .from('products')
        .select('images')
        .eq('id', id)
        .single();

      // Delete images from storage
      if (product && product.images) {
        await this.deleteImages(product.images);
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Process and upload images
  static async processAndUploadImages(files) {
    const imageUrls = [];

    for (const file of files) {
      try {
        // Process image with Sharp
        const processedImageBuffer = await sharp(file.path)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Generate unique filename
        const filename = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const filepath = path.join(process.env.UPLOAD_PATH || './uploads', 'products', filename);

        // Save processed image
        await fs.writeFile(filepath, processedImageBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filename, processedImageBuffer, {
            contentType: 'image/jpeg'
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filename);

        imageUrls.push(publicUrl);

        // Clean up local file
        await fs.unlink(filepath);
      } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
      }
    }

    return imageUrls;
  }

  // Delete images from storage
  static async deleteImages(imageUrls) {
    try {
      for (const imageUrl of imageUrls) {
        const filename = imageUrl.split('/').pop();
        await supabase.storage
          .from('product-images')
          .remove([filename]);
      }
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  }

  // Search products
  static async searchProducts(query, filters = {}) {
    try {
      let searchQuery = supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

      // Apply additional filters
      if (filters.category) {
        searchQuery = searchQuery.eq('category', filters.category);
      }
      if (filters.minPrice) {
        searchQuery = searchQuery.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        searchQuery = searchQuery.lte('price', filters.maxPrice);
      }

      const { data: products, error } = await searchQuery;

      if (error) {
        throw new Error(error.message);
      }

      return products || [];
    } catch (error) {
      throw error;
    }
  }

  // Get product categories
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category, subcategory')
        .order('category');

      if (error) {
        throw new Error(error.message);
      }

      // Group by category and subcategory
      const categories = {};
      data.forEach(item => {
        if (!categories[item.category]) {
          categories[item.category] = [];
        }
        if (item.subcategory && !categories[item.category].includes(item.subcategory)) {
          categories[item.category].push(item.subcategory);
        }
      });

      return categories;
    } catch (error) {
      throw error;
    }
  }

  // Update product stock
  static async updateStock(productId, quantity, operation = 'decrease') {
    try {
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('in_stock')
        .eq('id', productId)
        .single();

      if (fetchError) {
        throw new Error('Product not found');
      }

      const newStock = operation === 'decrease' 
        ? Math.max(0, product.in_stock - quantity)
        : product.in_stock + quantity;

      const { error: updateError } = await supabase
        .from('products')
        .update({ in_stock: newStock })
        .eq('id', productId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return { in_stock: newStock };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
