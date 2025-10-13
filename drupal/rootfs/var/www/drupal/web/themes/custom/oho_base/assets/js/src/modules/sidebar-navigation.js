/**
 * @file
 *
 * Sidebar navigation behaviors.
 */

import './accessible-menu';
import './button-toggle';

/**
 * Add accessibility and toggle interactions to sidebar navigation.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - buttonClass: This option is passed to ohoAccessibleMenu(). See that
 *     method's definition for more information. This option needs to be the
 *     same as that method to use this out of the box with no custom changes.
 *   - itemActiveSelector: The selector denoting the active menu trail. Defaults
 *     to '.menu-item--active-trail'.
 *   - itemCloseText: This option is passed to ohoAccessibleMenu(). See that
 *     method's definition for more information. This option needs to be the
 *     same as that method to use this out of the box with no custom changes.
 *   - itemOpenText: This option is passed to ohoAccessibleMenu(). See that
 *     method's definition for more information. This option needs to be the
 *     same as that method to use this out of the box with no custom changes.
 *   - itemOpenClass: This option is passed to ohoAccessibleMenu(). See that
 *     method's definition for more information. This option needs to be the
 *     same as that method to use this out of the box with no custom changes.
 *   - itemRegex: This option is passed to ohoAccessibleMenu(). See that
 *     method's definition for more information. This option needs to be the
 *     same as that method to use this out of the box with no custom changes.
 *   - menuToggleButtonSelector: The selector of the mobile open and close
 *     button. Defaults to '.sidebar-menu__toggle'.
 *   - menuToggleButtonOpenClass: The open class to toggle on the mobile open
 *     and close button. Defaults to 'sidebar-menu__toggle--open'.
 */
$.fn.ohoSidebarNavigation = function ohoSidebarNavigation(args = {}) {
  // Alias the calling element.
  const $sidebar = $(this);

  // Options to pass to the accessible menu, and to use here.
  const defaults = {
    buttonClass: 'menu-item__button',
    itemActiveClass: 'menu-item--active-trail',
    itemCloseText: $sidebar.attr('data-item-close-text'),
    itemOpenText: $sidebar.attr('data-item-open-text'),
    itemOpenClass: 'menu-item--open',
    itemRegex: /%s/,
    menuToggleButtonSelector: '.sidebar-menu__toggle',
  };

  // Create the options from supplied and defaults.
  const options = $.fn.extend({}, defaults, args);

  // Make the menu accessible.
  $sidebar.ohoAccessibleMenu(options);

  // On toggle, slide the menu.
  $sidebar.on('toggled', (event, $button) => {
    $button
      .parent()
      .next()
      .slideToggle();
  });

  // Set the correct button text and classes on load.
  $sidebar
    .find(`.${options.buttonClass}`)
    .each((buttonIndex, buttonElement) => {
      const $this = $(buttonElement);
      // Can't use .text() here because text will get the button text as well,
      // which has already been set by ohoAccessibleMenu().
      const linkText = $this
        .parent()
        .contents()
        .get(0).nodeValue;

      if ($this.closest('li').hasClass(options.itemActiveClass)) {
        $this.parent().addClass(options.itemOpenClass);
        $this.text(options.itemCloseText.replace(options.itemRegex, linkText));
      }
    });

  // Add mobile button click behavior.
  const $mobiletoggle = $sidebar.find(options.menuToggleButtonSelector);
  $mobiletoggle.ohoButtonToggle();
  $mobiletoggle.on('toggle', (toggleEvent, $button) => {
    $button.next().slideToggle();
  });
};
