/**
 * @file
 * jQuery plugin to determine whether an element is in the viewport.
 */

/**
 * In viewport function.
 *
 * @return {bool} - True if the element is visible, false otherwise.
 */
$.fn.ohoInViewport = function ohoInViewport() {
  const $this = $(this);
  const $window = $(window);

  const elementTop = $this.offset().top;
  const elementBottom = elementTop + $this.outerHeight();
  const viewportTop = $window.scrollTop();
  const viewportBottom = viewportTop + $window.height();

  return elementBottom > viewportTop && elementTop < viewportBottom;
};
