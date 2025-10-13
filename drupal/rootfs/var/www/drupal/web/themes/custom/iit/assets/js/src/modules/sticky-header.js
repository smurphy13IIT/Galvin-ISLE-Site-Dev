/**
 * @file
 * StickyHeader class.
 */

import WindowState from '../core/window-state';

/**
 * The StickyHeader class provides a method to watch the window state for
 * changes and adds and removes classes accordingly. When thep age is scrolled
 * past the header the class of 'main-menu--sticky' is added to the menu
 * container, and when scrolling up or when at the bottom of the page, the class
 * of 'main-menu--show' is added to the menu container.
 */
export default class StickyHeader {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {string} header
   *   The header container selector.
   * @param {string} mainMenu
   *   The main menu container selector.
   * @param {int} startAt
   *   The minimum width to start the sticky header behavior.
   */
  constructor(header, mainMenu, startAt) {
    this.header = document.querySelector(header);
    this.menu = document.querySelector(mainMenu);
    this.breakpoint = startAt;
    this.offset = this.header.offsetTop;
    this.stickyClass = 'sticky-header';
    this.showClass = 'sticky-header--show';
  }

  /**
   * Add the sticky behavior on scroll, above the breakpoint (startAt).
   */
  run() {
    WindowState.on('all', all => {
      // On scroll only, and when we're above the breakpoint.
      if (all.event.type === 'scroll' && all.width >= this.breakpoint) {
        // The sticky class is added if the page has scrolled beyond the point
        // of the menu in the header.
        if (all.currentScrollPosition > this.menuPosition()) {
          this.menu.classList.add(this.stickyClass);
        } else {
          this.menu.classList.remove(this.stickyClass);
        }

        // The show class is added if the page has scrolled up or if the page
        // has scrolled to the bottom.
        if (
          all.scrollDirection === 'up' ||
          all.currentScrollPosition === all.maxHeight
        ) {
          this.menu.classList.add(this.showClass);
        } else {
          this.menu.classList.remove(this.showClass);
        }
      }
    });
  }

  /**
   * Calculate the position of the menu on the page from the page top.
   *
   * @return {int}
   *   The position of the menu.
   */
  menuPosition() {
    return this.header.offsetHeight - this.offset;
  }
}
