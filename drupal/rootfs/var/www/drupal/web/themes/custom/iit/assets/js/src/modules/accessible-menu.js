/**
 * @file
 * AccessibleMenu class.
 */

import ComponentBase from '../core/component-base';

/**
 * The AccessibleMenu class makes any menu tree accessible by keyboard
 * navigation. The class adds buttons with descriptive labels inside menu items
 * with children, and updates the text based on the current toggled state, as
 * well as toggling classes on the button parent.
 *
 * @fires AcressibleMenu#toggle
 */
export default class AccessibleMenu extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   Menu options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('menu');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the menu DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-menu.
     *
     * @property {string} buttonClass
     *   The class added to the inserted button. Defaults to
     *   'menu-item__button', or the value of the [data-menu-button-class]
     *   attribute.
     * @property {string} hasItemsSelector
     *   The selectors of menu items which have children. Defaults to
     *   '.menu-item--expanded > a, .menu-item--expanded > span', or the value
     *   of the [data-menu-has-items-selector] attribute.
     * @property {string} openClass
     *   The class to add to open menu items, specified by hasItemsSelector.
     *   Defaults to 'menu-item--open', or the value of the
     *   [data-menu-open-class] attribute.
     * @property {RegExp} regex
     *   The regex search string to look for in the close and open text.
     *   Defaults to /%s/, or the value of the [data-menu-regex] attribute.
     * @property {string} closeText
     *   The text pattern for the close text. Can have the regex string for
     *   replacement. Defaults to 'Close the %s menu', or the value of the
     *   [data-menu-close-text] attribute.
     * @property {string} openText
     *   The text pattern for the open text. Can have the regex string for
     *   replacement. Defaults to 'Open the %s menu', or the value of the
     *   [data-menu-open-text] attribute.
     */
    this.options = {
      ...{
        buttonClass: 'menu-item__button',
        hasItemsSelector:
          '.menu-item--expanded > a, .menu-item--expanded > span',
        openClass: 'menu-item--open',
        regex: /%s/,
        openText: 'Open the %s menu',
        closeText: 'Close the %s menu',
      },
      ...options,
    };
  }

  /**
   * Add the accessible menu behaviors or each menu.
   */
  init() {
    this.items.forEach(menu => {
      menu.querySelectorAll(this.options.hasItemsSelector).forEach(menuLink => {
        // Create the open and close text for each button from the link text.
        const openText = menu.openText.replace(
          this.options.regex,
          menuLink.innerHTML,
        );
        const closeText = menu.closeText.replace(
          this.options.regex,
          menuLink.innerHTML,
        );

        // The menu item's ul.
        const ul = menuLink.parentElement.querySelector('ul');

        // Create the button and add the class toggle and update the button text
        // on click.
        const button = this.createButton(openText);
        button.addEventListener('click', event => {
          event.preventDefault();
          menuLink.parentElement.classList.toggle(this.options.openClass);
          button.innerHTML =
            button.innerHTML === openText ? closeText : openText;

          /**
           * Emit a 'toggle' event on all every button click.
           *
           * @event AccessibleMenu#toggle
           * @type {string} state
           *   The current state of the menu item, either 'open' or 'closed'.
           */
          this.emit('toggle', {
            event,
            clicked: button.innerHTML === openText,
          });
        });

        // Add the button before the ul.
        menuLink.parentElement.insertBefore(button, ul);
      });
    });
  }

  /**
   * Create the button to insert.
   *
   * @param {string} text
   *   The text of the button.
   *
   * @return {HTMLElement}
   *   The button element.
   */
  createButton(text) {
    const button = document.createElement('button');
    button.classList.add(this.options.buttonClass);
    button.innerHTML = text;
    return button;
  }
}
