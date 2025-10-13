/**
 * @file
 * Tab class.
 */

import ComponentBase from '../core/component-base';
import WindowState from '../core/window-state';

/**
 * The Tab class provides an easy way to create tabs with text toggling for
 * accessibily, which turn to agccordions on mobile.
 */
export default class Tab extends ComponentBase {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   Tab options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    super('tab');

    /**
     * Create the options from supplied options and defaults. Options can be
     * specificed on object creation by passing an object, or inline as data
     * attributes on the tab DOM element. Data attribute options are
     * kebab-cased versions of the options below, prefixed with data-tab.
     *
     * @property {int} breakpoint
     *   The tabs breakpoint, below which the tabs function as accordions. Set
     *   to -1 to always show tabs. This number must be in sync with the
     *   accordion markup that doubles as tab content. Defaults to 769, or the
     *   value of the [data-tab-breakpoint] attribute.
     * @property {string} buttonContainerSelector
     *   The selector of the button container element. Defaults to
     *   '.tabs__buttons', or the value of the
     *   [data-tab-button-container-selector] attribute.
     * @property {string} buttonSelector
     *   The selector of the button elements. Defaults to '.tabs__button', or
     *   the value of the [data-tab-button-selector] attribute.
     * @property {string} contentSelector
     *   The selector of the tab content elements. Defaults to '.accordion', or
     *   the value of the [data-tab-content-selector] attribute.
     */
    this.options = {
      ...{
        breakpoint: 768,
        buttonContainerSelector: '.tabs__buttons',
        buttonSelector: '.tabs__button',
        contentSelector: '.accordion',
      },
      ...options,
    };
  }

  /**
   * Initialize each tab.
   */
  init() {
    this.items.forEach(tab => {
      const buttonsContainer = tab.querySelector(tab.buttonContainerSelector);
      const buttons = buttonsContainer.querySelectorAll(tab.buttonSelector);
      const contents = [];

      // Get the tab contents that are immediate children of the tab.
      const children = Object.values(tab.children);
      children.forEach(child => {
        if (child.classList.contains(tab.contentSelector.substring(1))) {
          contents.push(child);
        }
      });

      // Set the initial state,
      Tab.showTab(buttons, contents, 0);

      // Add the button click behavior.
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          Tab.showTab(buttons, contents, index);
        });
      });
    });
  }

  /**
   * Update each tab on resize.
   */
  resize() {
    WindowState.on('resize', resize => {
      this.items.forEach(tab => {
        const buttonsContainer = tab.querySelector(tab.buttonContainerSelector);
        const buttons = buttonsContainer.querySelectorAll(tab.buttonSelector);
        // Disable the tab buttons when below the breakpoint.
        if (tab.breakpoint > -1) {
          buttons.forEach(button => {
            if (resize.width < tab.breakpoint) {
              button.setAttribute('disabled', 'disabled');
            } else {
              button.removeAttribute('disabled');
            }
          });
        }
      });
    });
  }

  /**
   * Show a tab and hide all others.
   *
   * @param {NodeLst} buttons
   *   The buttons to toggle.
   * @param {Array} contents
   *   The contents to toggle, an array of HTMLElements.
   * @param {int} index
   *   The index of the tab to show.
   */
  static showTab(buttons, contents, index) {
    // Reset all to tabs and contents to unselected/hidden.
    buttons.forEach(button => {
      button.setAttribute('aria-selected', 'false');
    });
    contents.forEach(content => {
      content.setAttribute('aria-hidden', 'true');
    });
    // Show the correct tab and contents.
    buttons[index].setAttribute('aria-selected', 'true');
    contents[index].setAttribute('aria-hidden', 'false');
  }
}
