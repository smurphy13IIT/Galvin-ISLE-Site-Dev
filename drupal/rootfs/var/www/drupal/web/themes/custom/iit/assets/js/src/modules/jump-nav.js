/**
 * @file
 * JumpNav class.
 */

import SmoothScroll from './smooth-scroll';
import WindowState from '../core/window-state';

/**
 * The JumpNav class provides an easy way to create a jump navigation from
 * elements on a page. The class generates appropriate ids, creates the jump
 * links, watches scroll and adds a class to the active jump link, and adds
 * smooth scrolling to the jump links.
 */
export default class JumpNav {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {Object} options
   *   JumpNav options. See object definition in the constructor below.
   */
  constructor(options = {}) {
    /**
     * Create the options from supplied options and defaults. Options:
     *
     * @property {string} hideSelector
     *   A selector of an element to hide if there are no jump links to be added
     *   Defaults to '[data-jump-nav-hide]'.
     * @property {ca]lback} isActive
     *   The class to add to generated jump link wrappers. Defaults to the
     *   scrolledPastCenter() method on this class.
     * @property {string} linkWrapperClass
     *   The class to add to generated jump link wrappers. Defaults to
     *   'jump-nav__item'.
     * @property {string} linkClass
     *   The class to add to generated jump links. Defaults to
     *   'jump-nav__link'.
     * @property {string} linkActiveClass
     *   The class to add to the active jump link. Defaults to
     *   jump-nav__link--active'.
     * @property {string} targetSelector
     *   target selectors to search the DOM for. Matched selectors are used to
     *   create the jump links. Defaults to '[data-jump-nav-heading]'.
     * @property {int} minRequired
     *   The minimum number of targets required to generate the jump links.
     *   Defaults to 0.
     * @property {int} minDuration
     *   The minimum duration of the scroll animation, in milliseconds. This is
     *   passed directly to SmoothScroll. Defaults to 250.
     * @property {int} maxDuration
     *   The maximum duration of the scroll animation, in milliseconds. This is
     *   passed directly to SmoothScroll. Defaults to 1000.
     */
    this.options = {
      ...{
        hideSelector: '[data-jump-nav-hide]',
        isActive: JumpNav.scrolledPastCenter,
        linkWrapperClass: 'jump-nav__item',
        linkClass: 'jump-nav__link',
        linkActiveClass: 'jump-nav__link--active',
        targetSelector: '[data-jump-nav-heading]',
        minRequired: 0,
        minDuration: 250,
        maxDuration: 1000,
      },
      ...options,
    };

    this.smoothScroll = new SmoothScroll({
      minDuration: this.options.minDuration,
      maxDuration: this.options.maxDuration,
    });

    return this;
  }

  /**
   * Create the jump nav.
   *
   * @param {string} selector
   *   Selector of the jump nav element.
   */
  create(selector) {
    // Get the jump link container.
    this.container = document.querySelector(selector);

    // No container, so just stop.
    if (this.container === null) {
      return;
    }

    // Get all the possible targets on the page.
    this.targets = document.querySelectorAll(this.options.targetSelector);

    // Get the number of targets.
    this.numTargets = this.targets.length;

    // Flag whether the jump nav should be shown. The jump nav is shown if there
    // are targets, or if the number of targets is greater than the minimum
    // number reqquired.
    const showNav =
      this.numTargets && this.options.minRequired <= this.numTargets;

    // Hide this element, if it's been determined to be unnecessary.
    const hideElement = document.querySelector(this.options.hideSelector);
    hideElement.style.display = showNav ? 'initial' : 'none';

    // Empty the container, in case the links need to be regenerated later.
    this.container.innerHTML = '';

    // If there are no jump nav targets, or the number of targets is less than
    // the minimum required number, stop this altogether.
    if (!showNav) {
      return;
    }

    // Create the jump links.
    this.createLinksFromTargets();

    // Reverse the targets so we can sort from the bottom up,
    this.targets = Array.from(this.targets).reverse();

    // On all window behaviors, update the jump nav.
    WindowState.on('all', () => this.updateJumpNav());
  }

