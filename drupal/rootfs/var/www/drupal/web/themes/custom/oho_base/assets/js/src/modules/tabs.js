/**
 * @file
 * JavaScript to control the tabs.
 */

import './accordion';
import './window';

/**
 * Toggle tabs.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - breakpoint: The screen width at which to switch to accordions. This works
 *     as a max-width. Defaults to the [data-tab-breakpoint] attribute.
 *   - buttonContainer: The selector of the tab desktop buttons container.
 *     Defaults to '.tabs__buttons'.
 *   - buttonSelector: The selector of a tab desktop button. Defaults to
 *     '.tabs__button'.
 *   - contentSelector: The selector of the tab content, which is given a
 *     aria-hidden attribute on desktop and functions as the mobile accordion
 *     container on mobile. Defaults to '.mobile-accordion'.
 */
$.fn.ohoTabs = function ohoTabs(args = {}) {
  // Alias the calling element.
  const $tabs = $(this);

  // Aliias the window.
  const $window = $(window);

  // Do it for each tab individually.
  $tabs.each((tabIndex, tabElement) => {
    // Alias the calling element.
    const $tab = $(tabElement);

    // Defaults
    const defaults = {
      breakpoint: $tab.attr('data-tab-breakpoint'),
      buttonContainer: '.tabs__buttons',
      buttonSelector: '.tabs__button',
      contentSelector: '.accordion',
    };

    // Create options from supplied and defaults.
    const options = $.fn.extend({}, defaults, args);

    // Save the button container.
    const $buttonContainer = $tab.children(options.buttonContainer);

    // Save the tabs button elements.
    const $buttonElements = $buttonContainer.find(options.buttonSelector);

    // Save the tab contents.
    const $contents = $tab.children(options.contentSelector);

    /**
     * Show a particular tab.
     *
     * @param {int} index - The index of the tab to display.
     */
    function showTab(index) {
      $buttonElements.attr('aria-selected', 'false');
      $buttonElements.eq(index).attr('aria-selected', 'true');
      $contents.attr('aria-hidden', 'true');
      $contents.eq(index).attr('aria-hidden', 'false');
    }

    // Set the initial states.
    showTab(0);

    // Remove the buttons as we will add them back conditionally based on the
    // breakpoint below.
    $tab.children(options.buttonContainer).remove();

    // Add the resize event listener.
    $window.on('resized', (resizeEvent, currentWidth) => {
      // Below or equal to the breakpoint and the button does not already exist,
      // add the button and the accordion behavior.
      if (
        currentWidth <= options.breakpoint &&
        $tab.children(options.buttonContainer).length
      ) {
        $tab.children(options.buttonContainer).remove();
      }
      // Above the breakpoint and the buttons do not exist, add the buttons and
      // the tabs behavior.
      else if (
        currentWidth > options.breakpoint &&
        !$tab.children(options.buttonContainer).length
      ) {
        $tab.prepend($buttonContainer);
        $buttonElements.click(buttonClick =>
          showTab($buttonElements.index(buttonClick.target)),
        );
      }
    });
  });
};
