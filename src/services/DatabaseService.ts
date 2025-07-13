import { supabase } from '../lib/supabase';
import { User, Product, Order, Address, WishlistItem } from '../lib/supabase';

export class DatabaseService {
  // User Management
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserProfile(updates: Partial<User>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Product Management
  static async getProducts(category?: string, subcategory?: string): Promise<Product[]> {
    let query = supabase.from('products').select('*');

    if (category) {
      query = query.eq('category', category);
    }
    if (subcategory) {
      query = query.eq('subcategory', subcategory);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getProductById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) throw error;
    return data || [];
  }

  // Wishlist Management
  static async getWishlist(): Promise<WishlistItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  }

  static async addToWishlist(productId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (error) throw error;
  }

  static async removeFromWishlist(productId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;
  }

  // Order Management
  static async createOrder(orderData: {
    products: any[];
    total_amount: number;
    shipping_address: any;
    payment_method: string;
  }): Promise<Order> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        ...orderData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getOrders(): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  }

  // Address Management
  static async getAddresses(): Promise<Address[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async addAddress(addressData: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<Address> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        ...addressData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAddress(addressId: string, updates: Partial<Address>): Promise<Address> {
    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAddress(addressId: string): Promise<void> {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) throw error;
  }

  // Storage Management
  static async uploadProductImage(file: File, productId: string): Promise<string> {
    const fileName = `${productId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  static async uploadUserAvatar(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('user-avatars')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  static async uploadTryOnImage(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('try-on-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('try-on-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }
}
