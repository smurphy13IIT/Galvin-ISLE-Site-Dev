/**
 * @file
 * JavaScript to control the animations.
 */

import './in-viewport';
import './window';

/**
 * @param {string} OHO_ANIMATE_READY_CLASS
 *   The class to add to animatable elements when they are ready to be animated.
 *   This addition of this class sets the initial animate state on an element,
 *   and it's removal triggers the animation.
 */
const OHO_ANIMATE_READY_CLASS = 'oho-animate--ready';

/**
 * Run animation on a single element.
 */
$.fn.ohoAnimateSingle = function ohoAnimateSingle() {
  // Alias the window.
  const $window = $(window);

  // On every calling element.
  $(this).each((singleIndex, singleElement) => {
    // Alias the calling element.
    const $singleItem = $(singleElement);

    // Add the ready class.
    $singleItem.addClass(OHO_ANIMATE_READY_CLASS);

    // On load, scroll, and resize.
    $window.on('all', () => {
      // If it has not been animated and is in the viewport, run the animation.
      if (
        $singleItem.hasClass(OHO_ANIMATE_READY_CLASS) &&
        $singleItem.ohoInViewport()
      ) {
        $singleItem.removeClass(OHO_ANIMATE_READY_CLASS);
      }
    });
  });
};

/**
 * Run animation on a sequence of elements, with a delay between animations.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - delay: The delay between subsequent animations of each element, in ms.
 *     Defaultsto the [data-animation-delay] attribute on the calling element
 *     or 250 if the attribute does not exist.
 *   - itemsSelector: The selector for each of the items to animate in sequence.
 *     Defaults to '.oho-animate'.
 */
$.fn.ohoAnimateSequence = function ohoAnimateSequence(args = {}) {
  // Alias the window.
  const $window = $(window);

  // On every calling element.
  $(this).each((sequenceIndex, sequenceElement) => {
    // Alias the calling element.
    const $sequenceItem = $(sequenceElement);

    // Defaults
    const defaults = {
      delay: $sequenceItem.attr('data-animation-delay'),
      itemsSelector: '.oho-animate',
    };

    // Create options from supplied and defaults.
    const options = $.fn.extend({}, defaults, args);

    // Make sure there is a delay set.
    if (undefined === options.delay) {
      options.delay = 250;
    }

    // Get the sequence items in the calling element.
    const $sequenceItems = $sequenceItem.find(options.itemsSelector);

    // Add the ready classes.
    $sequenceItem.addClass(OHO_ANIMATE_READY_CLASS);
    $sequenceItems.addClass(OHO_ANIMATE_READY_CLASS);

    // On load, scroll, and resize.
    $window.on('all', () => {
      // If it has not been animated and is in the viewport, run the animation.
      if (
        $sequenceItem.hasClass(OHO_ANIMATE_READY_CLASS) &&
        $sequenceItem.ohoInViewport()
      ) {
        $sequenceItem.removeClass(OHO_ANIMATE_READY_CLASS);
        $sequenceItems.each((sequenceItemIndex, sequenceItemElement) => {
          const $item = $(sequenceItemElement);
          // Disabling ESLint's warnings about nested callbacks here.
          setTimeout(() => { // eslint-disable-line
            $item.removeClass(OHO_ANIMATE_READY_CLASS);
          }, options.delay * sequenceItemIndex);
        });
      }
    });
  });
};
