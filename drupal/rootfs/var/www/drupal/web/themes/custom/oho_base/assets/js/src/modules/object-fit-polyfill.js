/**
 * @file
 *
 * A simple object-fit polyfill.
 *
 * @dependency Modernizr
 */

/**
 * A simple object-fit polyfill.
 *
 * Searches an element's children for an image, then adds that image's source to
 * the element as a background image along with the compat-object-fit class.
 */
$.fn.ohoObjectFit = function ohoObjectFit() {
  if (undefined === Modernizr || Modernizr.objectfit) {
    return;
  }

  const $element = $(this);

  const src = $element.find('img').prop('src');

  if (src) {
    $element
      .css('backgroundImage', `url(${src})`)
      .addClass('compat-object-fit');
  }
};
