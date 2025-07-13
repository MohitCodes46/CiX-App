import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function CartScreen({ navigation }: any) {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Elegant Evening Dress', price: 599, quantity: 1, size: 'M' },
    { id: 2, name: 'Luxury Watch', price: 1299, quantity: 1, size: 'L' },
  ]);

  const [couponCode, setCouponCode] = useState('');

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="trash-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {cartItems.length > 0 ? (
        <>
          <ScrollView style={styles.cartItemsContainer} showsVerticalScrollIndicator={false}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemImagePlaceholder}>
                  <Ionicons name="shirt-outline" size={32} color={COLORS.textLight} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSize}>Size: {item.size}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
                <View style={styles.itemActions}>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Ionicons name="close" size={16} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Coupon Code */}
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
              placeholderTextColor={COLORS.textLight}
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>${shipping}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.summaryTotalValue}>${total}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <View style={styles.checkoutContainer}>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="bag" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateSubtitle}>
            Add some beautiful items to your cart
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerTitle: {
    fontSize: FONTS.sizes['2xl'],
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  itemImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemSize: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    paddingHorizontal: SPACING.sm,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
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
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  summaryTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
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
  checkoutContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtitle: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  shopButtonText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.background,
  },
});
