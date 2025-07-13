import apiClient from './api';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardLast4?: string;
  cardBrand?: string;
  paypalEmail?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class OrderService {
  // Get user orders with pagination
  static async getOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<OrdersResponse> {
    return apiClient.get<OrdersResponse>('/orders', { page, limit });
  }

  // Get single order by ID
  static async getOrder(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  }

  // Create new order
  static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('/orders', orderData);
  }

  // Update order status
  static async updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${orderId}/status`, { status });
  }

  // Cancel order
  static async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${orderId}/cancel`, { reason });
  }

  // Get order tracking
  static async getOrderTracking(orderId: string): Promise<any> {
    return apiClient.get(`/orders/${orderId}/tracking`);
  }

  // Request refund
  static async requestRefund(
    orderId: string,
    reason: string,
    items?: string[]
  ): Promise<Order> {
    return apiClient.post<Order>(`/orders/${orderId}/refund`, {
      reason,
      items,
    });
  }

  // Get order statistics
  static async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    return apiClient.get('/orders/stats');
  }
}

export default OrderService;
