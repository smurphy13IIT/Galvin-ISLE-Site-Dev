/**
 * @file
 * Animation classes.
 */

import CounterUp from 'counterup2';
import AnimationBase from '../core/animation-base';
import { inViewport, centerInViewport } from '../utils/in-viewport';

/**
 * The AnimateCount class is a simple way to toggle number counting from zero to
 * the end number in the HTML when the element center is in the viewport.
 */
export class AnimateCount extends AnimationBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   Count animation options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super();

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the animation DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-animation.
     *
     * @property {int} delay
     *   The delay between each number animation, in ms. Defaults to 16, or the
     *   value of the [data-animation-delay] attribute.
     * @property {int} duration
     *   The total animation duration, in ms. Defaults to 1000, or the value of
     *   the [data-animation-duration] attribute.
     *
     * @see https://github.com/bfintal/Counter-Up2
     */
    this.options = {
      ...{
        delay: 16,
        duration: 1000,
      },
      ...options,
    };
  }

  /**
   * Update the animation items. Useful if elements have been added to the DOM
   * and an redraw needs triggering.
   */
  redraw() {
    this.items.forEach(item => {
      if (item.classList.contains(this.readyClass) && centerInViewport(item)) {
        item.classList.remove(this.readyClass);
        CounterUp(item, {
          duration: item.duration,
          delay: item.delay,
        });
      }
    });
  }
}

/**
 * The AnimateSingle class is a simple way to toggle animate classes on single
 * elements when the element center is in the viewport.
 */
export class AnimateSingle extends AnimationBase {
  /**
   * Update the animation items. Useful if elements have been added to the DOM
   * and an redraw needs triggering.
   */
  redraw() {
    this.items.forEach(item => {
      if (item.classList.contains(this.readyClass) && centerInViewport(item)) {
        item.classList.remove(this.readyClass);
      }
    });
  }
}

/**
 * The AnimateSequence class is a simple way to toggle animate classes on group
 * of elements when the container element is in the viewport. The sequence
 * elements are animated in order on a delay.
 */
export class AnimateSequence extends AnimationBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   Sequence animation options. See object definition in the constructor
   *   below.
   */
  constructor(options = {}) {
    super();

    /**
     * Create the options from supplied options and defaults. Options:
     *
     * @property {int} delay
     *   The delay between subsequent animations of each element, in ms.
     *   Defaults to 400, or the value of the [data-animation-delay] attribute.
     * @property {string} itemsSelector
     *   The selector for each of the items to animate in sequence. Defaults to
     *   '.oho-animate', or the value of the [data-animation-items-selector]
     *   attribute.
     */
    this.options = {
      ...{
        delay: 250,
        itemsSelector: '.oho-animate',
      },
      ...options,
    };
  }

  /**
   * Add elements to animate, and add the initial class as well.
   *
   * @param {string} elements
   *   Elements to add.
   * @return {AnimateSingle}
   *   The current object, for method chaining.
   */
  add(elements) {
    // Add the items to the object's items property, after creating options.
    elements.forEach(item => {
      item.classList.add(this.readyClass);
      const sequenceItems = item.querySelectorAll(this.options.itemsSelector);
      sequenceItems.forEach(sequenceItem =>
        sequenceItem.classList.add(this.readyClass),
      );
      this.getOptions(item);
      this.items.push(item);
    });
    return this;
  }

  /**
   * Update the animation sequence items. Useful if elements have been added to
   * the DOM and an redraw needs triggering.
   */
  redraw() {
    this.items.forEach(item => {
      if (item.classList.contains(this.readyClass) && inViewport(item)) {
        item.classList.remove(this.readyClass);
        const sequenceItems = item.querySelectorAll(this.options.itemsSelector);
        sequenceItems.forEach((sequenceItem, sequenceItemIndex) =>
          // Disabling ESLint's warnings about nested callbacks here.
          setTimeout(() => sequenceItem.classList.remove(this.readyClass), // eslint-disable-line
            this.options.delay * sequenceItemIndex,
          ),
        );
      }
    });
  }
}
