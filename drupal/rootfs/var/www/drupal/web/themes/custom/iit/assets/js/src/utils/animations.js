/**
 * @file
 * Animation functions.
 */

/**
 * Make an element visible by sliding down.
 *
 * @param {HTMLElement} element
 *   The element to toggle.
 * @param {int} duration
 *   The duration in milliseconds.
 */
export function slideDown(element, duration = 500) {
  element.style.removeProperty('display');
  let { display } = window.getComputedStyle(element);
  if (display === 'none') {
    display = 'block';
  }
  element.style.display = display;
  const height = element.offsetHeight;
  element.style.overflow = 'hidden';
  element.style.height = 0;
  element.style.paddingTop = 0;
  element.style.paddingBottom = 0;
  element.style.marginTop = 0;
  element.style.marginBottom = 0;
  // Allow unused expression here, querying offsetHeight causes the browser to
  // recalculate the correct height.
  element.offsetHeight; // eslint-disable-line
  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = `${duration}ms`;
  element.style.transitionTimingFunction = 'ease-in-out';
  element.style.height = `${height}px`;
  element.style.removeProperty('padding-top');
  element.style.removeProperty('padding-bottom');
  element.style.removeProperty('margin-top');
  element.style.removeProperty('margin-bottom');
  window.setTimeout(() => {
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
  }, duration);
}

/**
 * Make an element hidden by sliding up.
 *
 * @param {HTMLElement} element
 *   The element to toggle.
 * @param {int} duration
 *   The duration in milliseconds.
 */
export function slideUp(element, duration = 500) {
  element.style.height = `${element.offsetHeight}px`;
  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = `${duration}ms`;
  element.style.transitionTimingFunction = 'ease-in-out';
  // Allow unused expression here, querying offsetHeight causes the browser to
  // recalculate the correct height.
  element.offsetHeight; // eslint-disable-line
  element.style.overflow = 'hidden';
  element.style.height = 0;
  element.style.paddingTop = 0;
  element.style.paddingBottom = 0;
  element.style.marginTop = 0;
  element.style.marginBottom = 0;
  window.setTimeout(() => {
    element.style.display = 'none';
    element.style.removeProperty('height');
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
  }, duration);
}

/**
 * Toggle the slideDown or slideUp, depending on the element's state.
 *
 * @param {HTMLElement} element
 *   The element to toggle.
 * @param {int} duration
 *   The duration in milliseconds.
 *
 * @see https://stackoverflow.com/questions/29949331/convert-jquery-slidetoggle-code-to-javascript
 */
export function slideToggle(element, duration = 500) {
  if (window.getComputedStyle(element).display === 'none') {
    slideDown(element, duration);
    return;
  }
  slideUp(element, duration);
}
