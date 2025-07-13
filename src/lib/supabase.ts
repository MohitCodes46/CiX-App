import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Get Supabase configuration from environment or use defaults
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://zuisfhonhljsdaoxodac.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1aXNmaG9uaGxqc2Rhb3hvZGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzM1MjUsImV4cCI6MjA2NzkwOTUyNX0.KKvz6Na3wF8kYDtUS1VA0uPZlrxbg3YWR3P0NdrxPaI';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  sizes: string[];
  colors: string[];
  material: string;
  care_instructions: string;
  styling_tips: string;
  in_stock: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  products: OrderItem[];
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  payment_method: string;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Address {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}
