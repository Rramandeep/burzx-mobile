const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

// Merge the default config
const defaultConfig = getDefaultConfig(__dirname);

// Final Metro config after merging
const config = mergeConfig(defaultConfig, {
  // You can add custom config here later if needed
});

module.exports = wrapWithReanimatedMetroConfig(config);
