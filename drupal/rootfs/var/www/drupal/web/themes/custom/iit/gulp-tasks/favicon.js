/**
 * @file
 * Favicon configuration and tasks for Gulp.
 */
'use strict'

// Load dependencies.
const fs = require('fs');
const gulp = require('gulp');
const gulpFavicon = require('gulp-real-favicon');

// Favicon config.
let config = {
  // The favicon entry file name.
  faviconEntry: 'source.svg',
  // The favicon path name.
  faviconPath: 'assets/favicons/',
  // The favicon output file name.
  faviconOutputFile: 'faviconData.json',
  // The absolute URL of the favicon directory.
  faviconURL: '/assets/favicons/',
  // Favicon settings used during generation.
  faviconSettings: {
    scalingAlgorithm: 'Mitchell',
    errorOnImageTooSmall: false,
    readmeFile: false,
    htmlCodeFile: false,
    usePathAsIs: false
  },
  // Favicon design attributes used during generation.
  faviconDesign: {
    ios: {
      pictureAspect: 'noChange',
      assets: {
        ios6AndPriorIcons: false,
        ios7AndLaterIcons: false,
        precomposedIcons: false,
        declareOnlyDefaultIcon: true
      }
    },
    desktopBrowser: {},
    windows: {
      pictureAspect: 'noChange',
      backgroundColor: '#da532c',
      onConflict: 'override',
      assets: {
        windows80Ie10Tile: false,
        windows10Ie11EdgeTiles: {
          small: false,
          medium: true,
          big: false,
          rectangle: false
        }
      }
    },
    androidChrome: {
      pictureAspect: 'noChange',
      themeColor: '#ffffff',
      manifest: {
        display: 'standalone',
        orientation: 'notSet',
        onConflict: 'override',
        declared: true
      },
      assets: {
        legacyIcon: false,
        lowResolutionIcons: false
      }
    }
  }
};

module.exports = {
  /**
   * Add favicon markup to the html.html.twig layout.
   *
   * @param {Object} baseConfig
   *   Base configuration from gulpfile.js.
   */
  faviconAddMarkup: (baseConfig) => {
    config = {...baseConfig, ...config};
    const markup = JSON
      .parse(fs.readFileSync(config.faviconPath + config.faviconOutputFile))
      .favicon
      .html_code
      // Split on newlines and add padding and newlines back in. The
      // injectFaviconMarkups() method can take an array. We are doing this
      // because the method ruins indentation and I can't abide by that in the
      // root layout template.
      .split(/\n/)
      .map(x => "  " + x + "\n  ");

    return gulp
      .src([
        'templates/system/html.html.twig',
      ])
      .pipe(gulpFavicon.injectFaviconMarkups(markup))
      .pipe(gulp.dest('templates/system'))
      .pipe(notify({
        title: 'Favicons',
        message: 'Task complete! But this script does not deal nicely with Drupal\'s markup in html.html.twig, so go there and fix it!',
        onLast: true
      }));
  },

  /**
   * Check for favicon updates.
   *
   * @param {callback} done
   *   Gulp default task complete callback.
   * @param {Object} baseConfig
   *   Base configuration from gulpfile.js.
   */
  faviconCheckUpdates: (done, baseConfig) => {
    config = {...baseConfig, ...config};
    const currentVersion = JSON
      .parse(fs.readFileSync(config.faviconPath + config.faviconOutputFile))
      .version;
    gulpFavicon
      .checkForUpdates(currentVersion, (err) => {
        if (err) {
          throw err;
        } else {
          done();
        }
      });
  },

  /**
   * Generate favicons using the RealFaviconGenerator service.
   *
   * @param {callback} done
   *   Gulp default task complete callback.
   * @param {Object} baseConfig
   *   Base configuration from gulpfile.js.
   */
  faviconGenerate: (done, baseConfig) => {
    config = {...baseConfig, ...config};
    return gulpFavicon
      .generateFavicon({
        masterPicture: config.faviconPath + config.faviconEntry,
        dest: config.faviconPath,
        iconsPath: config.faviconURL,
        design: config.faviconDesign,
        settings: config.faviconSettings,
        markupFile: config.faviconPath + config.faviconOutputFile
      },
      done);
  }
};
