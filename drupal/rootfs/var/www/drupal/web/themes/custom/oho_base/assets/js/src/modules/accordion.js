/**
 * @file
 * JavaScript to control the accordions.
 */

import './window';

/**
 * Toggle an accordion.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - animationDuration: The duration of the toggle animation, in ms. Defaults
 *     to 400.
 *   - openText: The accordion open text, which is prepended to the
 *     accordion label. Defaults to the [data-accordion-open-text] attribute on the
 *     calling element.
 *   - closeText: The accordion close text, which is prepended to the
 *     accordion label. Defaults to the [data-accordion-close-text] attribute on the
 *     calling element.
 *   - openClass: Open class to add to the calling element when the
 *     accordion is opened. Defaults to 'accordion--open'.
 *   - buttonSelector: The selector of the accordion button. Defaults to
 *     '.accordion__button'.
 *   - contentSelector: The selector of the accordion content. Defaults to
 *     '.accordion__content'.
 *   - textElementSelector: The selector of the element which contains the
 *     toggled text. Defaults to '.show-for-sr'.
 *   - breakpoint: The accordion breakpoint, at which above the accordion does
 *     not display. Useful for making a mobile-only accordion. Defaults to the
 *     [data-accordion-breakpoint] attribute on the calling element. Leave empty
 *     for a standard accordion.
 */
$.fn.ohoAccordion = function ohoAccordion(args = {}) {
  // On every accordion.
  $(this).each((accordionIndex, accordionElement) => {
    // Alias the calling element.
    const $accordion = $(accordionElement);

    // Defaults
    const defaults = {
      animationDuration: 400,
      openText: $accordion.attr('data-accordion-open-text'),
      closeText: $accordion.attr('data-accordion-close-text'),
      openClass: 'accordion--open',
      buttonSelector: '.accordion__button',
      contentSelector: '.accordion__content',
      textElementSelector: '.show-for-sr',
      breakpoint: $accordion.attr('data-accordion-breakpoint'),
    };

    // Create options from supplied and defaults.
    const options = $.fn.extend({}, defaults, args);

    // Get the accordion text element.
    const $textElement = $accordion
      .children(options.buttonSelector)
      .find(options.textElementSelector);

    // Set the initial state, if the text is not already set.
    if (!$textElement.text().length) {
      $textElement.text(options.openText);
    }

    // Add the click behavior.
    $accordion.children(options.buttonSelector).on('click', event => {
      event.preventDefault();
      $accordion.toggleClass(options.openClass);
      $accordion
        .children(options.contentSelector)
        .slideToggle(options.animationDuration);
      $textElement.text((buttonIndex, buttonValue) =>
        buttonValue === options.openText ? options.closeText : options.openText,
      );
    });

    // Mobile accordion, add breakpoint behaviors.
    if (undefined !== options.breakpoint) {
      // Alias the window.
      const $window = $(window);

      // Alias the button.
      const $button = $accordion.children(options.buttonSelector);

      // Add the resize event listener.
      $window.on('resized', (event, currentWidth) => {
        // Below or equal to the breakpoint and the button does not already exist,
        // add the button and the accordion behavior.
        if (currentWidth <= options.breakpoint) {
          $button.attr('disabled', false);
        }
        // Above the breakpoint and the button exists, remove the button and click
        // handler.
        else if (currentWidth > options.breakpoint) {
          $button.attr('disabled', true);
        }
      });
    }
  });
};
