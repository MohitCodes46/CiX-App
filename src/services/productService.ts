import apiClient from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  discountPercentage?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  brand?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  // Get all products with pagination and filters
  static async getProducts(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters
  ): Promise<ProductsResponse> {
    const params = {
      page,
      limit,
      ...filters,
    };
    return apiClient.get<ProductsResponse>('/products', params);
  }

  // Search products
  static async searchProducts(
    query: string,
    filters?: Omit<ProductFilters, 'search'>
  ): Promise<ProductsResponse> {
    const params = {
      q: query,
      ...filters,
    };
    return apiClient.get<ProductsResponse>('/products/search', params);
  }

  // Get featured products
  static async getFeaturedProducts(): Promise<Product[]> {
    const response = await apiClient.get<ProductsResponse>('/products', { 
      isFeatured: true, 
      limit: 10 
    });
    return response.products;
  }

  // Get products by category
  static async getProductsByCategory(
    category: string,
    page: number = 1
  ): Promise<ProductsResponse> {
    return apiClient.get<ProductsResponse>('/products', { 
      category, 
      page, 
      limit: 20 
    });
  }

  // Get single product by ID
  static async getProduct(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  // Get related products
  static async getRelatedProducts(
    productId: string,
    limit: number = 4
  ): Promise<Product[]> {
    const response = await apiClient.get<ProductsResponse>(
      `/products/${productId}/related`,
      { limit }
    );
    return response.products;
  }

  // Get product categories
  static async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/products/categories');
  }

  // Get product brands
  static async getBrands(): Promise<string[]> {
    return apiClient.get<string[]>('/products/brands');
  }
}

export default ProductService;
