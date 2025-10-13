/**
 * @file
 * jQuery plugin to smooth scroll to an anchor,
 * with a speed relative to distance traveled.
 */

/**
 * Variable scroll function.
 *
 * @param {Object} args - The args can take the following key/value pairs:
 *   - offset: An offset to add to the scroll target. Negative is up the page.
 *     Defaults to 0.
 *   - minDuration: The maximum duration of the scroll animation, in
 *     milliseconds. Defaults to 250.
 *   - maxDuration: The maximum duration of the scroll animation, in
 *     milliseconds. Defaults to 1000.
 *
 * @return {bool} - True if the animation runs, false otherwise.
 */
$.fn.ohoVariableScrollTo = function ohoVariableScrollTo(args = {}) {
  const $target = $(this);
  const $page = $('html, body');
  const stopScrollEvents =
    'scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove';

  if (!$target.length) {
    return false;
  }

  // Generate the options.
  const defaults = {
    offset: 0,
    minDuration: 250,
    maxDuration: 1000,
  };
  const options = $.fn.extend({}, defaults, args);

  // Get info about the current document and window state.
  const windowHeight = $(window).height();
  const documentHeight = $(document).height();
  const maxOffset = documentHeight - windowHeight;
  const currentPosition = $(window).scrollTop();
  const targetPosition = $target.offset().top + options.offset;

  // Calculate the scroll distance needed. Scroll distance can never be more
  // than the document height.
  const scrollDistance = Math.abs(
    currentPosition - Math.min(maxOffset, targetPosition),
  );

  // Calculate the speed needed based on the distance. Duration can never be
  // more than options.maxDuration or less than options.minDuration.
  let calculatedDuration = options.maxDuration * (scrollDistance / maxOffset);
  calculatedDuration = Math.min(
    Math.max(calculatedDuration, options.minDuration),
    options.maxDuration,
  );

  // Allow the stopping of scroll behaviors by events in the stopScrollEvents
  // variable. We don't want to continue scrolling if the user decides to
  // interact with the page. We also don't want to continue the current
  // animation if the user interacts with a new scroll animation before the
  // current animation is finished.
  $page.on(stopScrollEvents, () => {
    $page.stop();
  });

  // Scroll to, smoothly.
  $page.animate(
    {
      scrollTop: targetPosition,
    },
    calculatedDuration,
    () => {
      $page.off(stopScrollEvents);
    },
  );

  // Set focus after.
  $target.focus();
  if (!$target.is(':focus')) {
    $target.attr('tabindex', '-1');
    $target.focus();
  }
};
