import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PaymentService, PaymentMethod } from '../services/PaymentService';
import { DatabaseService } from '../services/DatabaseService';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CheckoutScreenProps {
  navigation: any;
  route: any;
}

export default function CheckoutScreen({ navigation, route }: CheckoutScreenProps) {
  const { cartItems, totalAmount } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    loadPaymentMethods();
    loadAddresses();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const methods = await PaymentService.getPaymentMethods('user-id');
      setPaymentMethods(methods);
      const defaultMethod = methods.find(m => m.isDefault);
      setSelectedPaymentMethod(defaultMethod || null);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadAddresses = async () => {
    try {
      const userAddresses = await DatabaseService.getAddresses();
      setAddresses(userAddresses);
      const defaultAddress = userAddresses.find(a => a.is_default);
      setShippingAddress(defaultAddress || null);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'luxury20') {
      setDiscount(totalAmount * 0.2);
      Alert.alert('Success', '20% discount applied!');
    } else {
      Alert.alert('Error', 'Invalid coupon code');
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (!shippingAddress) {
      Alert.alert('Error', 'Please select a shipping address');
      return;
    }

    setLoading(true);
    try {
      // Create payment intent
      const paymentIntent = await PaymentService.createPaymentIntent(
        totalAmount - discount
      );

      // Process payment
      const success = await PaymentService.processPayment(
        paymentIntent.id,
        selectedPaymentMethod
      );

      if (success) {
        // Create order in database
        await DatabaseService.createOrder({
          products: cartItems,
          total_amount: totalAmount - discount,
          shipping_address: shippingAddress,
          payment_method: selectedPaymentMethod.type,
        });

        Alert.alert(
          'Success',
          'Order placed successfully! You will receive a confirmation email.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('OrderConfirmation'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = totalAmount;
  const shipping = 15;
  const finalTotal = subtotal + shipping - discount;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          {shippingAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressName}>
                {shippingAddress.first_name} {shippingAddress.last_name}
              </Text>
              <Text style={styles.addressText}>{shippingAddress.address_line1}</Text>
              {shippingAddress.address_line2 && (
                <Text style={styles.addressText}>{shippingAddress.address_line2}</Text>
              )}
              <Text style={styles.addressText}>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
              </Text>
              <Text style={styles.addressText}>{shippingAddress.country}</Text>
              <Text style={styles.addressText}>{shippingAddress.phone}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={() => navigation.navigate('AddAddress')}
            >
              <Ionicons name="add" size={24} color={COLORS.primary} />
              <Text style={styles.addAddressText}>Add Shipping Address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethod,
              ]}
              onPress={() => setSelectedPaymentMethod(method)}
            >
              <View style={styles.paymentMethodInfo}>
                <Ionicons 
                  name={method.type === 'card' ? 'card' : 'wallet'} 
                  size={24} 
                  color={COLORS.primary} 
                />
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  {method.last4 && (
                    <Text style={styles.paymentMethodLast4}>•••• {method.last4}</Text>
                  )}
                </View>
              </View>
              {selectedPaymentMethod?.id === method.id && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.addPaymentMethodButton}
            onPress={() => navigation.navigate('AddPaymentMethod')}
          >
            <Ionicons name="add" size={24} color={COLORS.primary} />
            <Text style={styles.addPaymentMethodText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>

        {/* Coupon Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coupon Code</Text>
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
              placeholderTextColor={COLORS.textLight}
            />
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApplyCoupon}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                  -${discount.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.summaryTotalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePayment}
          disabled={loading}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  addressCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  addressName: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  addressText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    marginLeft: SPACING.sm,
  },
  paymentMethodName: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  paymentMethodLast4: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
  },
  addPaymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addPaymentMethodText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  couponContainer: {
    flexDirection: 'row',
  },
  couponInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    marginRight: SPACING.sm,
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.background,
  },
  summaryContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.surface,
    marginVertical: SPACING.sm,
  },
  summaryTotal: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  summaryTotalValue: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  placeOrderButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.background,
  },
});
