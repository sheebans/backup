import Ember from 'ember';

import { createDataMatrix } from 'gooru-web/utils/performance-data';

/**
 * Teacher Analytics Performance Controller - Course Level
 *
 * Controller responsible of the logic for the teacher performance at course level
 *
 * @module
 * @see routes/analytics/performance/teacher/course.js
 * @augments ember/Controller
 */
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  classController: Ember.inject.controller('class'),

  /**
   * @property {*} teacher performance controller
   */
  teacherController: Ember.inject.controller(
    'class.analytics.performance.teacher'
  ),

  /**
   * @type {PerformanceService}
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * A link to the parent class controller
   * @see controllers/class.js
   * @property {Class}
   */
  class: Ember.computed.reads('classController.class'),

  /**
   * Unit's lessons
   * @property {Lesson[]}
   */
  lessons: null,

  /**
   * The performanceDataMatrix
   * @property {performanceData[]}
   */

  performanceDataMatrix: null,

  /**
   * The filterBy selected
   * @property {String}
   */
  filterBy: Ember.computed.alias('teacherController.filterBy'),

  /**
   * Indicates if the filters are visible
   * @property {boolean}
   */
  showFilters: Ember.computed.alias('teacherController.showFilters'),

  /**
   * List of selected options from the data picker.
   * @property {Array}
   */
  selectedOptions: Ember.computed.alias('teacherController.selectedOptions'),

  /**
   * List of selected options from the data picker.
   * @property {Array}
   */
  optionsCollectionsTeacher: Ember.computed.alias(
    'teacherController.optionsCollectionsTeacher'
  ),
  /**
   * List of selected options from the data picker for mobile.
   * @property {Array}
   */
  mobileOptionsCollectionsTeacher: Ember.computed.alias(
    'teacherController.mobileOptionsCollectionsTeacher'
  ),

  /**
   * @property {Unit} unit
   */
  unit: null,

  /**
   * A link to the content visibility from class controller
   * @see controllers/class.js
   * @property {Class}
   */
  contentVisibility: Ember.computed.alias('classController.contentVisibility'),

  // -------------------------------------------------------------------------
  // Observers

  filterByObserver: Ember.observer('filterBy', function() {
    const controller = this;

    if (controller.get('active')) {
      controller.get('teacherController').restoreSelectedOptions();
      controller.set('performanceDataMatrix', []);
      controller.set('teacherController.performanceDataMatrix', []);
      const filterBy = controller.get('filterBy');
      const classId = controller.get('class.id');
      const courseId = controller.get('class.courseId');
      const members = controller.get('class.members');
      const unitId = controller.get('unit.id');
      const lessons = controller.get('lessons');
      controller
        .get('performanceService')
        .findClassPerformanceByUnit(classId, courseId, unitId, members, {
          collectionType: filterBy
        })
        .then(function(classPerformanceData) {
          controller.fixTotalCounts(unitId, classPerformanceData, filterBy);
          const performanceData = createDataMatrix(
            lessons,
            classPerformanceData,
            'unit'
          );
          controller.set('performanceDataMatrix', performanceData);
          controller.set(
            'teacherController.performanceDataMatrix',
            performanceData
          );
        });
    }
  }),

  // -------------------------------------------------------------------------
  // Methods
  fixTotalCounts: function(unitId, classPerformanceData, filterBy) {
    const controller = this;
    const contentVisibility = controller.get('contentVisibility');
    const studentPerformanceData = classPerformanceData.get(
      'studentPerformanceData'
    );
    studentPerformanceData.forEach(function(studentPerformance) {
      const performanceData = studentPerformance.get('performanceData');
      performanceData.forEach(function(performance) {
        const totals =
          filterBy === 'assessment'
            ? contentVisibility.getTotalAssessmentsByUnitAndLesson(
              unitId,
              performance.get('realId')
            )
            : contentVisibility.getTotalCollectionsByUnitAndLesson(
              unitId,
              performance.get('realId')
            );
        performance.set('completionTotal', totals);
      });
    });
  }
});
