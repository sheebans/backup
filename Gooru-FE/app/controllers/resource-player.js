import Ember from 'ember';

/**
 * Study Player Controller
 *
 * @module
 * @augments ember/PlayerController
 */
export default Ember.Controller.extend({
  queryParams: [
    'collectionUrl',
    'unitId',
    'lessonId',
    'collectionId',
    'pathId',
    'source',
    'collectionType'
  ],

  actions: {

  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean}
   */
  isDone: false,

  /**
   * Show the next button and send events
   * @property {Boolean} sendEvents
   */
  sendEvents: Ember.computed.not('collectionUrl'),

  /**
   * Extracted the course version from course object
   * @property {String}
   */
  courseVersion: Ember.computed.alias('course.version')
});
