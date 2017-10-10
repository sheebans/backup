import Ember from 'ember';

import { createDataMatrix } from 'gooru-web/utils/performance-data';

/**
 * Teacher Analytics Performance Controller - Lesson Level
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
   * @type CollectionService
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @type {PerformanceService}
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {},

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
   * @property {User[]} class students
   */
  students: Ember.computed.reads('classController.members'),

  /**
   * Lesson's collections
   * @property {Collection[]}
   */
  collections: null,

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
   * @property {Lesson} lesson
   */
  lesson: null,

  /**
   * @property {Collection} the selected collection
   */
  collection: null,

  /**
   * @property {ReportData} the selected collection report data
   */
  reportData: null,
  /**
   * A link to the parent class controller
   * @see controllers/class.js
   * @property {Course}
   */
  course: Ember.computed.alias('classController.course'),

  /**
   * Indicates if the filters are visible
   * @property {boolean}
   */
  showFilters: Ember.computed.alias('teacherController.showFilters'),

  // -------------------------------------------------------------------------
  // Observers

  filterByObserver: Ember.observer('filterBy', function() {
    const controller = this;

    if (controller.get('active')) {
      controller.set('performanceDataMatrix', []);
      controller.set('teacherController.performanceDataMatrix', []);
      controller.set('collections', []);
      controller.get('teacherController').restoreSelectedOptions(true);
      const filterBy = controller.get('filterBy');
      const classId = controller.get('class.id');
      const courseId = controller.get('class.courseId');
      const members = controller.get('class.members');
      const unitId = controller.get('unit.id');
      const lessonId = controller.get('lesson.id');
      const collections = controller.get('lesson.children');
      controller
        .get('performanceService')
        .findClassPerformanceByUnitAndLesson(
          classId,
          courseId,
          unitId,
          lessonId,
          members,
          { collectionType: filterBy }
        )
        .then(function(classPerformanceData) {
          const filteredCollections = collections.filter(function(collection) {
            return filterBy === 'both' || collection.get('format') === filterBy;
          });
          controller.set('collections', filteredCollections);
          const performanceData = createDataMatrix(
            filteredCollections,
            classPerformanceData,
            'lesson'
          );
          controller.set('performanceDataMatrix', performanceData);
          controller.set(
            'teacherController.performanceDataMatrix',
            performanceData
          );
        });
    }
  })

  // -------------------------------------------------------------------------
  // Methods
});
