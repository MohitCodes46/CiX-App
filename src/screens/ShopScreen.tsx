import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const categories = [
  { id: 1, name: 'Clothing', icon: 'shirt-outline' },
  { id: 2, name: 'Watches', icon: 'time-outline' },
  { id: 3, name: 'Accessories', icon: 'diamond-outline' },
];

const clothingSubcategories = [
  'Dresses', 'Blazers', 'Skirts', 'Co-ords', 'Tops'
];

const watchesSubcategories = [
  'Modern', 'Classic', 'Designer'
];

const accessoriesSubcategories = [
  'Bags', 'Sunglasses', 'Jewelry'
];

export default function ShopScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('Clothing');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getSubcategories = () => {
    switch (selectedCategory) {
      case 'Clothing':
        return clothingSubcategories;
      case 'Watches':
        return watchesSubcategories;
      case 'Accessories':
        return accessoriesSubcategories;
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="filter-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons 
              name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'} 
              size={24} 
              color={COLORS.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={20} 
                  color={selectedCategory === category.name ? COLORS.background : COLORS.text} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.name && styles.categoryTextActive,
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Subcategories */}
        <View style={styles.subcategoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getSubcategories().map((subcategory, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subcategoryButton}
              >
                <Text style={styles.subcategoryText}>{subcategory}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          <View style={styles.productsGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <TouchableOpacity 
                key={item} 
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetails', { productId: item.toString() })}
              >
                <View style={styles.productImagePlaceholder}>
                  <Ionicons name="shirt-outline" size={32} color={COLORS.textLight} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Luxury Item {item}</Text>
                  <Text style={styles.productPrice}>$299</Text>
                  <TouchableOpacity style={styles.wishlistButton}>
                    <Ionicons name="heart-outline" size={16} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  categoryTextActive: {
    color: COLORS.background,
  },
  subcategoriesContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  subcategoryButton: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    ...SHADOWS.sm,
  },
  subcategoryText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
  },
  productsContainer: {
    paddingHorizontal: SPACING.lg,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - SPACING.lg * 3) / 2,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  productInfo: {
    position: 'relative',
  },
  productName: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  productPrice: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  wishlistButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
});
