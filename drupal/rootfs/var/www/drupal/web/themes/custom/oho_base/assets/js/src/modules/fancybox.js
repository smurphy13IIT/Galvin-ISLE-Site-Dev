/**
 * @file
 * JavaScript to load fancybox.
 */

import '@fancyapps/fancybox';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';

export default function ohoFancybox() {
  $('[data-fancybox-open]').click(event => {
    const target = $(event.target).attr('data-fancybox-open');
    const $target = $(`[data-fancybox-modal="${target}"]`);
    $.fancybox.open({
      src: $target,
      type: 'inline',
    });
  });
}
