/**
 * @file
 * AnimationBase class.
 */

import ComponentBase from './component-base';
import WindowState from './window-state';

/**
 * The AnimationBase class is a simple way to toggle animate classes on single
 * elements when the element center is in the viewport.
 */
export default class AnimationBase extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   */
  constructor() {
    super('animation');
    /**
     * @property {string} readyClass
     *   The class to add to animatable elements when they are ready to be animated.
     *   This addition of this class sets the initial animate state on an element,
     *   and it's removal triggers the animation.
     */
    this.readyClass = 'oho-animate--ready';
  }

  /**
   * Add elements to animate, setup options, and add the initial class as well.
   *
   * @param {string} elements
   *   Elements to add.
   * @return {AnimateSingle}
   *   The current object, for method chaining.
   */
  add(elements) {
    elements.forEach(item => {
      item.classList.add(this.readyClass);
      this.getOptions(item);
      this.items.push(item);
    });
    return this;
  }

  /**
   * Update each animation item on resize.
   */
  resize() {
    WindowState.on('all', () => this.redraw());
  }

  /**
   * Behaviors to run on update. This method should be overridden.
   *
   * @return {AnimationBase}
   *   Returns the current object.
   */
  redraw() {
    return this;
  }
}
