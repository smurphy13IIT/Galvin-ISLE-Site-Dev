/**
 * @file
 * Main Webpack configuration file.
 *
 * Other functionality is contained in webpack.*.config.js files in the
 * webpack-config folder.
 */

// Required NPM modules.
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// Include other config files.
const babelConfig = require('./webpack-config/webpack.babel.config.js');
const cssConfig = require('./webpack-config/webpack.css.config.js');
const esLint = require('./webpack-config/webpack.eslint.config.js');
const modernizrConfig = require('./webpack-config/webpack.modernizr.config.js');
const sourceMapsConfig = require('./webpack-config/webpack.sourceMaps.config.js');

// Base configuration.
// Mode can take either 'development' or 'production'. Development does not
// minify output and does not link source maps.
const baseConfig = {
  mode: 'development',
  entry: './assets/js/src/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'assets/js/dist'),
    sourceMapFilename: '../../maps/[file].map',
  },
  externals: {
    jquery: 'jQuery',
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
    })
  ],
};

// Build the configuration based on environment.
module.exports = function(config) {
  // Development-only config.
  if ('development' === config.mode) {
    // Create source maps.
    config = merge(config, sourceMapsConfig);
  }

  // Run Babel.
  config = merge(config, babelConfig);

  // Run ESLint.
  config = merge(config, esLint);

  // Bundle CSS.
  config = merge(config, cssConfig);

  // Add Modernizr.
  config = merge(config, modernizrConfig);

  return config;
}(baseConfig);
