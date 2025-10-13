/* eslint-disable no-new */
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.css';
import ComponentBase from '../core/component-base';

export default class Slider extends ComponentBase {
  constructor(options = {}) {
    super('slider');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the accordion DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-accordion.
     *
     * @property {int} sliderSelector
     *   Target DOM element that contains the sides to be used to init
     *
     * @property {int} slider Type
     *   Target DOM element that contains the sides to be used to init
     */

    this.options = {
      ...{
        sliderType: 'offsetCards',
      },
      ...options,
    };
  }

  /**
   * Initialize each Slider.
   */
  init() {
    this.items.forEach(slider => {
      // Get the classes on the slider.
      const classes = [];
      slider.classList.forEach((classString, index) => {
        if (Number.isInteger(index)) {
          classes.push(`.${classString}`);
        }
      });

      // Save the selector of the image grid as a property on each grid.
      slider.selector = classes.join('');

      if (slider.sliderType === 'offsetCards') {
        const glide = new Glide(slider.selector, {
          type: 'carousel',
          startAt: 0,
          perView: 3,
          gap: 20,
          breakpoints: {
            768: {
              perView: 2,
            },
            640: {
              perView: 1,
            },
          },
        });
        glide.mount();
      }
    });
  }
}
