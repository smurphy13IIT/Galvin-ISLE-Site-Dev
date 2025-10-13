/**
 * @file
 * MoreOrLess class.
 */

import ButtonToggle from './button-toggle';
import ComponentBase from '../core/component-base';

/**
 * The MoreOrLess class provides an easy way to accessibly expand and collapse
 * a section on click.
 */
export default class MoreOrLess extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   MoreOrLess options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('more-or-less');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the more or less DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with
     * data-more-or-less.
     *
     * @property {string} buttonSelector
     *   The selector of the toggle button. Defaults to '.more-less__toggle', or
     *   the value of the [data-more-or-less-button-selector] attribute.
     */
    this.options = {
      ...{
        buttonSelector: '.more-less__toggle',
      },
      ...options,
    };

    // An array of tabbable selectors, plus anything with a positive tabindex.
    // @see https://www.w3.org/TR/html5/editing.html#the-tabindex-attribute
    this.tabbable = [
      'a[href]',
      'link[href]',
      `button:not(${this.options.buttonSelector})`,
      'input:not([type="hidden"])',
      'select',
      'textarea',
      '[draggable]',
      'audio[controls]',
      'video[controls]',
      '[tabindex]:not([tabindex="-1"])',
    ];
  }

  /**
   * Initialize each more or less.
   */
  init() {
    this.items.forEach(moreOrLess => {
      // Get all tabbable elements in the more or less - but not the toggle
      // button - and set them to untabbable until the more or less is opened.
      const tabbable = moreOrLess.querySelectorAll(this.tabbable.join(','));
      tabbable.forEach(tabbableElement => {
        tabbableElement.setAttribute('tabindex', '-1');
      });

      // Add button toggling.
      const buttonToggle = new ButtonToggle();
      buttonToggle
        .add(moreOrLess.querySelector(moreOrLess.buttonSelector))
        .run();
      buttonToggle.on('toggle', toggle => {
        // Update the tabindex to allow or disallow tabbing based on the state.
        tabbable.forEach(tabbableElement => {
          tabbableElement.setAttribute('tabindex', toggle.clicked ? '0' : '-1');
        });
      });
    });
  }
}
