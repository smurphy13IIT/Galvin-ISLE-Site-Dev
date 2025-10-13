/**
 * @file
 * Webpack configuration file for Babel.
 */

// Required NPM modules.

// Create Babel's configuration.
module.exports = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
};
