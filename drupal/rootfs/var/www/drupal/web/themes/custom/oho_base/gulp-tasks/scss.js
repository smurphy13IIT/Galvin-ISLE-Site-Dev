/**
 * @file
 * SCSS configuration and task for Gulp.
 */
'use strict'

// Load dependencies.
const autoPrefixer = require('gulp-autoprefixer');
const beeper = require('beeper');
const chalk = require('chalk');
const fancyLog = require('fancy-log');
const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const gulpSassGlob = require('gulp-sass-glob');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sourceMaps = require('gulp-sourcemaps');
const stylelint = require('stylelint');

// SCSS config.
let config = {
  // SCSS entry files.
  scssEntry: 'assets/scss/*.scss',
  // SCSS output style.
  scssOutput: 'expanded',
  // Additional SCSS includes.
  scssIncludes: [
    'node_modules/@fortawesome/fontawesome-pro/scss',
    'node_modules/foundation-sites/scss',
  ],
  // Complied CSS destination path.
  cssPath: 'assets/css',
  // Source maps destination path, relative to the compiled CSS path.
  mapPath: '../maps',
  // Stylelint config file.
  stylelintConfig: 'assets/.stylelintrc',
};

/**
 * Run SCSS compilation.
 *
 * @param {doneCallback} done
 *   Gulp default task complete callback.
 * @param {Object} baseConfig
 *   Base configuration from gulpfile.js.
 */
module.exports = (done, baseConfig) => {
  config = {...baseConfig, ...config};
  // Run stylelint on the source paths. We need to do this, rather than use
  // gulp-stylelint, because gulp-stylelint only runs on the initial
  // entry *.scss files, so we never lint anything loaded with @import.
  return stylelint
    .lint({
      configFile: config.stylelintConfig,
      files: config.scssPath,
      formatter: 'string',
    })
    .then((data) => {
      // If we have a issues in SCSS, print the output and a message then stop.
      if (data.errored) {
        fancyLog(data.output);
        fancyLog(chalk.cyan('gulp-scss') + ': [' + chalk.blue('SCSS') + '] ' + chalk.red('Linting failed; SCSS did not compile!'));
        done();
        return;
      }

      // Compile the SCSS.
      return gulp
        .src(config.scssEntry)
        .pipe(plumber({
          errorHandler(err) {
            beeper();
            console.log(err);
            this.emit('end');
          }
        }))
        .pipe(sourceMaps.init())
        .pipe(gulpSassGlob())
        .pipe(gulpSass({
          errLogToConsole: true,
          includePaths: config.scssIncludes,
          outputStyle: config.scssOutput
        }))
        .pipe(autoPrefixer())
        .pipe(sourceMaps.write(config.mapPath))
        .pipe(gulp.dest(config.sourceRoot + config.cssPath))
        .pipe(notify({
          title: 'SCSS',
          message: 'Task complete!',
          onLast: true
        }));
    });
}
