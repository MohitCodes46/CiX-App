import { Alert } from 'react-native';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  name: string;
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  paymentMethod: string;
}

export class PaymentService {
  static async createPaymentIntent(amount: number, currency: string = 'USD'): Promise<PaymentIntent> {
    // This would integrate with Stripe, PayPal, or other payment processors
    // For now, we'll simulate the payment process
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const paymentIntent: PaymentIntent = {
          id: `pi_${Math.random().toString(36).substr(2, 9)}`,
          amount,
          currency,
          status: 'pending',
          paymentMethod: 'card',
        };
        resolve(paymentIntent);
      }, 1000);
    });
  }

  static async processPayment(paymentIntentId: string, paymentMethod: PaymentMethod): Promise<boolean> {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const success = Math.random() > 0.05;
        if (success) {
          Alert.alert('Success', 'Payment processed successfully!');
        } else {
          Alert.alert('Error', 'Payment failed. Please try again.');
        }
        resolve(success);
      }, 2000);
    });
  }

  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // This would fetch from your backend/database
    return [
      {
        id: '1',
        type: 'card',
        name: 'Visa ending in 4242',
        last4: '4242',
        brand: 'visa',
        isDefault: true,
      },
      {
        id: '2',
        type: 'card',
        name: 'Mastercard ending in 5555',
        last4: '5555',
        brand: 'mastercard',
        isDefault: false,
      },
    ];
  }

  static async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    // This would add to your backend/database
    return {
      ...paymentMethod,
      id: Math.random().toString(36).substr(2, 9),
    };
  }

  static async removePaymentMethod(paymentMethodId: string): Promise<boolean> {
    // This would remove from your backend/database
    return true;
  }

  static async validateCard(cardNumber: string, expiryMonth: string, expiryYear: string, cvv: string): Promise<boolean> {
    // Basic card validation
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      return false;
    }
    
    if (!expiryMonth || !expiryYear) {
      return false;
    }
    
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      return false;
    }
    
    // Check if card is expired
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (parseInt(expiryYear) < currentYear) {
      return false;
    }
    
    if (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth) {
      return false;
    }
    
    return true;
  }

  static async processUPIPayment(upiId: string, amount: number): Promise<boolean> {
    // Simulate UPI payment
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for UPI
        if (success) {
          Alert.alert('Success', 'UPI payment successful!');
        } else {
          Alert.alert('Error', 'UPI payment failed. Please try again.');
        }
        resolve(success);
      }, 1500);
    });
  }

  static async processWalletPayment(walletType: string, amount: number): Promise<boolean> {
    // Simulate wallet payment
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate for wallets
        if (success) {
          Alert.alert('Success', `${walletType} payment successful!`);
        } else {
          Alert.alert('Error', `${walletType} payment failed. Please try again.`);
        }
        resolve(success);
      }, 1000);
    });
  }
}
