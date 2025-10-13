/**
 * @file
 * JavaScript which watches the window state and emits events based on state
 * change.
 */

/**
 * Add window behavior.
 *
 * This object does not do much on it's own, but only emits events when the page
 * is scrolled or resized. The intent of this object is to provide a common
 * interface for adding additional behaviors.
 *
 * Emits events:
 *   - 'resized', when the page is resized. Provides four variables, the
 *     current height of the window, the current width of the window, the
 *     current scroll positon, and the current maximum height of the document.
 *   - 'scrolled', when the page is scrolled. Provides three variables, the
 *     current scroll position, the maximum height of the document, and the
 *     direction of the last scroll.
 *   - 'all', when the page is scrolled or resized. Provides five variables, the
 *     current height of the window, the current width of the window, the
 *     current scroll positon, the current maximum height of the document, and
 *     the direction of the last scroll.
 */
$.fn.ohoWindow = () => {
  // Create the window and document objects.
  const $window = $(window);
  const $document = $(document);

  // Set the scroll and size tracking to null initially.
  let lastScroll = null;
  let lastSize = null;

  /**
   * Update logic. Used as a callback for requestAnimationFrame().
   *
   * @param {Object} event - The original calling event, in this case 'load'.
   */
  function update(event) {
    // Get the window dimenions.
    const width = $window.width();
    const height = $window.height();

    // Constrain the currentScroll between 0 and the window height. This prevents
    // browsers that allow for a "bounce" behavior beyond the document from
    // calling scroll events with odd values during the bounce (mostly Safari).
    const maxHeight = $document.outerHeight() - height;
    const currentScroll = Math.min(Math.max(0, $window.scrollTop()), maxHeight);

    const currentSize = width.toString() + height.toString();

    let scrollDirection;

    // If the event is page load, or the scroll position hasn't changed, or the
    // window size hasn't changed, just stop to prevent firing multiple events.
    if (
      event.type === 'load' ||
      (lastScroll === currentScroll && lastSize === currentSize)
    ) {
      window.requestAnimationFrame(update);
      return;
    }

    // Emit 'scrolled' event on scroll and initial load.
    if (['load', 'scroll'].indexOf(event.type)) {
      scrollDirection = currentScroll > lastScroll ? 'down' : 'up';
      $window.trigger('scrolled', [currentScroll, maxHeight, scrollDirection]);
    }

    // Emit 'resize' event on resize and initial load.
    if (['load', 'resize'].indexOf(event.type)) {
      $window.trigger('resized', [width, height, currentScroll, maxHeight]);
    }

    // Emit 'all' event on any window changes.
    if (['load', 'scroll', 'resize'].indexOf(event.type)) {
      $window.trigger('all', [
        width,
        height,
        currentScroll,
        maxHeight,
        scrollDirection,
      ]);
    }

    // Record the current scroll position.
    lastScroll = currentScroll;

    // Record the current window size. Window size is a concatenated string of
    // width and height, so we can track changes in both directions.
    lastSize = currentSize;

    // Do it again.
    window.requestAnimationFrame(update);
  }

  // Scroll behavior. Calculate on load, on scroll, and on resize.
  $window.on('load scroll resize', update);
};

$(window).ohoWindow();
