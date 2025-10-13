/**
 * @file
 * JavaScript to control arbitrary button toggling through code or data
 * attributes. Automatically switches button text and toggles a class on <body>.
 */

import './window';

/**
 * Add toggling to a button.
 *
 * @events:
 *   - 'toggle', when the mobile button is clicked. Provides two variables,
 *     the button jQuery obect and the new state of the button, either 'open' or
 *     'closed'.
 *
 * @param {Object} args
 *   The args can take the following key/value pairs:
 *   - buttonCloseText: The button close text. There needs to be a .show-for-sr
 *     element contained in the button for this to work. Defaults to the
 *     [data-button-close-text] attribute on the calling element.
 *   - buttonOpenText: The button open text. There needs to be a .show-for-sr
 *     element contained in the button for this to work. Defaults to the
 *     [data-button-open-text] attribute on the calling element.
 *   - enableAt: A screen width at which to enable the button behaviors. Set to
 *     0 to always enable. Defaults to the [data-button-enable-at] attribute on
 *     the calling element.
 *   - disableAt: A screen width at which to disable the button behaviors. Omit
 *     to never disable. Defaults to the [data-button-disable-at] attribute on
 *     the calling element.
 *   - openClass: Class to add to the <body> when the menu is opened.
 *     Defaults to the [data-button-open-text] attribute on the calling element.
 */
$.fn.ohoButtonToggle = function ohoButtonToggle(args = {}) {
  // Alias the calling element.
  const $button = $(this);

  // Create the window and body objects.
  const $window = $(window);
  const $body = $('body');

  // Button defaults.
  const defaults = {
    buttonOpenText: $button.attr('data-button-open-text'),
    buttonCloseText: $button.attr('data-button-close-text'),
    enableAt: $button.attr('data-button-enable-at'),
    disableAt: $button.attr('data-button-disable-at'),
    openClass: $button.attr('data-button-open-class'),
  };

  // Create options.
  const options = $.fn.extend({}, defaults, args);

  // A variable to track the state.
  let state = 'closed';

  // Get the min breakpoint value. If enableAt is not set, assume from 0.
  const minBreakpoint = undefined !== options.enableAt ? options.enableAt : 0;
  // Get the max breakpoint value. If disableAt is not set, assume it's always
  // enabled and set a unrealisticly high number.
  const maxBreakpoint =
    undefined !== options.disableAt ? options.disableAt : 99999;

  // Find the text element. Falls back to the button if no screen-reader only
  // element is found in the button.
  let $textElement = $button.find('.show-for-sr');
  if (!$textElement.length) {
    $textElement = $button;
  }

  // On load, create the button text.
  $textElement.text(options.buttonOpenText);

  // On resize and load, set the disabled attribute if the button should not be
  // clickable and hide it from screen readers.
  $window.on('resized', (event, width) => {
    // Disabled if the width is not between the min and max breakpoints.
    const disabled = !(minBreakpoint <= width && width < maxBreakpoint);
    $button.attr('disabled', disabled);
  });

  // Toggling on click.
  $button.click(() => {
    // Only if not disabled.
    if (!$button.attr('disabled')) {
      // Toggle the class on the body.
      $body.toggleClass(options.openClass);

      // Switch the text.
      $textElement.text((buttonIndex, buttonValue) =>
        buttonValue === options.buttonOpenText
          ? options.buttonCloseText
          : options.buttonOpenText,
      );

      // Switch the state.
      state = state === 'closed' ? 'open' : 'closed';

      // Emit 'toggle' event when clicked.
      $button.trigger('toggle', [$button, state]);
    }
  });
};
