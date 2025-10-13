/**
 * @file
 * Webpack configuration file for CSS bundling.
 */

// Required NPM modules.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Create the CSS bundling configuration.
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'app',
          test: /\.css$/,
          enforce: true,
        },
      },
    },
  },
};
