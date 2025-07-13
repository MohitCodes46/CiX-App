import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface ProductDetailsScreenProps {
  navigation: any;
  route: any;
}

export default function ProductDetailsScreen({ navigation, route }: ProductDetailsScreenProps) {
  const { productId } = route.params;
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock product data
  const product = {
    id: productId,
    name: 'Elegant Evening Dress',
    price: 599,
    originalPrice: 799,
    description: 'A stunning evening dress crafted from the finest silk, featuring an elegant design that celebrates femininity and sophistication. Perfect for special occasions and formal events.',
    images: [
      null, // Removed external image to prevent network requests
      null, // Removed external image to prevent network requests
      null, // Removed external image to prevent network requests
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Burgundy'],
    material: '100% Silk',
    careInstructions: 'Dry clean only. Store in a cool, dry place.',
    stylingTips: 'Pair with statement jewelry and elegant heels for a complete look.',
    inStock: true,
    rating: 4.8,
    reviews: 124,
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert('Error', 'Please select a size');
      return;
    }
    if (!selectedColor) {
      Alert.alert('Error', 'Please select a color');
      return;
    }
    Alert.alert('Success', 'Added to cart!');
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    Alert.alert('Success', isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleImagePress = (index: number) => {
    setCurrentImageIndex(index);
    setImageModalVisible(true);
  };

  const imageUrls = product.images.filter(url => url !== null).map(url => ({ url: url! }));

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
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.mainImage}
            onPress={() => handleImagePress(0)}
          >
            {product.images[0] ? (
            <Image source={{ uri: product.images[0] }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholderImage]}>
                <Ionicons name="image-outline" size={48} color={COLORS.textLight} />
              </View>
            )}
            <View style={styles.zoomOverlay}>
              <Ionicons name="expand-outline" size={24} color={COLORS.background} />
            </View>
          </TouchableOpacity>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailContainer}>
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.thumbnail}
                onPress={() => handleImagePress(index)}
              >
                {image ? (
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
                ) : (
                  <View style={[styles.thumbnailImage, styles.placeholderImage]}>
                    <Ionicons name="image-outline" size={16} color={COLORS.textLight} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={COLORS.secondary} />
              <Text style={styles.rating}>{product.rating}</Text>
              <Text style={styles.reviews}>({product.reviews} reviews)</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Size Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Size</Text>
            <View style={styles.optionsContainer}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionButton,
                    selectedSize === size && styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedSize === size && styles.optionTextActive,
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.optionsContainer}>
              {product.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.optionButton,
                    selectedColor === color && styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedColor === color && styles.optionTextActive,
                  ]}>
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Material:</Text>
              <Text style={styles.detailValue}>{product.material}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Care Instructions:</Text>
              <Text style={styles.detailValue}>{product.careInstructions}</Text>
            </View>
          </View>

          {/* Styling Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Styling Tips</Text>
            <Text style={styles.stylingTips}>{product.stylingTips}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={handleAddToWishlist}
        >
          <Ionicons 
            name={isWishlisted ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isWishlisted ? COLORS.primary : COLORS.text} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
      <Modal visible={imageModalVisible} transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={24} color={COLORS.background} />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={imageUrls}
            index={currentImageIndex}
            onSwipeDown={() => setImageModalVisible(false)}
            enableSwipeDown
            backgroundColor="rgba(0,0,0,0.9)"
          />
        </View>
      </Modal>
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
  imageContainer: {
    marginBottom: SPACING.xl,
  },
  mainImage: {
    width: width,
    height: width,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  zoomOverlay: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailContainer: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.base,
    marginRight: SPACING.sm,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  price: {
    fontSize: FONTS.sizes['2xl'],
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  originalPrice: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  rating: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  reviews: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  productName: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  optionTextActive: {
    color: COLORS.background,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    width: 120,
  },
  detailValue: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    flex: 1,
  },
  stylingTips: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  wishlistButton: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  addToCartButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
