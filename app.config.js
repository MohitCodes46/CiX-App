import 'dotenv/config';

export default {
  expo: {
    name: process.env.APP_NAME || 'CiX Luxury',
    slug: 'cix-luxury-app',
    version: process.env.APP_VERSION || '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.cixluxury.app',
      buildNumber: '1.0.0',
      infoPlist: {
        NSCameraUsageDescription: 'This app uses the camera for virtual try-on and profile photos.',
        NSPhotoLibraryUsageDescription: 'This app accesses your photo library for profile pictures and product images.',
        NSLocationWhenInUseUsageDescription: 'This app uses location for delivery address verification.',
        CFBundleURLTypes: [
          {
            CFBundleURLName: 'auth',
            CFBundleURLSchemes: ['cix']
          }
        ]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: 'com.cixluxury.app',
      versionCode: 1,
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION'
      ],
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'cix'
            }
          ],
          category: ['BROWSABLE', 'DEFAULT']
        }
      ]
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro'
    },
    plugins: [
      'expo-camera',
      'expo-image-picker',
      'expo-notifications',
              [
          'expo-build-properties',
          {
            ios: {
              deploymentTarget: '15.1'
            },
            android: {
              compileSdkVersion: 33,
              targetSdkVersion: 33,
              buildToolsVersion: '33.0.0'
            }
          }
        ]
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://zuisfhonhljsdaoxodac.supabase.co',
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1aXNmaG9uaGxqc2Rhb3hvZGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzM1MjUsImV4cCI6MjA2NzkwOTUyNX0.KKvz6Na3wF8kYDtUS1VA0uPZlrxbg3YWR3P0NdrxPaI',
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key',
      eas: {
        projectId: "02bf552a-305d-4712-9fd7-56094f729034",
      }
    },
    updates: {
      url: 'https://u.expo.dev/02bf552a-305d-4712-9fd7-56094f729034'
    },
    runtimeVersion: {
      policy: 'appVersion'
    },
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'your-sentry-org',
            project: 'cix-luxury-app'
          }
        }
      ]
    }
  }
};
