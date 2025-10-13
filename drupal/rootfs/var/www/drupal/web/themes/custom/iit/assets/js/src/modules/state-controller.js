/**
 * @file
 * StateController class.
 */

import EventEmitter from 'events';

/**
 * The state controller class provides an interface for adding, updating, and
 * removing items from a collection and emits events on addition, update, and
 * removal. This allows the state controller to act as a common interface to
 * keep distinct or unrelated components in sync.
 * @fires StateController#update
 */
export default class StateController extends EventEmitter {
  /**
   * Set the object's initial state.
   * @constructor
   */
  constructor() {
    super();
    /** @type {Object} - An object to hold the items. */
    this.items = {};
  }

  /**
   * Add an item to the collection.
   * @param {Number|String} key - A unique identifying key for the item.
   * @param {*} item - The item.
   * @return {Boolean} - True or false, depending on if the item was added.
   */
  add(key, item) {
    // If the key already exists, stop.
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      return false;
    }
    this.items[key] = item;
    /**
     * Emit an 'update' event when an item is added.
     * @event StateController#update
     * @type {Object}
     * @property {Object} items - All current items, including the added item.
     * @property {Number|String} - The unique identifying key of the added item.
     * @property {*} item - The added item.
     * @propety (String) action - The triggering action, in this case, 'add'.
     */
    this.emit('update', { items: this.items, key, item, action: 'add' });
    return true;
  }

  /**
   * Get an item added to the collection.
   * @param {Number|String} key - The unique identifying key of the item to get.
   * @param {*} [defaultValue=false] - The default return value if no item
   *   matching the key is found.
   * @return {*} - The matching item, or the default value if the key in not
   *   found.
   */
  get(key, defaultValue = false) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      return this.items[key];
    }
    return defaultValue;
  }

  /**
   * Update an item added to the collection.
   * @param {Number|String} key - The unique identifying key of the item to
   *   update.
   * @param {*} item - The update item value.
   * @param {Boolean} addIfMissing - If the key does not exist, add the item,
   *   otherwise do not add the item.
   * @return {Boolean} - True or false, depending on if the item was updated.
   */
  update(key, item, addIfMissing = false) {
    if (!Object.prototype.hasOwnProperty.call(this.items, key)) {
      return addIfMissing ? this.add(key, item) : false;
    }
    this.items[key] = item;
    /**
     * Emit an 'update' event when an item is updated.
     * @event StateController#update
     * @type {Object}
     * @property {Object} items - All current items, including the updated item.
     * @property {Number|String} - The unique identifying key of the updated
     *   item.
     * @property {*} item - The updated item.
     * @propety (String) action - The triggering action, in this case, 'update'.
     */
    this.emit('update', { items: this.items, key, item, action: 'update' });
    return true;
  }

  /**
   * Remove an item in the collection.
   * @param {Number|String} key - The unique identifying key of the item to
   *   remove.
   * @return {Boolean} - True or false, depending on if the item was removed.
   */
  remove(key) {
    // If the key does not exist, stop.
    if (!Object.prototype.hasOwnProperty.call(this.items, key)) {
      return false;
    }
    const item = this.items[key];
    delete this.items[key];
    /**
     * Emit an 'update' event when an item is removed.
     * @event StateController#update
     * @type {Object}
     * @property {Object} items - All current items, including the removed item.
     * @property {Number|String} - The unique identifying key of the removed
     *   item.
     * @property {*} item - The removed item.
     * @propety (String) action - The triggering action, in this case, 'remove'.
     */
    this.emit('update', { items: this.items, key, item, action: 'remove' });
    return true;
  }

  /**-
   * Reset the item collection to a specific state.
   * @param {Object} [state={}] - The state to set the items object to.
   * @return {Boolean} - True, after the reset has happened.
   */
  reset(state = {}) {
    this.items = {};
    /**
     * Emit an 'update' event when the collection is reset.
     * @event StateController#update
     * @type {Object}
     * @property {Object} items - All current items after reset.
     * @property {Object} state - The state that the collection was set to.
     * @propety (String) action - The triggering action, in this case, 'reset'.
     */
    this.emit('update', { items: this.items, state, action: 'reset' });
    return true;
  }
}
