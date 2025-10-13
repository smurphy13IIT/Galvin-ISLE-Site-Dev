/**
 * @file
 * JavaScript to create a menu accessible through keyboard navigation.
 */

/**
 * Create an accessible menu.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - buttonClass: The class(es) to add to the button markup.
 *   - hasItemsSelector: The selector used to test whether a specific menu node.
 *     has menu items below it and should have a button added. Defaults to
 *     '.menu-item--expanded > a'.
 *   - itemCloseText: The button close text. Can include a '%s' string which is
 *     replaced with the text of the tree's anchor link. Defaults to the
 *     [data-item-close-text] attribute on the calling element.
 *   - itemOpenText: The button open text. Can include a '%s' string which is
 *     replaced with the text of the tree's anchor link. Defaults to the
 *     [data-item-open-text] attribute on the calling element.
 *   - itemOpenClass: Open class to add to the <li> when the menu is opened.
 *     Defaults to 'menu-item--open'.
 *   - itemRegex: Replacement regex pattern used in itemCloseText and
 *     itemOpenText. Defaults to '/%s/'.
 *
 * @events
 *   - 'toggled', when a menu item accessible button is toggled. Provides two
 *     variables, the button jQuery object which triggered the event and the
 *     current state of the button, either 'open' or 'closed'.
 */
$.fn.ohoAccessibleMenu = function ohoAccessibleMenu(args = {}) {
  // Alias the calling element.
  const $menu = $(this);

  // Menu defaults.
  const defaults = {
    buttonClass: 'menu-item__button',
    hasItemsSelector: '.menu-item--expanded > a, .menu-item--expanded > span',
    itemCloseText: $menu.attr('data-item-close-text'),
    itemOpenText: $menu.attr('data-item-open-text'),
    itemOpenClass: 'menu-item--open',
    itemRegex: /%s/,
  };

  // Create options.
  const options = $.fn.extend({}, defaults, args);

  // Add accessibile buttons to the menu links.
  $menu.find(options.hasItemsSelector).each((linkIndex, menuLink) => {
    // Save the link and get the link text.
    const $link = $(menuLink);
    const linkText = $link.text();

    // Create the button markup.
    const $button = $(
      `<button class="${options.buttonClass}">${options.itemOpenText.replace(
        options.itemRegex,
        linkText,
      )}</button>`,
    );

    // Add the button click behaviors. Toggle the class and switch button text.
    $button.click(clickEvent => {
      // Don't do the link.
      clickEvent.preventDefault();

      // Get the parent.
      const $parent = $button.parent();

      // Switch the class.
      $parent.toggleClass(options.itemOpenClass);

      // Record the state.
      const state = $parent.hasClass(options.itemOpenClass) ? 'open' : 'closed';

      // Switch the text.
      $button.text((buttonIndex, buttonValue) => {
        const openText = options.itemOpenText.replace(
          options.itemRegex,
          linkText,
        );
        const closeText = options.itemCloseText.replace(
          options.itemRegex,
          linkText,
        );
        return buttonValue === openText ? closeText : openText;
      });

      // Emit the event.
      $menu.trigger('toggled', [$button, state]);
    });

    // Insert the button after the link.
    $link.append($button);
  });
};
