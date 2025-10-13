/**
 * @file
 * JavaScript to control the image grid.
 */

import 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import Shuffle from 'shufflejs';

/**
 * Initialize the image grid.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - breakpoint: The width at which the grid is initialized. Below this the
 *     grid is a slider. Set to 0 to never use a slider. Defaults to 640.
 *   - shuffle: Any options that can be passed to Shuffle. Defaults to values
 *     needed to for a basic initialization.
 *   - shuffle: Any options that can be passed to Slick. Defaults to values
 *     needed to for a basic initialization.
 */
$.fn.ohoImageGrid = function ohoImageGrid(args = {}) {
  // If the calling element is empty, just stop.
  if (this.length === 0) {
    return;
  }

  // Alias the initialized element so we can grab it later.
  const container = this;

  // The window.
  const $window = $(window);

  // The last recorded size of the window.
  let lastSize = null;

  // Variable to hold the current grid, either as a shuffle or slick object.
  let imageGrid = {};

  // The default options.
  const defaults = {
    breakpoint: 640,
    shuffle: {
      itemSelector: '.image-grid-item',
    },
    slick: {
      adaptiveHeight: true,
      arrows: true,
      dots: false,
      draggable: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 500,
      variableWidth: false,
    },
  };

  // Create options from supplied and defaults.
  const options = $.fn.extend({}, defaults, args);

  // Run on load.
  if ($window.width() < options.breakpoint) {
    imageGrid = $(container).slick(options.slick);
  } else {
    imageGrid = new Shuffle(container, options.shuffle);
  }

  /**
   * Initialization logic. Used as a callback for requestAnimationFrame().
   *
   * Starts and stops Shuffle or Slick, depending on the breakpoint.
   */
  function createShuffleOrSlick() {
    // Current width.
    const currentWidth = $window.width();

    // Check for changes, and stop if the window size has not changed.
    if (lastSize === currentWidth) {
      window.requestAnimationFrame(createShuffleOrSlick);
      return;
    }

    // Below breakpoint; slick.
    if (currentWidth < options.breakpoint) {
      // If shuffle's destroy method is available we have a shuffle to destroy
      // and a slick slider to initialize.
      if (typeof imageGrid.destroy === 'function') {
        imageGrid.destroy();
        imageGrid = $(container).slick(options.slick);
      }
    }
    // Above breakpoint; shuffle,
    // If the slick method is present, we have a slider to destroy and
    // shuffle to initialize.
    else if (typeof imageGrid.slick === 'function') {
      imageGrid.slick('unslick');
      imageGrid = new Shuffle(container, options.shuffle);
    }

    // Record the current size.
    lastSize = currentWidth;

    // Do it again!
    window.requestAnimationFrame(createShuffleOrSlick);
  }

  // Recalculate on resize.
  $window.on('resize', createShuffleOrSlick);
};
