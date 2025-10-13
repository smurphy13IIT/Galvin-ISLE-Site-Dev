/**
 * @file
 * objectFitPolyfill function.
 */

/**
 * An object-fit polyfill for browsers that do not support object-fit. Searches
 * the style sheet for selectors using object-fit, then adds the image to the
 * parent node as a background image, while hiding the original.
 */
function objectFitPolyfill() {
  // Only if Modernizr detects no object-fit capability.
  if (undefined === Modernizr || Modernizr.objectfit) {
    return;
  }

  /**
   * Run the polyfill on a selector, given the selector's CSS properties.
   *
   * @param {string} selector
   *   The image selector to run the polyfill on.
   * @param {string} css
   *   The full CSS property string of this selector.
   */
  function polyfill(selector, css) {
    const images = document.querySelectorAll(selector);
    // We've already checked for object-fit before running this function.
    const objectFit = css.match(/object-fit:\s*([^;]+);/)[1];
    const positionMatch = css.match(/object-position:\s*([^;]+);/);
    const objectPosition =
      positionMatch instanceof Array ? positionMatch[1] : null;

    // If object-fit is cover or contain, do the following for each image:
    // 1. Add the image src to the parent element as a background-image.
    // 2. Set the background-size as cover or contain.
    // 3. Set the background-position on based on background-position.
    // 4. Set the display of the parent element to block.
    // 5. Hide the image by making it transparent.
    // 6. Add the class 'object-fit-polyfill' to the parent element.
    images.forEach(image => {
      const src = image.getAttribute('src');
      image.parentElement.style.backgroundImage = `url(${src})`;
      image.parentElement.style.backgroundSize = objectFit;
      if (objectPosition) {
        image.parentElement.style.backgroundPosition = objectPosition;
      }
      image.parentElement.style.display = 'block';
      image.style.opacity = 0;
      image.parentElement.classList.add('object-fit-polyfill');
    });
  }

  // Search the style sheets for theme.css.
  document.styleSheets.forEach(styleSheet => {
    if (styleSheet.href.includes('theme.css')) {
      // Search the rules.
      styleSheet.cssRules.forEach(rule => {
        // It's a style rule and has object-fit.
        if (
          rule instanceof CSSStyleRule &&
          rule.cssText.includes('object-fit')
        ) {
          polyfill(rule.selectorText, rule.cssText);
        }
        // It's a media query rule, so seach within.
        if (rule instanceof CSSMediaRule) {
          rule.cssRules.forEach(mediaRule => {
            if (mediaRule.cssText.includes('object-fit')) {
              polyfill(mediaRule.selectorText, mediaRule.cssText);
            }
          });
        }
      });
    }
  });
}

objectFitPolyfill();
