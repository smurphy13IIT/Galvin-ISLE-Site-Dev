/**
 * @file
 * Webpack configuration and task for Gulp.
 */
'use strict'

// Load dependencies.
const gulp = require('gulp');
const notify = require('gulp-notify');
const webpackCompiler = require('webpack');
const webpackStream = require('webpack-stream');

// Webpack config.
let config = {
  // Webpack entry file.
  webpackEntry: 'assets/js/src/app.js',
  // Webpack output path.
  webpackPath: 'assets/js/dist',
};

/**
 * Run Webpack.
 *
 * @param {Object} baseConfig
 *   Base configuration from gulpfile.js.
 */
module.exports = (baseConfig) => {
  config = {...baseConfig, ...config};
  return gulp
    .src(config.webpackEntry)
    .pipe(webpackStream(require('../webpack.config.js'), webpackCompiler))
    .pipe(gulp.dest(config.sourceRoot + config.webpackPath))
    .pipe(notify({
      title: 'Webpack',
      message: 'Task complete!',
      onLast: true
    }))
}
