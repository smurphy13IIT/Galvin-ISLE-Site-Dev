/**
 * @file
 * Pa11y configuration and task for Gulp.
 */
'use strict'

// Load dependencies.
const fancyLog = require('fancy-log');
const chalk = require('chalk');
const pa11y = require('pa11y');

// Browsersync config.
let config = {
  // Base URL path.
  baseURL: 'http://admin:ohosite1100@oho-university.ohodev.com',
  // URLs that will be run though automated tests
  urls: [
    {'url': '/'},
    {'url': '/landing-page'},
  ],
};

/**
 *  Run accessibility tests.
 *
 * @param {callback} callback
 *   Gulp default task complete callback.
 * @param {Object} baseConfig
 *   Base configuration from gulpfile.js.
 */
module.exports = (callback, baseConfig) => {
  config = {...baseConfig, ...config};
  doSynchronousLoop(config.urls, processAccessibility, callback);
}

/**
 * Process data in an array synchronously, moving onto the n+1 item only after
 * the nth item callback.
 *
 * @param {Array} urls
 *   An array of URLs to check.
 * @param {callback} processData
 *   The process data callback.
 * @param {callback} done
 *   Gulp default task complete callback.
 */
function doSynchronousLoop(urls, processData, done) {
  if (urls.length > 0) {
    let loop = (urls, i, processData, done) => {
      processData(urls[i], i, () => {
        if (++i < urls.length) {
          loop(urls, i, processData, done);
        } else {
          done();
        }
      });
    };
    loop(urls, 0, processData, done);
  }
  else {
    done();
  }
}

/**
 * Run pa11y accessibility tests on each template.
 *
 * @param {Object} element
 *   The element to test.
 * @param {int} i
 *   The iteration we are on.
 * @param {callback} callback
 *   The callback to continue testing.
 */
function processAccessibility(element, i, callback) {
  const testUrl = config.baseURL + element.url;
  let cliReporter = require('../node_modules/pa11y-reporter-cli/lib/reporter.js');
  const options = {
    log: cliReporter,
    ignore: [
      'notice',
      'warning',
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.Fail', // Color contrast.
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail', // Color contrast.
    ]
  };

  fancyLog('-> Checking Accessibility for URL: ' + chalk.cyan(testUrl));
  pa11y(testUrl, options).then((results) => {
    cliReporter.results(results, testUrl);
    callback();
  });
}
