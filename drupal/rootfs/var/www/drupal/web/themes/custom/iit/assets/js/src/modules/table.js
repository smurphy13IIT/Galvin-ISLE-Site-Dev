/**
 * @file
 * Table class.
 */

import ComponentBase from '../core/component-base';
import WindowState from '../core/window-state';

/**
 * The Table class helps in making tables usable on mobile. The class will wrap
 * all tables in an element and add an active class when the table width is
 * creater than the wrapping element's width. This allows for styling, like an
 * overflow, to be added conditionally only when the table needs it.
 */
export default class Table extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   Table options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('table');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the accordion DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-accordion.
     *
     * @property {string} wrapperElement
     *   The element to wrap all tables with. Defaults to 'div'.
     * @property {string} wrapperClass
     *   The class to add to the wrapper element. Defaults to 'mobile-table'.
     * @property {string} wrapperActiveClass
     *   The class to add to the wrapper element when the table width is greater
     *   than the wrapper width. Defaults to 'mobile-table--scroll'.
     */
    this.options = {
      ...{
        wrapperElement: 'div',
        wrapperClass: 'mobile-table',
        wrapperActiveClass: 'mobile-table--scroll',
      },
      ...options,
    };
  }

  /**
   * Initialize each table, wrapping it in the element and saving the warpper as
   * a property on the table object.
   */
  init() {
    this.items.forEach(table => {
      table.wrapper = document.createElement(this.options.wrapperElement);
      table.wrapper.classList.add(this.options.wrapperClass);
      table.parentNode.insertBefore(table.wrapper, table);
      table.wrapper.appendChild(table);
    });
  }

  /**
   * Update each table on resize, adding the active class if the table width is
   * greater than the wrapper width.
   */
  resize() {
    WindowState.on('resize', () => {
      this.items.forEach(table => {
        if (table.offsetWidth > table.wrapper.offsetWidth) {
          table.wrapper.classList.add(this.options.wrapperActiveClass);
        } else {
          table.wrapper.classList.remove(this.options.wrapperActiveClass);
        }
      });
    });
  }
}
