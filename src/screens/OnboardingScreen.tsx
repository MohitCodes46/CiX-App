import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Luxury redefined.',
    subtitle: 'Discover exclusive designs that speak to your unique style and sophistication.',
    image: '👗',
  },
  {
    id: 2,
    title: 'Exclusive designs for her.',
    subtitle: 'Curated collections that celebrate femininity, confidence, and timeless elegance.',
    image: '💎',
  },
  {
    id: 3,
    title: 'Your style. Our statement.',
    subtitle: 'Where every piece tells a story of luxury, grace, and unparalleled craftsmanship.',
    image: '✨',
  },
];

interface OnboardingScreenProps {
  navigation: any;
}

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    // Animate logo on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      // Force a re-render by calling a function that updates the state
      if (navigation.getParent()) {
        navigation.getParent()?.setParams({ refresh: Date.now() });
      }
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    // Force a re-render by calling a function that updates the state
    if (navigation.getParent()) {
      navigation.getParent()?.setParams({ refresh: Date.now() });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.accent]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.logo}>CiX</Text>
          <Text style={styles.tagline}>Where elegance becomes identity.</Text>
        </Animated.View>

        {/* Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {onboardingData.map((item, index) => (
            <View key={item.id} style={styles.slide}>
              <View style={styles.imageContainer}>
                <Text style={styles.emoji}>{item.image}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Pagination */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  skipButton: {
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING['4xl'],
    marginBottom: SPACING['3xl'],
  },
  logo: {
    fontSize: FONTS.sizes['5xl'],
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.light,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 60,
  },
  title: {
    fontSize: FONTS.sizes['3xl'],
    fontFamily: FONTS.families.serif,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.normal,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.textLight,
    marginHorizontal: SPACING.xs,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  nextButton: {
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
