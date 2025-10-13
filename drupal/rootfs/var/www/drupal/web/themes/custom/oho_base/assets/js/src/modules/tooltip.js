/**
 * @file
 * JavaScript for tooltips.
 *
 * @todo: Could use some cleanup & optimizations.
 */

export default function ohoTooltip() {
  $(document).mousemove(event => {
    const currentMousePos = { x: 0, y: 0 };
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
    if ($('.xy-mouse-position').length) {
      $('.xy-mouse-position').text(
        `Postion X:${currentMousePos.x} Position Y:${currentMousePos.y}`,
      );
    }

    $('.tooltip-box-toggle').click(toggleClick => {
      const $tooltipBox = $(toggleClick.target)
        .parents('.has-tooltip-box')
        .siblings('.tooltip-box');

      $(toggleClick.target).toggleClass('tooltip-box-toggle--active');
      $tooltipBox.toggleClass('tooltip-box--active');

      // Tooltip positioning
      // We get the X and Y coordinates of the mouse on click
      // and we set the values via CSS to the left and right
      $tooltipBox.css({
        left: currentMousePos.x,
        top: currentMousePos.y,
      });
    });
  });

  $('.tooltip-box i').click(event => {
    $(event.target)
      .parents('.tooltip-box')
      .removeClass('tooltip-box--active');
    $(event.target)
      .parents('.tooltip-box')
      .siblings('.has-tooltip-box')
      .children('.tooltip-box-toggle')
      .removeClass('tooltip-box-toggle--active');
  });
}