  /**
   * Create the jump link markup.
   *
   * @param {string} id
   *   The link's id.
   * @param {string} text
   *   The link's text.
   * @return {HTMLElement}
   *   Link markup.
   */
  createLink(id, text) {
    // Create the link.
    const link = document.createElement('a');
    link.setAttribute('href', `#${id}`);
    link.classList.add(this.options.linkClass);
    link.innerHTML = text;

    // Get the link target element and add the click event.
    const target = document.getElementById(id);
    link.addEventListener('click', () =>
      this.smoothScroll.scrollTo(target, WindowState.height / 2.5),
    );

    return link;
  }

  /**
   * Process each of the targets, creating the jump links from them.
   *
   * Do following things:
   *   1. Get the id of the target, or calculate one from the text.
   *   2. Append a random string to the id if it's a duplicate.
   *   3. Create the link markup and element.
   *   4. Add the link to the links property.
   *   5. Add click handler to the link.
   *   6. Wrap the link and add it to the DOM.
   */
  createLinksFromTargets() {
    this.links = [];
    const existingIds = [];

    // Create the jump links from the targets.
    this.targets.forEach(target => {
      // Get the target's text.
      const text = target.innerText;

      // If the element has no text or the text is just blank, stop.
      if (!text.length || !text.trim()) {
        return;
      }

      // Get the target's id.
      let id = target.getAttribute('id');

      // If there is no id, create one from the text.
      if (id === null) {
        id = text.toLowerCase().replace(/[^a-z]/g, '-');
        target.setAttribute('id', id);
      }

      // If this id is a duplicate, add a random number string after and use
      // this id instead, and replace the target id with the calculated one.
      if (existingIds.indexOf(id) !== -1) {
        const rand = window.crypto
          .getRandomValues(new Uint32Array(1))
          .toString();
        id = `${id}-${rand}`;
        target.setAttribute('id', id);
      }

      // Push the id we're using into the ids array, so we can look up duplicate
      // ids quickly on subsequent iterations.
      existingIds.push(id);

      // Create the link.
      const link = this.createLink(id, text);

      // Add the link to the links property.
      this.links.push(link);
    });

    // Insert the links and wrapping li.
    this.links.forEach(link => {
      const wrapper = document.createElement('li');
      wrapper.classList.add(this.options.linkWrapperClass);
      const li = this.container.appendChild(wrapper);
      li.appendChild(link);
    });
  }

  /**
   * Check if an element is scrolled past the window center.
   *
   * @param {HTMLElement} element
   *   The element which to test against.
   * @return {boolean}
   *   True if it is, false if not.
   */
  static scrolledPastCenter(element) {
    const scrollPositionMiddle =
      WindowState.currentScrollPosition + WindowState.height / 2;
    const elementMiddle = element.offsetTop + element.offsetHeight / 2;
    return elementMiddle < scrollPositionMiddle;
  }

  /**
   * Update the jump nav state. Add a class to the active item, and remove the
   * class from other elements.
   */
  updateJumpNav() {
    // Track whether a link has been updated.
    let updated = false;

    this.targets.forEach((target, index) => {
      // Set the item active according according to the callback, or if it's the
      // last item (no active items were found; the page is higher, so set the
      // first). The targets property is reversed, so this checks from the
      // bottom up. Also stop checking if an element has been updated already.
      if (
        !updated &&
        (this.options.isActive(target) || index === this.numTargets - 1)
      ) {
        this.links.forEach(link => {
          if (link.getAttribute('href') === `#${target.getAttribute('id')}`) {
            link.classList.add(this.options.linkActiveClass);
          } else {
            link.classList.remove(this.options.linkActiveClass);
          }
        });
        updated = true;
      }
    });
  }
}
