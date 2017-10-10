import Ember from 'ember';
import StudentCollection from 'gooru-web/routes/reports/student-collection';

/**
 *
 * Analytics data for a student related to a collection of resources
 * Gathers and passes the necessary information to the controller
 *
 * @module
 * @augments ember/Route
 */
export default StudentCollection.extend({
  templateName: 'reports/study-student-collection',

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {NavigateMapService}
   */
  navigateMapService: Ember.inject.service('api-sdk/navigate-map'),

  /**
   * @type {UnitService} Service to retrieve course information
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @type {UnitService} Service to retrieve unit information
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  /**
   * @type {LessonService} Service to retrieve unit information
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ assessmentId: string, resourceId: string }} params
   */
  model(params) {
    let route = this;
    let courseId = params.courseId;
    let unitId = params.unitId;
    let lessonId = params.lessonId;
    let navigateMapService = route.get('navigateMapService');
    let studentCollectionModel;
    return route
      .studentCollectionModel(params)
      .then(collectionModel => {
        studentCollectionModel = collectionModel;
        return Ember.RSVP.hash({
          course: route.get('courseService').fetchById(courseId),
          unit: route.get('unitService').fetchById(courseId, unitId),
          lesson: route
            .get('lessonService')
            .fetchById(courseId, unitId, lessonId),
          mapLocation: navigateMapService.getStoredNext()
        });
      })
      .then(function(hash) {
        // Set the correct unit sequence number
        hash.course.children.find((child, index) => {
          let found = false;
          if (child.get('id') === hash.unit.get('id')) {
            found = true;
            hash.unit.set('sequence', index + 1);
          }
          return found;
        });

        // Set the correct lesson sequence number
        hash.unit.children.find((child, index) => {
          let found = false;
          if (child.get('id') === hash.lesson.get('id')) {
            found = true;
            hash.lesson.set('sequence', index + 1);
          }
          return found;
        });

        return Object.assign(studentCollectionModel, hash);
      });
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.setProperties({
      course: model.course,
      unit: model.unit,
      lesson: model.lesson,
      mapLocation: model.mapLocation
    });
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
