/**
 * @file
 * Webpack configuration file for Modernizr.
 *
 * Per-project Modernizr configucation goes in the .modernizrrc.json file. JSON
 * can be obtained by selecting the command line build option when creating the
 * Modernizr bundle.
 */

// Required NPM modules.
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

// Modernizr configuration defaults.
const ModernizrDefaults = {
  filename: 'modernizr',
  minify: true,
  options: [
    'setClasses',
  ],
};

// Custom configuration.
const ModernizrConfig = require('../assets/.modernizrrc.json');

// Create the Modernizr configuration.
module.exports = {
  plugins: [
    new ModernizrWebpackPlugin(Object.assign(ModernizrDefaults, ModernizrConfig)),
  ],
};
