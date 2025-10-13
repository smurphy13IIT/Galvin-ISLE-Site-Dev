/**
 * @file
 * ComponentBase class.
 */

import EventEmitter from 'events';

/**
 * The ComponentBase class provides component methods to easily extend and add
 * more complicated components. The class adds DOM objects from selectors,
 * provides options parsing from data attributes on the selectors, and provides
 * a basic run() method which calls both init() and resize(). These methods
 * should be defined in any classes which inherit from ComponentBase.
 *
 * See the Tab class in tabs.js for a good example of implementing this class.
 */
export default class ComponentBase extends EventEmitter {
  /**
   * Set the object's initial state.
   *
   * @constructor
   * @param {string} componentName
   *   The component name used in the component's inline data attribute options.
   */
  constructor(componentName = 'component-base') {
    super();
    this.name = componentName;
    this.items = [];
    this.options = [];
  }

  /**
   * Add elements.
   *
   * @param {HTMLElement|NodeList} elements
   *   Elements to add.
   * @return {ComponentBase}
   *   The current object, for method chaining.
   */
  add(elements) {
    if (Node.prototype.isPrototypeOf(elements)) {
      this.getOptions(elements);
      this.items.push(elements);
      return this;
    }
    if (NodeList.prototype.isPrototypeOf(elements)) {
      elements.forEach(element => {
        this.getOptions(element);
        this.items.push(element);
      });
      return this;
    }
  }

  /**
   * Run the behaviors on each added item.
   *
   * @return {ComponentBase}
   *   Returns the current object.
   */
  run() {
    this.init();
    this.resize();
    return this;
  }

  /**
   * Behaviors to run on initial load. This method should be overridden.
   *
   * @return {ComponentBase}
   *   Returns the current object.
   */
  init() {
    return this;
  }

  /**
   * Behaviors to run on resize. This method should be overridden.
   *
   * @return {ComponentBase}
   *   Returns the current object.
   */
  resize() {
    return this;
  }

  /**
   * Get the options for each item and attach them to the item object.
   *
   * @param {HTMLElement} item
   *   The item to make options for.
   */
  getOptions(item) {
    // Get the options passed on object creation and loop over them.
    const options = Object.entries(this.options);
    options.forEach(option => {
      const [key, value] = option;
      // Create the corresponding data attributes from the options name.
      const dataKey = `data-${this.name}-${ComponentBase.camelToKebab(key)}`;
      // If there is an option data attribute on the item, use that. If
      // not, use the default instead.
      const optionValue = item.hasAttribute(dataKey)
        ? item.getAttribute(dataKey)
        : value;
      // Add the option to the item.
      item[key] = optionValue;
    });
  }

  /**
   * Convert a string from camelCase to a kebab-case.
   *
   * Only works with alphabetic strings.
   *
   * @param {string} string
   *   The camelCased string to convert.
   * @return {string}
   *   A kebab-cased string or the original string if length is not long enough
   *   or has no camelCasing.
   */
  static camelToKebab(string) {
    // The string isn't long enough to split, return the original.
    if (string.length < 2) {
      return string;
    }
    const matches = string.match(/([a-z]+)([A-Z][a-z]+)/);
    // There are no camelCased pieces, return the original.
    if (matches === null || matches.length < 2) {
      return string;
    }
    matches.shift();
    return matches.join('-').toLowerCase();
  }
}
