import Ember from 'ember';
import { PLAYER_EVENT_SOURCE } from 'gooru-web/config/config';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {Service} session service
   */
  session: Ember.inject.service('session'),
  /**
   * @type {Service} i18n
   */
  i18n: Ember.inject.service(),
  // -------------------------------------------------------------------------
  // Attributes

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Launch an assessment goLive
     *
     * @function actions:goLive
     */
    goLive: function(collectionId) {
      const currentClass = this.modelFor('teacher.class').class;
      const classId = currentClass.get('id');
      const queryParams = {
        queryParams: { source: PLAYER_EVENT_SOURCE.COURSE_MAP }
      };
      this.transitionTo(
        'reports.collection',
        classId,
        collectionId,
        queryParams
      );
    },
    /**
     * Launch an assessment on-air
     *
     * @function actions:launchOnAir
     */
    launchOnAir: function(collectionId) {
      const currentClass = this.modelFor('teacher.class').class;
      const classId = currentClass.get('id');
      this.transitionTo('reports.collection', classId, collectionId);
    },

    /**
     * Open the player with the specific collection/assessment
     *
     * @function actions:playItem
     * @param {string} unitId - Identifier for a unit
     * @param {string} lessonId - Identifier for lesson
     * @param {string} collection - collection or assessment
     */
    playResource: function(unitId, lessonId, collection) {
      if (collection.get('isExternalAssessment')) {
        window.open(collection.get('url'));
      } else {
        const currentClass = this.modelFor('teacher.class').class;
        const classId = currentClass.get('id');
        const courseId = currentClass.get('courseId');
        const role = 'teacher';
        this.transitionTo(
          'context-player',
          classId,
          courseId,
          unitId,
          lessonId,
          collection.get('id'),
          {
            queryParams: { role: role, type: collection.get('collectionType') }
          }
        );
      }
    },

    /**
     * Edit content action, when clicking Edit content on Class Overview
     * @param {Content/Course}
     */
    editContent: function(id, classId) {
      let queryParams = { classId: classId };
      this.transitionTo('content.courses.edit', id, { queryParams });
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    const currentClass = this.modelFor('teacher.class').class;
    const userId = this.get('session.userId');
    if (currentClass.isTeacher(userId) && !currentClass.get('courseId')) {
      this.transitionTo('teacher.class.quick-start');
    }
  },

  model: function() {
    const route = this;
    const currentClass = route.modelFor('teacher.class').class;
    const course = route.modelFor('teacher.class').course;
    const units = course.get('children') || [];
    const classMembers = currentClass.get('members');
    return Ember.RSVP.hash({
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
    controller.set('units', model.units);
    controller.set('course', model.course);
    controller.set('classMembers', model.classMembers);
    controller.get('classController').selectMenuItem('course-map');
  }
});
