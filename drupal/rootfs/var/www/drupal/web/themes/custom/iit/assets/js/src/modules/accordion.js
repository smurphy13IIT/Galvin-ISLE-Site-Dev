/**
 * @file
 * Accordion class.
 */

import ComponentBase from '../core/component-base';
import WindowState from '../core/window-state';
import { slideToggle } from '../utils/animations';

/**
 * The Accordion class provides an easy way to create accordions with smart text
 * toggling for accessibility, and also the option of creating an accordion
 * which is only visible below a breakpoint.
 */
export default class Accordion extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   Accordion options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('accordion');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the accordion DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-accordion.
     *
     * @property {int} duration
     *   The duration of the toggle animation, in ms. Defaults to 400, or the
     *   value of the [data-accordion-duration] attribute.
     * @property {string} openText
     *   The accordion open text, which is prepended to the accordion label.
     *   Defaults to 'Click to open', or the value of the
     *   [data-accordion-open-text] attribute.
     * @property {string} closeText
     *   The accordion close text, which is prepended to the accordion label.
     *   Defaults to 'Click to close', or the value of the
     *   [data-accordion-close-text] attribute.
     * @property {string} openClass
     *   The class to add to the calling element when the accordion is opened.
     *   Defaults to 'accordion--open', or the value of the
     *   [data-accordion-open-class] attribute.
     * @property {string} buttonSelector
     *   The selector of the accordion button. Defaults to '.accordion__button',
     *   or the value of the [data-accordion-button-selector] attribute.
     * @property {string} contentSelector
     *   The selector of the accordion content. Defaults to
     *   '.accordion__content', or the value of the
     *   [data-accordion-content-selector] attribute.
     * @property {string} textElementSelector
     *   The selector of the accordion button. Defaults to '.show-for-sr',
     *   or the value of the [data-accordion-text-element-selector] attribute.
     * @property {int} breakpoint
     *   The accordion breakpoint, at or above which the accordion does not
     *   display. Useful for making a mobile-only accordion. Set to -1 to never
     *   create a mobile accordion. Defaults to -1, or the value of
     *   the [data-accordion-breakpoint] attribute.
     */
    this.options = {
      ...{
        duration: 400,
        openText: 'Click to open',
        closeText: 'Click to close',
        openClass: 'accordion--open',
        buttonSelector: '.accordion__button',
        contentSelector: '.accordion__content',
        textElementSelector: '.show-for-sr',
        breakpoint: -1,
      },
      ...options,
    };
  }

  /**
   * Initialize each accordion.
   */
  init() {
    this.items.forEach(accordion => {
      const button = accordion.querySelector(accordion.buttonSelector);
      const textElement = button.querySelector(accordion.textElementSelector);
      let open = false;

      // Set the initial open text.
      if (textElement) {
        textElement.innerHTML = accordion.openText;
      }

      // Add the click event.
      button.addEventListener('click', event => {
        event.preventDefault();
        open = !open;
        accordion.classList.toggle(accordion.openClass);
        slideToggle(
          accordion.querySelector(accordion.contentSelector),
          accordion.duration,
        );
        if (textElement) {
          textElement.innerHTML = open
            ? accordion.closeText
            : accordion.openText;
        }
      });
    });
  }

  /**
   * Update each accordion on resize.
   */
  resize() {
    WindowState.on('resize', resize => {
      this.items.forEach(accordion => {
        const button = accordion.querySelector(accordion.buttonSelector);
        // Add the mobile accordion behavior.
        if (accordion.breakpoint > -1) {
          if (resize.width < accordion.breakpoint) {
            button.removeAttribute('disabled');
          } else {
            button.setAttribute('disabled', 'disabled');
          }
        }
      });
    });
  }
}
