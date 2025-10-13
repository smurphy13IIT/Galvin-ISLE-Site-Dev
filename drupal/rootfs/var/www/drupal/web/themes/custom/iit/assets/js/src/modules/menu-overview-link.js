/**
 * @file
 * MenuOverviewLink class.
 */

import ComponentBase from '../core/component-base';
import WindowState from '../core/window-state';

/**
 * The MenuOverviewLink class clones menu links that have submenus and inserts
 * the cloned link as the first item in the submenu. It also prevents clicking
 * on the original link. This allows for menus that have a full clickable target
 * on mobile.
 */
export default class MenuOverviewLink extends ComponentBase {
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
     * @property {int} disableAt
     *   The screen width at which to disable the overview behaviors. Set -1 to
     *   never disable. Defaults to 1024, or the value of the
     *   [data-menu-disable-at] attribute.
     * @property {string} hasItemsSelector
     *   The selectors of menu items which have children. Defaults to
     *   '.menu-item--expanded > a, .menu-item--expanded > span', or the value
     *   of the [data-menu-has-items-selector] attribute.
     * @property {string} disabledClass
     *   The class to add to the menu link's li element. Defaults to
     *   'menu-item--disabled', or the value  of the [data-menu-disabled-class]
     *    attribute.
     * @property {string} overviewClass
     *   The class to add to the overview link's li element. Defaults to
     *   'menu-item--overview', or the value  of the [data-menu-overview-class]
     *    attribute.
     */
    this.options = {
      ...{
        disableAt: 1024,
        hasItemsSelector: '.menu-item--expanded > a',
        disabledClass: 'menu-item--disabled',
        overviewClass: 'menu-item--overview',
      },
      ...options,
    };

    // Add a method for blocking click, so we have a function signature to
    // remove.
    this.blockClick = event => {
      event.preventDefault();
    };
  }

  /**
   * Add the overview link to each menu with children.
   */
  init() {
    this.items.forEach(menu => {
      menu.querySelectorAll(this.options.hasItemsSelector).forEach(menuLink => {
        // Create the overview link.
        const overviewLink = menuLink.cloneNode(true);

        // Remove all non-text nodes from the link.
        Array.prototype.forEach.call(overviewLink.childNodes, node => {
          if (node.nodeType !== Node.TEXT_NODE) {
            node.remove();
          }
        });

        // Add the overview link in an li.
        const li = document.createElement('li');
        li.classList.add(this.options.overviewClass);
        li.append(overviewLink);

        // Add the overview li to the submenu.
        const ul = menuLink.parentElement.querySelector('ul');
        ul.prepend(li);
      });
    });
  }

  /**
   * Disable the top link or the overview link based on breakpoint.
   */
  resize() {
    WindowState.on('resize', resize => {
      this.items.forEach(menu => {
        menu
          .querySelectorAll(this.options.hasItemsSelector)
          .forEach(menuLink => {
            // The width is below the disable value, prevent click and add the
            // disabled class.
            if (
              resize.width <
              (this.options.disableAt === -1 ? 99999 : this.options.disableAt)
            ) {
              menuLink.addEventListener('click', this.blockClick);
              menuLink.parentElement.classList.add(this.options.disabledClass);
            }
            // The width is above the disable value, allow click and remove the
            // disablei class.
            else {
              menuLink.removeEventListener('click', this.blockClick);
              menuLink.parentElement.classList.remove(
                this.options.disabledClass,
              );
            }
          });
      });
    });
  }
}
