/**
 * @file
 * SidebarMenu class.
 */

import AccessibleMenu from './accessible-menu';
import ButtonToggle from './button-toggle';
import ComponentBase from '../core/component-base';
import { slideToggle } from '../utils/animations';

/**
 * The SiidebarMenu class provides an easy way to add the following behaviors to
 * a sidebar menu: menu item open and close buttons, accessibility, and an open
 * and close menu button for mobile screens.
 */
export default class SidebarMenu extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   SidebarMenu options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('menu');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the sidebar menu DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-menu.
     *
     * @property {string} toggleButtonSelector
     *   The selector of the mobile open and close button. Defaults to
     *   '.sidebar-menu__toggle', or the value of the
     *   [data-menu-toggle-button-selector] attribute.
     * @property {string} activeClass
     *   The class of active trail items. Defaults to 'menu-item--active-trail',
     *   or the value of the [data-menu-active-class] attribute.
     * @property {int} duration
     *   The duration of the toggle animamtions, in ms. Defaults to 400, or the
     * value of the [data-menu-duration] attribute.
     * @property {Object} accessibleMenu
     *   Options passed to AccessibleMenu when making the sidebar accessible
     *   menu. See accessible-menu.js for more information.
     * @property {Object} buttonToggle
     *   Options passed to ButtonToggle when making the sidebar mobile toggle
     *   button. See button-toggle.js for more information.
     */
    this.options = {
      ...{
        toggleButtonSelector: '.sidebar-menu__toggle',
        activeClass: 'menu-item--active-trail',
        duration: 400,
        accessibleMenu: {
          buttonClass: 'menu-item__button',
          hasItemsSelector:
            '.menu-item--expanded > a, .menu-item--expanded > span',
          openClass: 'menu-item--open',
          regex: /%s/,
          openText: 'Open the %s menu',
          closeText: 'Close the %s menu',
        },
        buttonToggle: {
          openText: 'Click to open',
          closeText: 'Click to close',
          enableAt: 0,
          disableAt: -1,
          openClass: '',
          duration: 400,
        },
      },
      ...options,
    };
  }

  /**
   * Add the sidebar menu behaviors on each menu.
   */
  init() {
    this.items.forEach(menu => {
      // Add the toggle behavior.
      const toggle = new ButtonToggle();
      const menuButton = menu.querySelector(this.options.toggleButtonSelector);
      toggle.add(menuButton).run();
      toggle.on('toggle', click => {
        slideToggle(
          click.event.target.nextElementSibling,
          this.options.duration,
        );
      });

      // Make the menu accessible.
      const accessibleMenu = new AccessibleMenu(this.options.AccessibleMenu);
      accessibleMenu.add(menu).run();
      accessibleMenu.on('toggle', click => {
        slideToggle(
          click.event.target.nextElementSibling,
          this.options.duration,
        );
      });

      // Set the initial state, both classes and text.
      const buttons = menu.querySelectorAll(
        `.${this.options.accessibleMenu.buttonClass}`,
      );
      buttons.forEach(button => {
        const li = button.closest('li');
        // If the menu item's inital state is active.
        if (li.classList.contains(this.options.activeClass)) {
          // Set the open class.
          li.classList.add(this.options.accessibleMenu.openClass);
          // Change to the close text.
          button.textContent = menu.closeText.replace(
            this.options.accessibleMenu.regex,
            this.getLabel(button, menu.openText),
          );
        }
      });
    });
  }

  /**
   * Get the menu item label from the default open text.
   *
   * @param {HTMLElement} button
   *   The button elemnt to get the text of.
   * @param {string} openText
   *   The menu open text.
   * @return {string}
   *   The menu label.
   */
  getLabel(button, openText) {
    const text = button.textContent;
    const regex = openText.replace(this.options.accessibleMenu.regex, '(.*)');
    const label = text.match(regex);
    return label[1];
  }
}
