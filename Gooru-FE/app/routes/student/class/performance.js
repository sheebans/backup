import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------

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
      const classId = controller.get('classId');
      const collectionType = controller.get('collectionType');
      route.transitionTo('reports.student-collection-analytics', {
        queryParams: {
          classId,
          courseId,
          unitId,
          lessonId,
          collectionId: assessmentId,
          userId,
          type: collectionType,
          role: 'student'
        }
      });
    }
  },

  // -------------------------------------------------------------------------
  // Methods
  model: function() {
    const route = this;
    const course = route.modelFor('student.class').course;
    let classId = route.modelFor('student.class').class.id;
    let firstUnit = course.get('sortedUnitResults')[0];
    let firstLesson = firstUnit.get('sortedLessonResults')[0];
    return Ember.RSVP.hash({
      course,
      classId,
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
    controller.set('unitId', model.unitId);
    controller.set('lessonId', model.lessonId);
    controller.set('classId', model.classId);
    controller.loadData();
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
