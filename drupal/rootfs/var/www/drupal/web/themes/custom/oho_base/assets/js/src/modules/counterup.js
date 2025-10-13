/**
 * @file
 * JavaScript to start CounterUp2.
 */

import counterUp from 'counterup2';

require('./in-viewport.js');

$.fn.ohoCounterUp = function ohoCounterUp(args = {}) {
  const $elements = $(this);
  const $window = $(window);

  const runClass = 'count-up--run';

  const defaults = {
    duration: 1000,
    delay: 16,
  };

  const options = $.fn.extend({}, defaults, args);

  $elements.each(() => {
    const $element = $(this);
    $window.on('load resize scroll', () => {
      if (!$element.hasClass(runClass) && $element.ohoInViewport()) {
        $element.addClass(runClass);
        counterUp($element.get(0), options);
      }
    });
  });
};
