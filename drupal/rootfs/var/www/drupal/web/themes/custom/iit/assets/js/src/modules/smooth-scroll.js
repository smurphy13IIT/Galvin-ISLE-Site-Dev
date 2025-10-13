/**
 * @file
 * SmoothScroll class.
 */

import WindowState from '../core/window-state';

/**
 * The SmoothScroll class animates scroll to an element, bounding the animation
 * duration between a min and max value, and easing the animation start and end
 * speeds.
 */
export default class SmoothScroll {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   SmoothScroll options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    /**
     * Create the options from supplied options and defaults. Options:
     *
     * @property {int} offset
     *   The scroll offset from page top after the animation is complete. Useful
     *   for accounting for sticky headers. Defaults to 0.
     * @property {int} minDuration
     *   The minimum duration of the scroll animation, in milliseconds. Defaults
     *   to 250.
     * @property {int} maxDuration
     *   The maximum duration of the scroll animation, in milliseconds. Defaults
     *   to 250.
     */
    this.options = {
      ...{
        offset: 0,
        minDuration: 250,
        maxDuration: 1000,
      },
      ...options,
    };

    this.stopScrollEvents = [
      'mousedown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'keyup',
      'touchmove',
    ];
  }

  /**
   * Scroll to an element.
   *
   * @param {HTMLElement} element
   *   The element to scroll to.
   * @param {int} offsetOverride
   *   A scroll specific offset override.
   */
  scrollTo(element, offsetOverride) {
    this.target = element;

    // Use the offset override, if available.
    const offset =
      offsetOverride !== undefined ? offsetOverride : this.options.offset;

    // Save the target element's position.
    this.targetPosition = this.target.offsetTop - offset;

    // Check that a scroll animation is actually needed.
    if (window.pageYOffset === this.targetPosition) {
      return;
    }

    // Save the initial scroll position.
    this.initialPosition = WindowState.currentScrollPosition;

    // Calculate the scroll distance needed. Scroll distance can never be more
    // than the document height.
    this.scrollDistance = Math.round(
      Math.min(WindowState.maxHeight, this.targetPosition) -
        this.initialPosition,
    );

    // Calculate the duration needed based on the distance. Duration can never
    // be more than the maxDuration or less than the minDuration.
    this.duration = Math.min(
      Math.max(
        this.options.maxDuration *
          (Math.abs(this.scrollDistance) / WindowState.maxHeight),
        this.options.minDuration,
      ),
      this.options.maxDuration,
    );

    // Create a function reference for the stop scroll events listeners, so we
    // have a reference to remove when the animation is finished.
    this.cancelAnimation = () => {
      cancelAnimationFrame(this.animation);
      this.removeStopEvents();
    };

    // Stop the scrolling when any of the stop scroll events happen.
    this.stopScrollEvents.forEach(event =>
      window.addEventListener(event, this.cancelAnimation),
    );

    // Set the animationDuration counter to 0.
    this.animationDuration = 0;

    // Record the initial timestamp.
    this.lastTime = performance.now();

    // Start the scroll.
    this.animation = window.requestAnimationFrame(() => this.animateScroll());
  }

  /**
   * Scroll animation callback. Scrolls the page in discrete chunks using
   * requestAnimationFrame.
   */
  animateScroll() {
    // Get the current timestamp.
    const now = performance.now();

    // Increment the animationDuration with the difference between now and the
    // last update, and normalize over the animation duration.
    this.animationDuration += (now - this.lastTime) / this.duration;

    // When the animationDuration gets incremented to one, we can stop and
    // remove the event listeners added, because the animation has reached it's
    // full duration.
    if (this.animationDuration >= 1) {
      this.setFocus();
      this.removeStopEvents();
      return;
    }

    // Calculate out the discrete position for this animation frame.
    const discretePosition = Math.round(
      // The cosine will always be between -1 and 1, because the animation
      // duration is between 0 and 1. So this expression evaluates from 0 to 1,
      // depending on the cosine, which is no more than pi, based on the return
      // above.
      ((1 - Math.cos(this.animationDuration * Math.PI)) / 2) *
        // The discrete part above multiplied by the scroll distance gives the
        // new discrete position for this animation chunk.
        this.scrollDistance,
    );

    // Animate this chunk, taking into account the inital position.
    window.scrollTo(0, this.initialPosition + discretePosition);

    // Record this chunk's timestamp.
    this.lastTime = now;

    // Run it again.
    this.animation = window.requestAnimationFrame(() => this.animateScroll());
  }

  /**
   * Remove the stop scroll event listeners.
   */
  removeStopEvents() {
    this.stopScrollEvents.forEach(event =>
      window.removeEventListener(event, this.cancelAnimation),
    );
  }

  /**
   * Set the user's focus to the target element.
   */
  setFocus() {
    this.target.focus();
    if (document.activeElement !== this.target) {
      this.target.setAttribute('tabindex', '-1');
      this.target.focus();
    }
  }
}
