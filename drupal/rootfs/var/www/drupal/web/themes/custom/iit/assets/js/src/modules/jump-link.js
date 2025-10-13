/**
 * @file
 * JumpLink class.
 */

import ComponentBase from '../core/component-base';
import SmoothScroll from './smooth-scroll';

/**
 * The JumpLink class allows for easy creation of smooth scrolling jump links,
 * piggy-backing on the native HTML anchor link behavior.
 */
export default class JumpLink extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   JumpLink options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('jump-link');

    /**
     * Create the options from supplied options and defaults. These options are
     * passed directly to SmoothScroll. See the smooth-scroll.js constructor for
     * detailed information.
     */
    this.options = {
      ...{
        offset: 0,
        minDuration: 250,
        maxDuration: 1000,
      },
      ...options,
    };

    this.smoothScroll = new SmoothScroll(this.options);
  }

  /**
   * Add the scroll behaviors on each jump link.
   */
  init() {
    this.items.forEach(link => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      link.addEventListener('click', () => this.smoothScroll.scrollTo(target));
    });
  }
}
