/**
 * @file
 *
 * Add the ability to expand a section on click.
 */

import './button-toggle';
import './variable-scroll-to';

/**
 * Add more or less behavior to an element.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - buttonSelector: The selector of the toggle button. Defaults to
 *     '.more-less__toggle'.
 *   - scrollOptions: Options object to pass to ohoVariableScrollTo. See that
 *     object's definition for more information on passable options.
 */
$.fn.ohoMoreLess = function ohoMoreLess(args = {}) {
  // Alias the calling element.
  const $moreLess = $(this);

  // Default options.
  const defaults = {
    buttonSelector: '.more-less__toggle',
    scrollOptions: {},
  };

  // Create the options from the defaults and supplied options.
  const options = $.fn.extend({}, defaults, args);

  // An array of tabbable selectors, plus anything with a positive tabindex.
  // @see https://www.w3.org/TR/html5/editing.html#the-tabindex-attribute
  const tabbable = [
    'a[href]',
    'link[href]',
    `button:not(${options.buttonSelector})`,
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[draggable]',
    'audio[controls]',
    'video[controls]',
    '[tabindex]:not([tabindex="-1"])',
  ];

  // Get the toggle button.
  const $toggle = $moreLess.find(options.buttonSelector);

  // Get all tabbable elements in the more or less - but not the toggle button -
  // and set them to untabbable until the more or less is opened.
  const $tabbable = $moreLess.find(tabbable.join(','));
  $tabbable.each((tabbableIndex, tabbableElement) => {
    $(tabbableElement).attr('tabindex', '-1');
  });

  // Add button toggling.
  $toggle.ohoButtonToggle();
  $toggle.on('toggle', (toggleEvent, $button, state) => {
    // Scroll to the container and focus it.
    $moreLess.ohoVariableScrollTo(options.scrollOptions);
    // Update the tabindex to allow or disallow tabbing based on the state.
    $tabbable.each((tabbableIndex, tabbableElement) => {
      $(tabbableElement).attr('tabindex', () =>
        state === 'open' ? '0' : '-1',
      );
    });
  });
};
