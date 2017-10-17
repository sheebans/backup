import Ember from 'ember';
import { CONTENT_TYPES, ROLES } from 'gooru-web/config/config';

/**
 * Study Player External Controller
 *
 * @module
 */
export default Ember.Controller.extend({
  queryParams: [
    'resourceId',
    'role',
    'type',
    'sourceId',
    'classId',
    'courseId',
    'collectionId',
    'source'
  ],

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {CourseMapService}
   */
  courseMapService: Ember.inject.service('api-sdk/course-map'),

  /**
   * @property {NavigateMapService}
   */
  navigateMapService: Ember.inject.service('api-sdk/navigate-map'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered for the next button
     */
    next: function() {
      this.playNextContent();
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {string}
   */
  classId: null,

  /**
   * @property {string}
   */
  courseId: null,

  /**
   * @property {string}
   */
  collectionId: null,

  /**
   * Indicates if it should show the back button
   * @property {boolean}
   */
  showBackButton: false,

  /**
   * @property {String} It decide to show the back to course map or not.
   */
  showBackToCourseMap: true,

  /**
   * Current map location
   * @property {MapLocation}
   */
  mapLocation: null,

  /**
   * Resets to default values
   */
  resetValues: function() {
    //TODO: call the parent reset values method
    this.setProperties({
      collectionId: null,
      resourceId: null,
      type: null
    });
  },

  /**
   * Extracted the course version from course object
   * @property {String}
   */
  courseVersion: Ember.computed.alias('course.version'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Navigate to study player to play next collection/assessment
   */
  toPlayer: function() {
    const context = this.get('mapLocation.context');
    let queryParams = {
      role: ROLES.STUDENT,
      source: this.get('source')
    };
    let classId = context.get('classId');
    if (classId) {
      queryParams.classId = classId;
    }
    this.transitionToRoute('study-player', context.get('courseId'), {
      queryParams
    });
  },

  playNextContent: function() {
    const navigateMapService = this.get('navigateMapService');
    const context = this.get('mapLocation.context');
    navigateMapService
      .getStoredNext()
      .then(() => navigateMapService.next(context))
      .then(mapLocation => {
        let status = (mapLocation.get('context.status') || '').toLowerCase();
        if (status === 'done') {
          this.setProperties({
            isDone: true,
            hasAnySuggestion: false
          });
        } else {
          this.toPlayer();
        }
      });
  }
});
