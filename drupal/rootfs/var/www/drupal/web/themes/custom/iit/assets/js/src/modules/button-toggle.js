/**
 * @file
 * ButtonToggle class.
 */

import ComponentBase from '../core/component-base';
import WindowState from '../core/window-state';

/**
 * The ButtonToggle class provides an easy way to add a toggleable button. The
 * class toggles a class on <body>, updates the button label based on state,
 * takes care of enabling or disabling based on screen width, and provides an
 * event which can be used to trigger more advanced behaviors.
 *
 * @fires ButtonToggle#toggle
 */
export default class ButtonToggle extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   ButtonToggle options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('button');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the button DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-button.
     *
     * @property {string} openText
     *   The open text of the button. Defaults to 'Click to open', or the value
     *   of the [data-button-open-text] attribute.
     * @property {string} closeText
     *   The close text of the button. Defaults to 'Click to close', or the
     *   value of the [data-button-close-text] attribute.
     * @property {int} enableAt
     *   The screen width at which to enable the button behaviors. Set 0 to
     *   always enable. Defaults to 0, or the value of the
     *   [data-button-enable-at] attribute.
     * @property {int} disableAt
     *   The screen width at which to disable the button behaviors. Set -1 to
     *   never disable. Defaults to -1, or the value of the
     *   [data-button-disable-at] attribute.
     * @property {string} openClass
     *   Class to add to <body> when the button is clicked. Defaults to '', or
     *   the value of the [data-button-close-text] attribute.
     * @property {int} duration
     *   The duration of the toggle animamtions, in ms. Defaults to 400, or the
     *   value of the [data-button-duration] attribute.
     */
    this.options = {
      ...{
        openText: 'Click to open',
        closeText: 'Click to close',
        enableAt: 0,
        disableAt: -1,
        openClass: '',
        duration: 400,
      },
      ...options,
    };
  }

  /**
   * Add the button behaviors.
   */
  init() {
    this.items.forEach(button => {
      // Track the current state, clicked unclicked.
      let clicked = false;

      // Determine what element is to hold the text, either a .show-for-sr
      // element in the button, or the button itself if a .show-for-sr element
      // does not exist.
      let textElement = button.querySelectorAll('.show-for-sr');
      if (!textElement.length) {
        textElement = button;
      } else {
        [textElement] = textElement;
      }
      // Set the initial text.
      textElement.innerHTML = button.openText;

      // Add a click event listener to the button.
      button.addEventListener('click', event => {
        // Only if the button is not disabled.
        if (!button.hasAttribute('disabled')) {
          // Toggle the class on body.
          document.body.classList.toggle(button.openClass);
          // Update the state.
          clicked = !clicked;
          // Update the text.
          textElement.innerHTML = clicked ? button.closeText : button.openText;
          /**
           * Emit an 'toggle' event on clicks.
           *
           * @event ButtonToggle#toggle
           * @type {Object}
           * @property {HTMLElement} button
           *   The button that triggered the event.
           * @property {bool} clicked
           *   The current state of the button.
           */
          this.emit('toggle', { event, clicked });
        }
      });
    });
  }

  /**
   * Update each button on resize, disabling the button if appropriate.
   */
  resize() {
    WindowState.on('resize', resize => {
      this.items.forEach(button => {
        // Determine the max breakpoint. If disableAt is -1, choose an
        // unrealistically high number.
        const maxBreakpoint =
          button.disableAt === -1 ? 99999 : button.disableAt;
        const disabled = !(
          button.enableAt <= resize.width && resize.width < maxBreakpoint
        );
        if (disabled) {
          button.setAttribute('disabled', 'disabled');
        } else {
          button.removeAttribute('disabled');
        }
      });
    });
  }
}
