import axios from 'axios';
import Constants from 'expo-constants';

// Get API URL from environment or use fallback
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.6:3001/api/v1';

// Check if we're in development mode and backend is not available
const isDevelopment = __DEV__;
const shouldUseMockData = isDevelopment && !API_BASE_URL.includes('http://localhost:3001');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development when backend is not available
const mockResponses = {
  products: {
    data: [
      {
        id: '1',
        name: 'Elegant Evening Dress',
        price: 599,
        description: 'A stunning evening dress crafted from the finest silk.',
        category: 'Dresses',
        images: [],
        in_stock: true
      },
      {
        id: '2',
        name: 'Classic Watch',
        price: 1299,
        description: 'Timeless design meets modern precision.',
        category: 'Watches',
        images: [],
        in_stock: true
      }
    ]
  },
  user: {
    data: {
      id: 'user-1',
      email: 'user@example.com',
      first_name: 'John',
      last_name: 'Doe'
    }
  }
};

// Interceptor to handle mock responses
api.interceptors.request.use(
  (config) => {
    // If using mock data, return a mock response
    if (shouldUseMockData) {
      const urlKey = config.url?.split('/').pop() || 'products';
      const mockData = (mockResponses as any)[urlKey] || mockResponses.products;
      const mockResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK'
      };
      
      // Return a promise that resolves with mock data
      return Promise.reject({
        isMock: true,
        response: mockResponse
      });
    }
    
    // Add auth token if available
    // const token = await SecureStore.getItemAsync('auth_token');
    // if (token) config.headers['Authorization'] = `Bearer ${token}`;
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle mock responses
    if (error.isMock) {
      return Promise.resolve(error.response);
    }
    
    // Handle real network errors
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    
    // Network error - return mock data in development
    if (isDevelopment) {
      console.warn('Network error, using mock data:', error.message);
      const mockResponse = {
        data: mockResponses.products,
        status: 200,
        statusText: 'OK'
      };
      return Promise.resolve(mockResponse);
    }
    
    return Promise.reject({ message: 'Network error' });
  }
);

export const get = (url: string, params?: any) => api.get(url, { params });
export const post = (url: string, data?: any) => api.post(url, data);
export const put = (url: string, data?: any) => api.put(url, data);
export const del = (url: string, params?: any) => api.delete(url, { params });

export default api;