/**
 * @file
 * Automatically smooth scroll when using anchor links.
 */

import './variable-scroll-to';

/**
 * Create a jump link off an element with an hash href.
 *
 * @param {Object} args
 *   The options are passed directly to ohoVariableScrollTo. See that object's
 *   definition for more information on passable options.
 */
$.fn.ohoJumpLink = function ohoJumpLink(args = {}) {
  const $link = $(this);
  $link.click(() => {
    const id = $link.attr('href');
    const $target = $(id);
    $target.ohoVariableScrollTo(args);
  });
};
