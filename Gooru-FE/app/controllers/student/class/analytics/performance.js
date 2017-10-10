import Ember from 'ember';

/**
 * Student Class Analytics Performance Controller
 *
 * Controller responsible of the logic for the student class performance
 *
 * @module
 * @see routes/student/class/analytics/performance.js
 * @augments ember/Controller
 */
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  queryParams: ['filterBy', 'unitId', 'lessonId'],

  classController: Ember.inject.controller('student.class'),

  performanceService: Ember.inject.service('api-sdk/performance'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Triggered when a filter option is selected
     * @param {string} option
     */
    selectFilterBy: function(option) {
      this.set('filterBy', option);
      this.set('selectedFilterBy', option);
    },

    optionsChange: function(options) {
      this.set('selectedOption', options[0].get('value'));
    },

    updateLocation: function(newLocation, type) {
      const location = !newLocation ? null : newLocation;
      if (type === 'lesson') {
        this.set('lessonId', location);
      } else if (type === 'unit') {
        this.set('unitId', location);
        this.set('lessonId', null);
      }
    }
  },
  // -------------------------------------------------------------------------
  // Events

  /**
   * init ember event
   */
  init: function() {
    this.get('classController').set('menuItem', 'performance');
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * A link to the parent class controller
   * @see controllers/class.js
   * @property {Class}
   */
  class: Ember.computed.reads('classController.class'),

  /**
   * The performances for the units that will be shown to the user
   * @property {Ember.Array}
   */
  performances: null,

  /**
   * The selected option from the data picker.
   * @property {String}
   */
  selectedOption: 'score',

  /**
   * The current selected class model for the student
   * @property {Class}
   */
  classModel: null,
  /**
   * The userId for the student
   * @property {String}
   */
  userId: null,
  /**
   * The unitId for the current unit
   * @property {String}
   */
  unitId: null,

  /**
   * The lessonId for the current lesson
   * @property {String}
   */
  lessonId: null,

  /**
   * The filterBy selected
   * @property {String}
   */
  filterBy: 'assessment',

  /**
   * The selected filter by from the drop down
   * @property {String}
   */
  selectedFilterBy: 'assessment',

  /**
   * The units of the selected class
   * @property {Object[]}
   */
  units: [],

  /**
   * Boolean that determines whether the route model has not finished loading.
   * @property {Boolean}
   */
  currentlyLoading: null,

  /**
   * The class content visibility
   * @property {ClassContentVisibility}
   */
  contentVisibility: Ember.computed.alias('classController.contentVisibility'),

  // -------------------------------------------------------------------------
  // Observers

  selectedFilterByObserver: Ember.observer('selectedFilterBy', function() {
    const controller = this;
    controller.set('performances', []);
    const filterBy = controller.get('selectedFilterBy');
    const units = controller.get('units');
    const userId = controller.get('userId');
    const classModel = controller.get('classModel');
    const classId = classModel.get('id');
    const courseId = classModel.get('courseId');
    controller
      .get('performanceService')
      .findStudentPerformanceByCourse(userId, classId, courseId, units, {
        collectionType: filterBy
      })
      .then(function(unitPerformances) {
        controller.fixTotalCounts(unitPerformances, filterBy);
        controller.set('performances', unitPerformances);
      });
  }),

  // -------------------------------------------------------------------------
  // Methods

  fixTotalCounts: function(performances, filterBy) {
    const controller = this;
    const contentVisibility = controller.get('contentVisibility');
    performances.forEach(function(performance) {
      //overriding totals from core
      const totals =
        filterBy === 'assessment'
          ? contentVisibility.getTotalAssessmentsByUnit(
            performance.get('realId')
          )
          : contentVisibility.getTotalCollectionsByUnit(
            performance.get('realId')
          );
      performance.set('completionTotal', totals);
    });
  }
});
