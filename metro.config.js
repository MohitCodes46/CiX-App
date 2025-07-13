const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add polyfills for Hermes engine
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add polyfills for URL and other web APIs
config.resolver.alias = {
  ...config.resolver.alias,
  'url': 'react-native-url-polyfill',
};

module.exports = config; 