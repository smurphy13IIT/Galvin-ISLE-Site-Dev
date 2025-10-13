/**
 * @file
 * JQuery plugin to generate a jump nav from on-page selectors.
 */

import './variable-scroll-to';

/**
 * Jump Nav function. Inserts jump nav links into calling element.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - activeClass: The active class to add to the jump nav links when their
 *     associated target element is in the viewport. Defaults to
 *     'jump-nav__link--active'.
 *   - hideSelector: A selector to hide if there are no jump links to be
 *     added. Defaults to '[data-jump-nav-hide]'.
 *   - isActive: A callback to test whether an item is in the viewport. The
 *     function gets passed a jQuery object of the element in question, and
 *     must return a boolean. Defaults to scrolledPastCenter. See
 *     scrolledPastCenter for more information.
 *   - linkClass: Class to add to the jump link anchor element. Defaults to
 *     'jump-nav__link'.
 *   - linkWrapper: Markup to wrap the jump nav links in before inserting into
 *     the DOM. Defaults to '<li class="jump-nav__item"></li>'.
 *   - maxScrollDuration: The maximum ms duration that a scroll animation will
 *     take. Defaults to 1000. See variable-scroll-to.js for more info.
 *   - minScrollDuration. The minimum ms duration that a scroll animation will
 *     take. Defaults to 250. See variable-scroll-to.js for more info.
 *   - minRequired: The minimum number of links required to generate the jump
 *     nav. Defaults to 0.
 *   - targetSelectors: An array of target selectors to search the DOM for.
 *     Matched selectors are used to create the jump links. Defaults to
 *     '[data-jump-nav-heading]'.
 */
$.fn.ohoJumpNav = function ohoJumpNav(args = {}) {
  // Global scope variables.
  const $container = $(this);
  const $window = $(window);
  const $document = $(document);
  let $targets = $([]);
  let numTargets = 0;
  let $links = $([]);
  let windowHeight = $window.height();
  let lastPosition = null;

  /**
   * Check if an element has scrolled past the viewport center.
   *
   * @param {Object} $element - The element (jQuery) to check against.
   *
   * @return {bool} - True if executed, false if otherwise.
   */
  const scrolledPastCenter = $element => {
    const scrollPositionMiddle =
      Math.max(
        0,
        Math.min($document.scrollTop(), $document.height() - windowHeight),
      ) +
      windowHeight / 2;
    const elementMiddle = $element.offset().top + $element.outerHeight() / 2;
    return elementMiddle < scrollPositionMiddle;
  };

  // The default options.
  const defaults = {
    activeClass: 'jump-nav__link--active',
    hideSelector: '[data-jump-nav-hide]',
    isActive: scrolledPastCenter,
    linkClass: 'jump-nav__link',
    linkWrapper: '<li class="jump-nav__item"></li>',
    minScrollDuration: 250,
    maxScrollDuration: 1000,
    minRequired: 0,
    targetSelectors: ['[data-jump-nav-heading]'],
  };

  // Create options from supplied and defaults.
  const options = $.fn.extend({}, defaults, args);

  // Get all the possible targets on the page.
  $targets = $(options.targetSelectors.join(', '));

  // Get the number of targets.
  numTargets = $targets.length;

  // Flag whether the jump nav should be shown. The jump nav is shown if
  // there are targets, or if the number of targets is greater than the
  // minimum number reqquired.
  const showNav = numTargets && options.minRequired <= numTargets;

  // Hide this element, if it's been determined to be unnecessary.
  $(options.hideSelector).css('display', showNav ? 'initial' : 'none');

  // Empty the container, in case the links need to be regenerated later.
  $container.empty();

  // If there are no jump nav targets, or the number of targets is less than
  // the minimum required number, stop this altogether.
  if (!showNav) {
    return;
  }

  // Reverse the target order, because we usually will want to work backwards
  // up the DOM.
  $targets = $($targets.get().reverse());

  // Process each of the targets, doing the following things:
  //   1. Get the id of the target, or calculate one from the text.
  //   2. Append a random string to the id if it's a duplicate.
  //   3. Create the link markup and object.
  //   4. Add the link to the $links object.
  //   5. Add click handler to the link.
  //   6. Wrap the link and add it to the DOM.
  $targets.each((targetIndex, targetElement) => {
    const $target = $(targetElement);
    const text = $target.text();
    let id;
    let $link;
    const existingIds = [];

    // No label, or just a blank label, so stop.
    if (!text.length || !text.trim()) {
      return;
    }

    // Get the id if there is one on the target, or generate the id and add it
    // to the target if there is not one already.
    if (typeof $target.attr('id') === 'undefined') {
      id = text.toLowerCase().replace(/[^a-z]/g, '-');
      $target.attr('id', id);
    } else {
      id = $target.attr('id');
    }

    // If this id is a duplicate, add a random number string after and use
    // this id instead, and replace the target id with the calculated one.
    if (existingIds.indexOf(id) !== -1) {
      id = `${id}-${window.crypto
        .getRandomValues(new Uint32Array(1))
        .toString()}`;
      $target.attr('id', id);
    }

    // Push the id we're using into the ids array, so we can look up
    // duplicate ids quickly on subsequent iterations.
    existingIds.push(id);

    // Create the link.
    $link = $(`<a href="#${id}" class="${options.linkClass}">${text}</a>`);

    // Add the link to the links object for later use in determining which
    // link should be highlighted on scroll.
    $links = $links.add($link);

    // Add click handlers to the link for scrolling. Links scroll to just
    // above the middle of the page.
    $link.click(() => {
      $(`#${id}`).ohoVariableScrollTo({
        offset: windowHeight / -2.5,
        minDuration: options.minScrollDuration,
        maxDuration: options.maxScrollDuration,
      });
    });

    // Wrap the link in the wrapping elements.
    $link = $link.wrap(options.linkWrapper).parent();

    // Add the link to the container. Use prepend because targets are in
    // reverse order.
    $container.prepend($link);
  });

  /**
   * Update the active item, and set the others as inactive.
   */
  function updateJumpNav() {
    // Current scroll position.
    const scrollPosition = $document.scrollTop();

    // Check for changes, and stop if the window size has not changed.
    if (lastPosition === scrollPosition) {
      window.requestAnimationFrame(updateJumpNav);
      return;
    }

    for (let i = 0; i < numTargets; i++) {
      // Set the item active according according to the callback, or if it's
      // the last item (no active items were found; the page is higher, so set
      // the first). The $targets object is reversed, so this checks from the
      // bottom up.
      const $target = $targets.eq(i);
      if (options.isActive($target) || i === numTargets - 1) {
        // Get the id from the target, and update the links accordingly.
        const id = $target.attr('id');
        $links.filter(`[href="#${id}"]`).addClass(options.activeClass);
        $links.filter(`:not([href="#${id}"])`).removeClass(options.activeClass);
        // We found one, so stop looking.
        return;
      }

      // Record the current position.
      lastPosition = scrollPosition;

      // Do it again!
      window.requestAnimationFrame(updateJumpNav);
    }
  }

  // Calculate the initial state of the jump nav.
  updateJumpNav();

  // On resize, update the window height.
  $window.on('resize', () => {
    windowHeight = $window.height();
  });

  // On user scroll, recalculate & update the jump nav.
  $window.on('scroll', updateJumpNav);
};
