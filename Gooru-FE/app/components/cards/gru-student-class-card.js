import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['gru-student-class-card col-xs-12 col-md-6'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Class} class information
   */
  class: null,

  /**
   * @property {boolean} Show or not the current location
   */
  showCurrentLocation: Ember.computed.and(
    'class.currentLocation',
    'class.currentLocation.course',
    'class.currentLocation.unit',
    'class.currentLocation.lesson',
    'class.currentLocation.collection'
  ),

  /**
   * @property {Number} total
   * Computed property for performance total to add a default value
   */
  total: Ember.computed.alias('class.performanceSummary.total'),

  /**
   * @property {Number} totalCompleted
   * Computed property for performance total completed to add a default value
   */
  totalCompleted: Ember.computed.alias(
    'class.performanceSummary.totalCompleted'
  )
});
