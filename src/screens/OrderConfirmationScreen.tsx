import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NotificationService } from '../services/NotificationService';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface OrderConfirmationScreenProps {
  navigation: any;
  route: any;
}

export default function OrderConfirmationScreen({ navigation, route }: OrderConfirmationScreenProps) {
  const { orderId, orderDetails } = route.params;

  useEffect(() => {
    // Schedule order update notifications
    scheduleOrderNotifications();
  }, []);

  const scheduleOrderNotifications = async () => {
    try {
      // Schedule processing notification (2 hours later)
      const processingDate = new Date();
      processingDate.setHours(processingDate.getHours() + 2);
      await NotificationService.scheduleOrderUpdateNotification(orderId, 'processed');

      // Schedule shipping notification (24 hours later)
      const shippingDate = new Date();
      shippingDate.setDate(shippingDate.getDate() + 1);
      await NotificationService.scheduleOrderUpdateNotification(orderId, 'shipped');

      // Schedule delivery notification (3 days later)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      await NotificationService.scheduleOrderUpdateNotification(orderId, 'delivered');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  };

  const handleShareOrder = () => {
    Alert.alert(
      'Share Your Style',
      'Share your CiX purchase on Instagram with #CiXLuxury for a chance to be featured!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => {
          // Here you would integrate with social sharing
          Alert.alert('Success', 'Shared to Instagram!');
        }},
      ]
    );
  };

  const handleRateExperience = () => {
    Alert.alert(
      'Rate Your Experience',
      'We\'d love to hear about your CiX experience!',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => {
          // Here you would navigate to rating screen
          Alert.alert('Thank you!', 'Your feedback helps us improve.');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Success Animation */}
        <View style={styles.successContainer}>
          <LinearGradient
            colors={COLORS.luxuryGradient}
            style={styles.successCircle}
          >
            <Ionicons name="checkmark" size={48} color={COLORS.background} />
          </LinearGradient>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Thank you for your purchase. Your order has been successfully placed.
          </Text>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order Number</Text>
              <Text style={styles.orderValue}>#{orderId}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order Date</Text>
              <Text style={styles.orderValue}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total Amount</Text>
              <Text style={styles.orderValue}>
                ${orderDetails?.total_amount?.toFixed(2) || '0.00'}
              </Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Payment Method</Text>
              <Text style={styles.orderValue}>
                {orderDetails?.payment_method || 'Credit Card'}
              </Text>
            </View>
          </View>
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <View style={styles.shippingCard}>
            <View style={styles.shippingHeader}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={styles.shippingTitle}>Delivery Address</Text>
            </View>
            <Text style={styles.shippingText}>
              {orderDetails?.shipping_address?.first_name} {orderDetails?.shipping_address?.last_name}
            </Text>
            <Text style={styles.shippingText}>
              {orderDetails?.shipping_address?.address_line1}
            </Text>
            {orderDetails?.shipping_address?.address_line2 && (
              <Text style={styles.shippingText}>
                {orderDetails?.shipping_address?.address_line2}
              </Text>
            )}
            <Text style={styles.shippingText}>
              {orderDetails?.shipping_address?.city}, {orderDetails?.shipping_address?.state} {orderDetails?.shipping_address?.postal_code}
            </Text>
            <Text style={styles.shippingText}>
              {orderDetails?.shipping_address?.country}
            </Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Next?</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Order Confirmed</Text>
                <Text style={styles.stepDescription}>
                  Your order has been received and is being processed
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name="time" size={24} color={COLORS.secondary} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Processing</Text>
                <Text style={styles.stepDescription}>
                  We'll notify you when your order is ready to ship
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name="car" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Shipping</Text>
                <Text style={styles.stepDescription}>
                  Your order will be shipped within 1-2 business days
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name="home" size={24} color={COLORS.textLight} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Delivery</Text>
                <Text style={styles.stepDescription}>
                  Expected delivery in 3-5 business days
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShareOrder}
          >
            <Ionicons name="share-social" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Share Your Style</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRateExperience}
          >
            <Ionicons name="star" size={20} color={COLORS.secondary} />
            <Text style={styles.actionButtonText}>Rate Your Experience</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.trackOrderButton}
          onPress={() => navigation.navigate('OrderTracking', { orderId })}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Track Order</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
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
  successContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
    paddingHorizontal: SPACING.lg,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
  successTitle: {
    fontSize: FONTS.sizes['2xl'],
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  successSubtitle: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderLabel: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
  },
  orderValue: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  shippingCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  shippingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  shippingTitle: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  shippingText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  stepsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stepDescription: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  actionButtonText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  trackOrderButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
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
  continueShoppingButton: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  continueShoppingText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
  },
});
