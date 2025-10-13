/**
 * @file
 * SlidingToggle class.
 */

import ComponentBase from '../core/component-base';

/**
 * The SlidingToggle class provides an easy way to add a sliding animation to
 * clicked or hovered buttons using CSS custom properties. In order for this to
 * work correctly, the default size for buttons must be set to 100px (or
 * equivalent) in CSS, as the custom property scales the animation off this
 * value.
 */
export default class SlidingToggle extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   SlidingToggle options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('slide-toggle');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the slide toggle DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with
     * data-slide-toggle.
     *
     * @property {string} hover
     *   Whether or not to add hover behavior to this sliding toggle. Either
     *   'true' or 'false'. Defaults to 'true', or the value of the
     *   [data-slide-toggle-hover] attribute.
     * @property {string} buttonSelector
     *   The selector of the slide toggle button elements. Defaults to
     *   '.slide-toggle__button', or the value of the
     *   [data-slide-toggle-button-selector] attribute.
     */
    this.options = {
      ...{
        hover: 'false',
        buttonSelector: '.slide-toggle__button',
      },
      ...options,
    };
  }

  /**
   * Initialize each sliding toggle.
   */
  init() {
    // Set the initial state on window load, not DOM ready, because we may need
    // fonts to load to calculate the correct initial button widths.
    window.addEventListener('load', () => {
      this.items.forEach(slidingToggle =>
        SlidingToggle.update(slidingToggle.children[0].children[0]),
      );
    });

    // Add the behaviors.
    this.items.forEach(slidingToggle => {
      const buttons = slidingToggle.querySelectorAll(
        slidingToggle.buttonSelector,
      );
      buttons.forEach(button => {
        // Add click behaviors.
        SlidingToggle.buttonClick(button, buttons);

        // Add hover behaviors, if the option is set.
        if (slidingToggle.hover === 'true') {
          SlidingToggle.buttonHover(button, slidingToggle);
        }
      });
    });
  }

  /**
   * Add the click behaviors to a button element.
   *
   * @param {HTMLElement} button
   *   The button to add click behaviors to.
   * @param {NodeList} siblings
   *   The siblings of the button behaviors are being added to.
   */
  static buttonClick(button, siblings) {
    button.addEventListener('click', event => {
      // Update the element.
      SlidingToggle.update(event.target);
      // Reset selected on the buttons, then add it to the clicked the button.
      siblings.forEach(all => all.setAttribute('aria-selected', 'false'));
      button.setAttribute('aria-selected', 'true');
    });
  }

  /**
   * Add the hover behaviors to a button element.
   *
   * @param {HTMLElement} button
   *   The button to add hover behaviors to.
   * @param {HTMLElement} slidingToggle
   *   The sliding toggle element.
   */
  static buttonHover(button, slidingToggle) {
    button.addEventListener('mouseenter', enter =>
      SlidingToggle.update(enter.target),
    );
    button.addEventListener('mouseleave', () => {
      // If there is an clicked element, set that to the active button on hover
      // off. Otherwise just set the first item as the active button.
      const active = slidingToggle.querySelector('[aria-selected="true"]');
      if (active !== null) {
        SlidingToggle.update(active);
      } else {
        SlidingToggle.update(slidingToggle.children[0].children[0]);
      }
    });
  }

  /**
   * Update the variables to reflect the current button element.
   *
   * @param {HTMLElement} button
   *   The active button.
   */
  static update(button) {
    // We set the width to 100px in the CSS, so calculate the scale off that
    // base value.
    const scale = button.parentElement.offsetWidth / 100;
    const offset = button.parentElement.offsetLeft;
    button.parentElement.parentElement.setAttribute(
      'style',
      `--slide-toggle-offset: ${offset}px; --slide-toggle-scale: ${scale}`,
    );
  }
}
