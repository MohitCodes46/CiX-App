import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';


const { width } = Dimensions.get('window');

const featuredCollections = [
  {
    id: 1,
    title: 'Luxe Summer Edit',
    subtitle: 'Elegant pieces for warm days',
    image: null, // Removed external image to prevent network requests
  },
  {
    id: 2,
    title: 'Timeless Watches',
    subtitle: 'Classic sophistication',
    image: null, // Removed external image to prevent network requests
  },
  {
    id: 3,
    title: 'Occasion Wear',
    subtitle: 'Dresses that make memories',
    image: null, // Removed external image to prevent network requests
  },
];

const quickAccessCategories = [
  { id: 1, title: 'Clothing', icon: 'shirt-outline', color: COLORS.primary },
  { id: 2, title: 'Watches', icon: 'time-outline', color: COLORS.secondary },
  { id: 3, title: 'Accessories', icon: 'diamond-outline', color: COLORS.accent },
];

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.name}>Elegance</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={COLORS.luxuryGradient}
          style={styles.banner}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>New Arrivals</Text>
            <Text style={styles.bannerSubtitle}>Discover our latest collection</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickAccessGrid}>
          {quickAccessCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Shop', { category: category.title })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={24} color={COLORS.background} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Collections */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Collections</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredCollections.map((collection) => (
            <TouchableOpacity
              key={collection.id}
              style={styles.collectionCard}
              onPress={() => navigation.navigate('Shop', { collection: collection.title })}
            >
              {collection.image ? (
                <Image source={{ uri: collection.image }} style={styles.collectionImage} />
              ) : (
                <View style={[styles.collectionImage, styles.placeholderImage]}>
                  <Ionicons name="image-outline" size={32} color={COLORS.textLight} />
                </View>
              )}
              <View style={styles.collectionOverlay}>
                <Text style={styles.collectionTitle}>{collection.title}</Text>
                <Text style={styles.collectionSubtitle}>{collection.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Shop New Arrivals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop New Arrivals</Text>
        <View style={styles.newArrivalsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity key={item} style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="shirt-outline" size={32} color={COLORS.textLight} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>Elegant Dress</Text>
                <Text style={styles.productPrice}>$299</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
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
  greeting: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  name: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.serif,
    fontWeight: '700',
    color: COLORS.text,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  banner: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: FONTS.sizes['2xl'],
    fontFamily: FONTS.families.serif,
    fontWeight: '700',
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  bannerSubtitle: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: '400',
    color: COLORS.background,
    opacity: 0.9,
    marginBottom: SPACING.lg,
  },
  bannerButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  bannerButtonText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.serif,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: '500',
    color: COLORS.primary,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.xs,
    ...SHADOWS.sm,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryTitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  collectionCard: {
    width: width * 0.7,
    height: 200,
    marginRight: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.base,
  },
  collectionImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.lg,
  },
  placeholderImage: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
  },
  collectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.serif,
    fontWeight: '700',
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  collectionSubtitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: '400',
    color: COLORS.background,
    opacity: 0.9,
  },
  newArrivalsGrid: {
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
    alignItems: 'center',
  },
  productName: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  productPrice: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.serif,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
