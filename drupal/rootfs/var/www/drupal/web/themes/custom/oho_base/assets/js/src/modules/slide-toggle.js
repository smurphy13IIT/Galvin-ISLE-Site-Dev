/**
 * @file
 * JavaScript for a sliding toggle.
 */

/**
 * Update the variables needed for the slide toggle.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - hover: Whether or not to run the slide toggle on hover. Defaults to the
 *     [data-item-open-text] attribute on the calling element or false if the
 *     attribute doesn't exist.
 *   - buttonSelector: The selector of the button elements. Defaults to
 *     '.slide-toggle__button'.
 */
$.fn.ohoSlideToggle = function ohoSlideToggle(args = {}) {
  // Alias the window.
  const $window = $(window);

  // Do this for every one, allows for multiples on a page.
  $(this).each((slideToggleIndex, slideToggleElement) => {
    // Alias the toggle.
    const $slideToggle = $(slideToggleElement);

    // Defaults
    const defaults = {
      hover: $slideToggle.attr('data-slide-toggle-hover'),
      buttonSelector: '.slide-toggle__button',
    };

    // Create options from supplied and defaults.
    const options = $.fn.extend({}, defaults, args);

    /**
     * Update the variables to reflect the current button element.
     *
     * @param {Object} $element
     *   The jQuery button element to toggle.
     */
    function update($element) {
      const $parent = $element.parent();
      const scale = $element.outerWidth(true) / 100;
      const offset = $element.position().left;
      // We have to use .attr() here and not .css() because jQuery will append
      // 'px' to the scale value when using the .css() method, and it was not
      // possible to add custom properties to the $.cssNumber object.
      $parent.attr(
        'style',
        `--slide-toggle-offset: ${offset}px; --slide-toggle-scale: ${scale}`,
      );
    }

    // Set the initial state on window load, not DOM ready, because we may need
    // fonts to load to calculate the correct initial button widths.
    $window.on('load', () => {
      update($slideToggle.children());
    });

    // Hover behaviors.
    if (options.hover === 'true') {
      $slideToggle.find('li').hover(
        // Hover on.
        event => {
          update($(event.target).parent());
        },
        // Hover off.
        () => {
          // If there is an active element, set that on hover off. Otherwise
          // just set the first item.
          const $active = $slideToggle.find('[aria-selected="true"]');
          if ($active.length) {
            update($active.parent());
          } else {
            update($slideToggle.find('li:first-child'));
          }
        },
      );
    }

    // Click behaviors.
    $slideToggle.find(options.buttonSelector).click(buttonClick => {
      const $button = $(buttonClick.target);
      // Update the element.
      update($button.parent());
      // Reset selected on the buttons and add it to the clicked the button.
      $slideToggle.find(options.buttonSelector).attr('aria-selected', 'false');
      $button.attr('aria-selected', 'true');
    });
  });
};
