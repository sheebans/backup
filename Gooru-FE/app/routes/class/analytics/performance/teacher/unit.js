import Ember from 'ember';

import { createDataMatrix } from 'gooru-web/utils/performance-data';

/**
 * Teacher Analytics Performance Route - Course/Unit Level
 *
 * Route responsible of the transitions and loading the model/data for the teacher class performance at course/unit level
 *
 * @module
 * @augments ember/Controller
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  lessonService: Ember.inject.service('api-sdk/lesson'),
  performanceService: Ember.inject.service('api-sdk/performance'),
  unitService: Ember.inject.service('api-sdk/unit'),

  //controllerName: 'unit',

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * navigateToLessons
     */
    navigateToLessons: function(lessonId) {
      const unitId = this.get('controller.unit').get('id');

      this.transitionTo(
        'class.analytics.performance.teacher.lesson',
        unitId,
        lessonId
      );
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  model: function(params) {
    const route = this;
    const unitId = params.unitId;
    const filterBy = route.paramsFor('class.analytics.performance.teacher')
      .filterBy;
    const classModel = route.modelFor('class').class;
    const classId = classModel.get('id');
    const courseId = classModel.get('courseId');
    const members = classModel.get('members');

    return this.get('unitService')
      .fetchById(courseId, unitId)
      .then(function(unit) {
        const classPerformanceData = route
          .get('performanceService')
          .findClassPerformanceByUnit(classId, courseId, unitId, members, {
            collectionType: filterBy
          });
        return Ember.RSVP.hash({
          unit: unit,
          lessons: unit.get('children'),
          classPerformanceData: classPerformanceData,
          filterBy: filterBy
        });
      });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('active', true);
    this.setupDataPickerOptions(controller);

    const classPerformanceData = model.classPerformanceData;
    controller.fixTotalCounts(
      model.unit.get('id'),
      classPerformanceData,
      model.filterBy
    );
    const performanceData = createDataMatrix(
      model.lessons,
      classPerformanceData,
      'unit'
    );
    controller.get('teacherController').updateBreadcrumb(model.unit, 'unit');
    controller.set('performanceDataMatrix', performanceData);
    controller.set('lessons', model.lessons);
    controller.set('unit', model.unit);

    //updating the unit in the teacher controller
    controller.set('teacherController.unit', model.unit);
    //updating the collectionLevel to show or not the launch anonymous button
    controller.set('teacherController.collectionLevel', false);
    //updating the lessonLevel to show or not filters
    controller.set('teacherController.lessonLevel', false);
    //updating the performanceDataHeaders and performanceDataMatrix to download implementation
    controller.set('teacherController.performanceDataHeaders', model.lessons);
    controller.set('teacherController.performanceDataMatrix', performanceData);

    this.setupDataPickerOptions(controller);
  },
  /**
   * Setups data picker options for lesson
   * @param controller
   */
  setupDataPickerOptions: function(controller) {
    controller.set(
      'optionsCollectionsTeacher',
      Ember.A([
        Ember.Object.create({
          value: 'score',
          selected: false,
          readOnly: true,
          isDisabled: true
        }),
        Ember.Object.create({
          value: 'completion',
          selected: false,
          readOnly: false,
          isDisabled: true
        }),
        Ember.Object.create({
          value: 'time-spent',
          selected: true,
          readOnly: false,
          isDisabled: true
        })
      ])
    );
    controller.set(
      'mobileOptionsCollectionsTeacher',
      Ember.A([
        Ember.Object.create({
          value: 'score',
          selected: false,
          readOnly: false,
          isDisabled: true
        }),
        Ember.Object.create({
          value: 'completion',
          selected: false,
          readOnly: false,
          isDisabled: true
        }),
        Ember.Object.create({
          value: 'time-spent',
          selected: true,
          readOnly: false,
          isDisabled: true
        })
      ])
    );
    controller.get('teacherController').restoreSelectedOptions();
  },

  deactivate: function() {
    this.set('controller.active', false);
  }
});
