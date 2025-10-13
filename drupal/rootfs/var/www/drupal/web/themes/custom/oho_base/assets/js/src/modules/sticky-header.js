/**
 * @file
 * JavaScript to add a sticky header.
 */

import './window';

export default function ohoStickyHeader() {
  const $window = $(window);
  const $header = $('.site-header');
  const $mainMenuContainer = $('.main-menu');
  const headerOffset = $header.offset().top;

  // Add the resize event listener.
  $window.on('resized', (resizeEvent, width) => {
    // Above 1024px, add the event listener once.
    if (width > 1024) {
      $window.one(
        'scrolled',
        (scrollEvent, scrollPosition, maxScrollPosition, scrollDirection) => {
          // If the header is offscreen, add the sticky class.
          const headerHeight =
            $header.outerHeight() -
            $mainMenuContainer.outerHeight() +
            headerOffset;
          if (scrollPosition > headerHeight) {
            $mainMenuContainer.addClass('main-menu--sticky');
          } else {
            $mainMenuContainer.removeClass('main-menu--sticky');
          }

          // Show the menu if scrolling up or at the bottom.
          if (
            scrollDirection === 'up' ||
            scrollPosition === maxScrollPosition
          ) {
            $mainMenuContainer.addClass('main-menu--show');
          } else {
            $mainMenuContainer.removeClass('main-menu--show');
          }
        },
      );
    }
    // Below 1024px, remove the event listener.
    else {
      $window.off('scrolled');
    }
  });
}
