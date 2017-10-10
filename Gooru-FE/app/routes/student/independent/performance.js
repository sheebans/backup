import Ember from 'ember';
import { ROLES } from 'gooru-web/config/config';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {I18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

  /**
   * @type {CourseService}
   */
  courseService: Ember.inject.service('api-sdk/course'),

  actions: {
    /**
     * View Analytics Report
     * Triggered by gru-performance-table
     */
    viewReport: function(assessmentId) {
      const route = this;
      let controller = route.get('controller');
      const courseId = controller.get('course.id');
      const unitId = controller.get('unitId');
      const lessonId = controller.get('lessonId');
      const userId = controller.get('profile.id');
      const collectionType = controller.get('collectionType');
      route.transitionTo('reports.student-collection-analytics', {
        queryParams: {
          courseId,
          unitId,
          lessonId,
          collectionId: assessmentId,
          userId,
          type: collectionType,
          role: ROLES.STUDENT
        }
      });
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    const route = this;
    const course = route.modelFor('student.independent').course;
    let firstUnit = course.get('sortedUnitResults')[0];
    let firstLesson = firstUnit.get('sortedLessonResults')[0];
    return Ember.RSVP.hash({
      course,
      unitId: firstUnit ? firstUnit.get('id') : null,
      lessonId: firstLesson ? firstLesson.get('id') : null
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('course', model.course);
    controller.set('courseId', model.course.get('id'));
    controller.set('unitId', model.unitId);
    controller.set('lessonId', model.lessonId);
    controller.loadData();
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
