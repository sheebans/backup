import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-resources'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of resources to be displayed by the component
   *
   * @constant {Array}
   */
  results: null,

  /**
   * Indicates if the reaction bar is visible
   * @property {boolean}
   */
  showReactionBar: true
});
