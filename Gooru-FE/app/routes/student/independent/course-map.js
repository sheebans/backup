import Ember from 'ember';
import { ROLES, PLAYER_EVENT_SOURCE } from 'gooru-web/config/config';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  /**
   * @property {NavigateMapService}
   */
  navigateMapService: Ember.inject.service('api-sdk/navigate-map'),

  /**
   * @requires service:api-sdk/learner
   */
  learnerService: Ember.inject.service('api-sdk/learner'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Open the player with the specific collection/assessment
     *
     * @function actions:playItem
     * @param {string} unitId - Identifier for a unit
     * @param {string} lessonId - Identifier for lesson
     * @param {string} item - collection, assessment, lesson or resource
     */
    studyPlayer: function(type, unitId, lessonId, item) {
      const route = this;
      const currentCourse = route.modelFor('student.independent').course;
      const courseId = currentCourse.get('id');

      if (type === 'lesson') {
        route.startLessonStudyPlayer(courseId, unitId, lessonId);
      } else {
        route.startCollectionStudyPlayer(courseId, unitId, lessonId, item);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods
  model: function() {
    const route = this;
    const userId = route.get('session.userId');
    const course = this.modelFor('student.independent').course;
    const units = course.get('children') || [];
    let userLocation = route
      .get('learnerService')
      .fetchLocationCourse(course.get('id'), userId);
    return Ember.RSVP.hash({
      course,
      units,
      userLocation
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    let userLocation = '';
    if (model.userLocation) {
      let unitId = model.userLocation.get('unitId');
      let lessonId = model.userLocation.get('lessonId');
      let collectionId = model.userLocation.get('collectionId');
      userLocation = `${unitId}+${lessonId}+${collectionId}`;
    }
    controller.set('userLocation', userLocation);
    controller.set('units', model.units);
    controller.set('course', model.course);
    controller.get('studentIndependentController').selectMenuItem('course-map');
  },

  /**
   * Navigates to collection
   * @param {string} courseId
   * @param {string} unitId
   * @param {string} lessonId
   * @param {Collection} collection
     */
  startCollectionStudyPlayer: function(courseId, unitId, lessonId, collection) {
    let role = ROLES.STUDENT;
    let source = PLAYER_EVENT_SOURCE.INDEPENDENT_ACTIVITY;
    let collectionId = collection.get('id');
    let collectionType = collection.get('collectionType');
    let queryParams = {
      classId: null,
      unitId,
      lessonId,
      collectionId,
      role,
      source,
      type: collectionType
    };

    this.get('navigateMapService')
      .startCollection(courseId, unitId, lessonId, collectionId, collectionType)
      .then(() => this.transitionTo('study-player', courseId, { queryParams }));
  },

  /**
   * Navigates to the next lesson collection
   * @param {string} courseId
   * @param {string} unitId
   * @param {string} lessonId
     */
  startLessonStudyPlayer: function(courseId, unitId, lessonId) {
    const role = ROLES.STUDENT;
    const queryParams = {
      unitId,
      lessonId,
      role,
      source: PLAYER_EVENT_SOURCE.INDEPENDENT_ACTIVITY
    };
    this.get('navigateMapService')
      .startLesson(courseId, unitId, lessonId)
      .then(() => this.transitionTo('study-player', courseId, { queryParams }));
  }
});
