/**
 * @file
 * Gulpfile.
 *
 * Shared configuration and tasks are defined here. Functions run through tasks
 * are split out in the gulp-tasks folder and required through functions. We
 * must wrap the requires in a function so that the task definitions are hoisted
 * before the task attempts to run.
 */
'use strict'

// Load dependencies.
const gulp = require('gulp');

// Common config for all Gulp tasks.
const config = {
  // Source compliation path.
  sourceRoot: '',
  // SCSS files path.
  scssPath: 'assets/scss/**/*.scss',
  // JavaScript file paths.
  jsPath: 'assets/js/src/**/*.js',
};

// Gulp Tasks.
gulp.task('default', gulp.series(gulp.parallel(scss, webpack), gulp.parallel(watchJavaScript, watchScss)));
gulp.task('a11y', gulp.series(accessibility));
gulp.task('favicon', gulp.series(faviconGenerate, faviconAddMarkup));
gulp.task('favicon-check', gulp.series(faviconCheckUpdates));
gulp.task('scss', gulp.series(scss, watchScss));
gulp.task('webpack', gulp.series(webpack, watchJavaScript));

/**
 * Add the accessibility function from the sub-task file.
 */
function accessibility(callback) {
  return require('./gulp-tasks/pa11y.js')(callback, config);
}

/**
 * Add the faviconAddMarkup function from the sub-task file.
 */
function faviconAddMarkup(config) {
  return require('./gulp-tasks/favicon.js').faviconAddMarkup(config);
}

/**
 * Add the faviconCheckUpdates function from the sub-task file.
 */
function faviconCheckUpdates(done) {
  return require('./gulp-tasks/favicon.js').faviconCheckUpdates(done, config);
}

/**
 * Add the faviconGenerate function from the sub-task file.
 */
function faviconGenerate(done) {
  return require('./gulp-tasks/favicon.js').faviconGenerate(done, config);
}

/**
 * Add the scss function from the sub-task file.
 */
function scss(done) {
  return require('./gulp-tasks/scss.js')(done, config);
}

/**
 * Add the webpack function from the sub-task file.
 */
function webpack() {
  return require('./gulp-tasks/webpack.js')(config);
}

/**
 * Watch for SCSS changes.
 */
function watchScss() {
  gulp.watch(config.scssPath, {usePolling: true}, gulp.series(scss));
}

/**
 * Watch for JS changes.
 */
function watchJavaScript() {
  gulp.watch(config.jsPath, {usePolling: true}, gulp.series(webpack));
}
