import Ember from 'ember';
import { PLAYER_EVENT_SOURCE } from 'gooru-web/config/config';

/**
 * Student Class Activity Panel
 *
 * Panel that displays a collection/assessment information
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-student-class-activity-panel', 'panel'],

  classNameBindings: [
    'visible:visibility-on:visibility-off',
    'item.isAssessment:assessment:collection'
  ],

  tagName: 'li',

  // -------------------------------------------------------------------------
  // Actions

  actions: {},

  // -------------------------------------------------------------------------
  // Events

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
   * @property {String} source
   */
  source: PLAYER_EVENT_SOURCE.DAILY_CLASS,

  /**
   * @property {boolean}
   */
  visible: Ember.computed.alias('classActivity.isActive')
});
