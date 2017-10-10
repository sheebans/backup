import Ember from 'ember';
import { ROLES, PLAYER_EVENT_SOURCE } from 'gooru-web/config/config';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  i18n: Ember.inject.service(),

  profileService: Ember.inject.service('api-sdk/profile'),
  /**
   * @requires service:api-sdk/analytics
   */
  analyticsService: Ember.inject.service('api-sdk/analytics'),

  /**
   * @property {NavigateMapService}
   */
  navigateMapService: Ember.inject.service('api-sdk/navigate-map'),

  // -------------------------------------------------------------------------
  // Attributes

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    studyNow: function() {
      const route = this;
      const currentClass = route.modelFor('student.class').class;
      const classId = currentClass.get('id');
      const courseId = currentClass.get('courseId');

      route.continueCourseStudyPlayer(classId, courseId);
    },

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
      const currentClass = route.modelFor('student.class').class;
      const classId = currentClass.get('id');
      const courseId = currentClass.get('courseId');

      if (type === 'lesson') {
        route.startLessonStudyPlayer(classId, courseId, unitId, lessonId);
      } else if (type === 'resource') {
        route.startResourceStudyPlayer(classId, courseId, item);
      } else {
        route.startCollectionStudyPlayer(
          classId,
          courseId,
          unitId,
          lessonId,
          item
        );
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods
  model: function() {
    const route = this;
    const currentClass = route.modelFor('student.class').class;
    const course = route.modelFor('student.class').course;
    const units = route.modelFor('student.class').units;
    const userId = route.get('session.userId');
    const classMembers = currentClass.get('members');
    const userLocation = route
      .get('analyticsService')
      .getUserCurrentLocation(currentClass.get('id'), userId);

    return Ember.RSVP.hash({
      userLocation: userLocation,
      course: course,
      units: units,
      currentClass: currentClass,
      classMembers: classMembers
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
    controller.set('classMembers', model.classMembers);
    controller.get('studentClassController').selectMenuItem('course-map');
  },

  /**
   * Navigates to collection
   * @param {string} classId
   * @param {string} courseId
   * @param {string} unitId
   * @param {string} lessonId
   * @param {Collection} collection
     */
  startCollectionStudyPlayer: function(
    classId,
    courseId,
    unitId,
    lessonId,
    collection
  ) {
    let route = this;
    let role = ROLES.STUDENT;
    let source = PLAYER_EVENT_SOURCE.COURSE_MAP;
    let collectionId = collection.get('id');
    let collectionType = collection.get('collectionType');
    let collectionSubType = collection.get('collectionSubType');
    let pathId = collection.get('pathId') || 0;
    let queryParams = {
      classId,
      unitId,
      lessonId,
      collectionId,
      role,
      source,
      type: collectionType,
      subtype: collectionSubType,
      pathId
    };

    let suggestionPromise = null;
    // Verifies if it is a suggested Collection/Assessment
    if (collectionSubType) {
      suggestionPromise = route
        .get('navigateMapService')
        .startSuggestion(
          courseId,
          unitId,
          lessonId,
          collectionId,
          collectionType,
          collectionSubType,
          pathId,
          classId
        );
    } else {
      suggestionPromise = route
        .get('navigateMapService')
        .startCollection(
          courseId,
          unitId,
          lessonId,
          collectionId,
          collectionType,
          classId
        );
    }

    suggestionPromise.then(() =>
      route.transitionTo('study-player', courseId, { queryParams })
    );
  },

  /**
   * Navigates to the next lesson collection
   * @param {string} classId
   * @param {string} courseId
   * @param {string} unitId
   * @param {string} lessonId
     */
  startLessonStudyPlayer: function(classId, courseId, unitId, lessonId) {
    const route = this;
    const role = ROLES.STUDENT;
    const queryParams = {
      classId,
      unitId,
      lessonId,
      role,
      source: PLAYER_EVENT_SOURCE.COURSE_MAP
    };
    route
      .get('navigateMapService')
      .startLesson(courseId, unitId, lessonId, classId)
      .then(() =>
        route.transitionTo('study-player', courseId, { queryParams })
      );
  },

  /**
   * Resumes or start the course study player
   * @param {string} classId
   * @param {string} courseId
     */
  continueCourseStudyPlayer: function(classId, courseId) {
    const route = this;
    const queryParams = {
      role: ROLES.STUDENT,
      source: PLAYER_EVENT_SOURCE.COURSE_MAP,
      classId
    };
    route
      .get('navigateMapService')
      .continueCourse(courseId, classId)
      .then(() =>
        route.transitionTo('study-player', courseId, { queryParams })
      );
  },

  /**
   * Navigates to resourse
   * @param {string} classId
   * @param {string} courseId
   * @param {Resource} resource
   */
  startResourceStudyPlayer: function(classId, courseId, resource) {
    const route = this;
    let queryParams = {
      unitId: resource.get('unitId'),
      lessonId: resource.get('lessonId'),
      collectionId: resource.get('assessmentId'),
      source: PLAYER_EVENT_SOURCE.COURSE_MAP,
      pathId: resource.get('pathId')
    };
    route
      .get('navigateMapService')
      .startResource(
        courseId,
        queryParams.unitId,
        queryParams.lessonId,
        queryParams.collectionId,
        resource.get('id'),
        queryParams.pathId,
        classId
      )
      .then(function() {
        route.transitionTo('resource-player', classId, courseId, resource.id, {
          queryParams
        });
      });
  }
});
