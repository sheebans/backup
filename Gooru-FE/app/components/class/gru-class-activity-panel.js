import Ember from 'ember';

/**
 * Class Activity Panel
 *
 * Panel that displays a collection/assessment information
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-class-activity-panel', 'panel'],

  classNameBindings: [
    'visible:visibility_on:visibility_off',
    'item.isAssessment:assessment:collection',
    'item.visible:item-enabled:item-disabled',
    'item.isOnAir:on-air'
  ],

  tagName: 'li',

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * @function changeVisibility
     */
    changeVisibility: function(classActivity) {
      this.sendAction('onChangeVisibility', classActivity);
    },

    /**
     * @function goLive
     */
    goLive: function(collectionId) {
      this.sendAction('onGoLive', collectionId);
    },

    /**
     * @function removeClassActivity
     */
    removeClassActivity: function(classActivity) {
      this.sendAction('onRemoveClassActivity', classActivity);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didRender: function() {
    this.$('[data-toggle="tooltip"]').tooltip();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ClassActivity}
   */
  classActivity: null,

  /**
   * @property {Collection/Assessment} item
   */
  item: Ember.computed.alias('classActivity.collection'),

  /**
   * @property {CollectionPerformanceSummary}
   */
  collectionPerformanceSummary: Ember.computed.alias(
    'classActivity.activityPerformanceSummary.collectionPerformanceSummary'
  ),

  /**
   * @property {boolean}
   */
  visible: Ember.computed.alias('classActivity.isActive'),

  /**
   * @property {string} go live action name
   */
  onGoLive: 'goLive',

  /**
   * @property {string} changeVisibility action name
   */
  onChangeVisibility: 'changeVisibility'
});
