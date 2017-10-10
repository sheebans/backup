import Ember from 'ember';
import { TAXONOMY_CATEGORIES } from 'gooru-web/config/config';

/**
 * Category component
 *
 * Component responsible for displaying/editing a category value
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Set Category
     */
    setCategory: function(categoryValue) {
      this.set('editCategory', categoryValue);
    }
  },

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'gru-category'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    var category = this.get('srcCategory');
    if (!category) {
      this.set('editCategory', TAXONOMY_CATEGORIES[0].value);
      this.set('srcCategory', TAXONOMY_CATEGORIES[0].value);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @type {Ember.A} categories - List of course categories
   */
  categories: TAXONOMY_CATEGORIES,

  /**
   * Is the course being edited or not?
   * @property {Boolean}
   */
  isEditing: null,

  /**
   * @type {String} Edited category value
   */
  editCategory: null,

  /**
   * @type {String} Initial category value
   */
  srcCategory: null
});
