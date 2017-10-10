import Ember from 'ember';
import { CONTENT_TYPES } from 'gooru-web/config/config';

/**
 * Student Class Performance Controller
 *
 * Controller responsible of the logic for the teacher performance
 *
 * @module
 * @augments ember/Controller
 */
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  queryParams: ['collectionType', 'unitId', 'lessonId', 'courseId'],

  applicationController: Ember.inject.controller('application'),

  /**
   * @type {PerformanceService}
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  /**
   * @type {CourseService}
   */
  courseService: Ember.inject.service('api-sdk/course'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Profile}
   */
  profile: Ember.computed.alias('applicationController.profile'),

  /**
   * Selected course
   * @property {Course}
   */
  course: null,

  /**
   * @property {CollectionPerformanceSummary[]}
   */
  collectionPerformanceSummaryItems: [],

  /**
   * @property {string}
   */
  collectionType: CONTENT_TYPES.ASSESSMENT,

  /**
   * @property {string}
   */
  unitId: null,

  /**
   * @property {string}
   */
  lessonId: null,

  /**
   * @property {string}
   */
  classId: null,

  /**
   * filter Criteria
   * @property {string}
   */
  filterCriteria: null,

  /**
   * @property {Collection[]|Assessment[]}
   */
  collections: [],

  /**
   * Last selected content title
   * @property {string}
   */
  contentTitle: null,

  metrics: Ember.computed('collectionType', function() {
    return Ember.A([
      Ember.Object.create({
        value: this.get('collectionType'),
        sorted: false,
        isAsc: false,
        hasSorting: true,
        visible: true,
        index: 4
      }),
      Ember.Object.create({
        value: 'score',
        sorted: false,
        isAsc: false,
        hasSorting: true,
        visible: false,
        index: 0
      }),
      Ember.Object.create({
        value: 'report',
        sorted: false,
        isAsc: false,
        hasSorting: false,
        visible: false,
        index: 1
      }),
      Ember.Object.create({
        value: 'study-time',
        sorted: false,
        isAsc: false,
        hasSorting: true,
        visible: false,
        index: 3
      })
    ]);
  }),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Selects the content type
     * @param collectionType
     */
    selectContentType: function(collectionType) {
      this.set('collectionType', collectionType);
      this.loadData();
    },

    /**
     * Selects the unit
     * @param unitId
     */
    selectUnit: function(unitId) {
      this.set('unitId', unitId);
      this.set('lessonId', null);
    },

    /**
     * Selects the lesson
     * @param lessonId
     */
    selectLesson: function(lessonId) {
      this.set('lessonId', lessonId);
    },

    /**
     * Loads report data
     */
    updateReport: function() {
      this.loadData();
    }
  },

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Loads report data
   */
  loadData: function() {
    const controller = this;
    const courseId = controller.get('course.id');
    if (courseId) {
      const userId = controller.get('profile.id');
      const collectionType = controller.get('collectionType');
      const unitId = controller.get('unitId');
      let lessonId = controller.get('lessonId');
      let classId = controller.get('classId');
      const criteria = {
        courseId,
        classId,
        unitId,
        lessonId,
        collectionType
      };
      controller.set('filterCriteria', criteria);
      controller
        .get('courseService')
        .getCourseStructure(courseId, collectionType)
        .then(function(course) {
          if (!lessonId) {
            let unitLessons = course
              .get('children')
              .findBy('id', unitId)
              .get('sortedLessonResults');
            if (unitLessons.length > 0) {
              var lesson = unitLessons[0].get('id');
              Ember.run(function() {
                controller.set('lessonId', lesson);
                lessonId = lesson;
              });
            }
            criteria.lessonId = controller.get('lessonId');
          }
          Ember.RSVP
            .hash({
              course: course,
              items: controller
                .get('performanceService')
                .searchStudentCollectionPerformanceSummary(userId, criteria)
            })
            .then(function(hash) {
              const course = hash.course;
              const items = hash.items;
              controller.setProperties({
                course,
                collectionPerformanceSummaryItems: items,
                collections: course.getCollectionsByType(
                  collectionType,
                  unitId,
                  lessonId
                )
              });
              controller.set('contentTitle', controller.getContentTitle());
            });
        });
    }
  },

  /**
   * Loads report data
   */
  loadCourse: function() {
    const controller = this;
    const courseId = controller.get('courseId');
    const collectionType = controller.get('collectionType');
    controller
      .get('courseService')
      .getCourseStructure(courseId, collectionType)
      .then(function(course) {
        controller.set('course', course);
      });
  },

  /**
   * Gets the last selected content title
   * @returns {string}
   */
  getContentTitle: function() {
    let title = this.get('course') ? this.get('course.title') : null;
    title = this.get('unit') ? this.get('unit.title') : title;
    return this.get('lesson') ? this.get('lesson.title') : title;
  },

  /**
   * Resets values
   */
  resetValues: function() {
    this.setProperties({
      course: null,
      unit: null,
      courseId: null,
      unitId: null,
      lessonId: null,
      collections: [],
      collectionPerformanceSummaryItems: []
    });
  }
});
