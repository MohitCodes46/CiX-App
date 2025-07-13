export const COLORS = {
    // Primary Colors
    primary: '#8B5CF6', // Deep violet
    secondary: '#F59E0B', // Soft gold
    accent: '#E0E7FF', // Lilac
  
    // Background Colors
    background: '#FFFFFF',
    surface: '#FAFAFA',
    card: '#FFFFFF',
  
    // Text Colors
    text: '#1F2937',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
  
    // Status Colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  
    // Luxury Accents
    gold: '#D4AF37',
    silver: '#C0C0C0',
    platinum: '#E5E4E2',
  
    // Gradients
    primaryGradient: ['#8B5CF6', '#A855F7'],
    goldGradient: ['#F59E0B', '#D97706'],
    luxuryGradient: ['#8B5CF6', '#F59E0B'],
  };
  
  export const FONTS = {
    // Typography Scale
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
  
    // Font Weights
    weights: {
      thin: '100' as const,
      light: '300' as const,
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
      black: '900' as const,
    },

    // Font Families
    families: {
      regular: 'Inter-Regular',
      medium: 'Inter-Regular',
      semibold: 'Inter-Bold',
      bold: 'Inter-Bold',
      serif: 'PlayfairDisplay-Regular',
      sans: 'Inter-Regular',
    },
  };
  
  export const SPACING = {
    xs: 4,
    sm: 8,
    base: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  };
  
  export const BORDER_RADIUS = {
    none: 0,
    sm: 4,
    base: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  };
  
  export const SHADOWS = {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
  };
  
  export const ANIMATIONS = {
    duration: {
      fast: 200,
      base: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  };
  
  export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };