/**
 * @file
 * ImageGrid class.
 */

import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.css';
import '@fancyapps/fancybox';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';
import Shuffle from 'shufflejs';
import ComponentBase from '../core/component-base';
import WindowState from '../core/window-state';

/**
 * The ImageGrid class provides a way to make a masonry image grid which
 * transitions to a slider on mobile.
 */
export default class ImageGrid extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   ImageGrid options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('image-grid');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the image grid DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-image-grid.
     *
     * @property {int} breakpoint
     *   The width at which the grid is initialized. Below this the
     *   grid is a slider. Set to 0 to never use a slider. Defaults to 640, or
     *   the value of the [data-image-grid-breakpoint] attribute.
     * @property {Object} glide
     *   Glide options. This key is passed directly to Glide on initialization.
     *   Defaults to {}.
     * @property {Object} shuffle
     *   Shuffle options. This key is passed directly to Shuffle on
     *   initialization. Defaults to an itemSelector of '.image-grid-item'.
     *
     * @see https://glidejs.com/docs/options/
     * @see https://vestride.github.io/Shuffle/#options
     */
    this.options = {
      ...{
        breakpoint: 640,
        glide: {},
        shuffle: {
          itemSelector: '.image-grid-item',
        },
      },
      ...options,
    };
  }

  /**
   * Run the initialization behaviors.
   */
  init() {
    this.items.forEach(imageGrid => {
      // Get the classes on the image grid.
      const classes = [];
      imageGrid.classList.forEach((classString, index) => {
        if (Number.isInteger(index)) {
          classes.push(`.${classString}`);
        }
      });
      // Save the selector of the image grid as a property on each grid.
      imageGrid.selector = classes.join('');
    });
  }

  /**
   * Load the grid or slider, depending on current window size.
   */
  resize() {
    WindowState.on('resize', () => {
      this.items.forEach(imageGrid => {
        if (WindowState.width < imageGrid.breakpoint) {
          ImageGrid.slider(imageGrid);
        } else {
          ImageGrid.grid(imageGrid);
        }
      });
    });
  }

  /**
   * Create the image grid while disabling the slider, if needed.
   *
   * @param {HTMLElement} imageGrid
   *   The element tq enable the image grid on.
   */
  static grid(imageGrid) {
    if (!imageGrid.hasOwnProperty('grid')) {
      if (imageGrid.hasOwnProperty('slider')) {
        imageGrid.slider.destroy();
        delete imageGrid.slider;
      }
      const gridElement = imageGrid.querySelector('.glide__slides');
      imageGrid.grid = new Shuffle(gridElement, imageGrid.shuffle);
    }
  }

  /**
   * Create the slider while disabling the image grid, if needed.
   *
   * @param {HTMLElement} imageGrid
   *   The element tq enable the image grid on.
   */
  static slider(imageGrid) {
    if (!imageGrid.hasOwnProperty('slider')) {
      if (imageGrid.hasOwnProperty('grid')) {
        imageGrid.grid.destroy();
        delete imageGrid.grid;
      }
      imageGrid.slider = new Glide(imageGrid.selector, imageGrid.glide).mount();

      /// ---- This solution is to remedy a weird issue where images slide twice on iOS
      $(".glide-controls .next").on("click", function() {
        imageGrid.slider.go('>');
      });
      $(".glide-controls .prev").on("click", function() {
        imageGrid.slider.go('<');
      });

    }
  }
}
