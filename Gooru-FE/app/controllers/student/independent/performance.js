import Ember from 'ember';
import { CONTENT_TYPES } from 'gooru-web/config/config';
import { download } from 'gooru-web/utils/csv';
import {
  prepareStudentFileDataToDownload,
  formatDate,
  createFileNameToDownload
} from 'gooru-web/utils/utils';

/**
 * Independent Learning Performance Controller
 *
 * Controller responsible of the logic for independent learning performance
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

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

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
  courseId: null,

  /**
   * @property {string}
   */
  unitId: null,

  /**
   * @property {string}
   */
  lessonId: null,

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
   * Class courses
   * @property {Course[]}
   */
  courses: Ember.computed(
    'applicationController.myClasses.classes.[]',
    'courseId',
    function() {
      const activeClasses = this.get(
        'applicationController.myClasses'
      ).getStudentActiveClasses(this.get('profile.id'));
      return activeClasses.filterBy('hasCourse').map(function(aClass) {
        return {
          id: aClass.get('courseId'),
          title: aClass.get('courseTitle')
        };
      });
    }
  ),

  /**
   * Last selected content title
   * @property {string}
   */
  contentTitle: null,

  /**
   * Default list of  metrics to be displayed in the table
   * @sorted {Boolean}
   * @isAsc {Boolean}
   * @visible {Boolean}
   * @constant {Array}
   */
  metrics: Ember.computed('collectionType', function() {
    return Ember.A([
      Ember.Object.create({
        value: this.get('collectionType'),
        sorted: false,
        isAsc: false,
        hasSorting: true,
        visible: true,
        index: -1
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
        hasSorting: true,
        visible: false,
        index: 1
      }),
      Ember.Object.create({
        value: 'study-time',
        sorted: false,
        isAsc: false,
        hasSorting: true,
        visible: false,
        index: 2
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
     * Selects the course
     * @param courseId
     */
    selectCourse: function(courseId) {
      this.set('courseId', courseId);
      this.set('unitId', null);
      this.set('lessonId', null);
      this.loadCourse();
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
    },
    /**
     * When clicking at the download button
     */
    download: function() {
      let reportData = this.prepareReportValues();
      this.downloadFile(reportData[0], reportData[1]);
    }
  },
  // -------------------------------------------------------------------------
  // Methods
  /**
   * Loads report data
   */
  loadData: function() {
    const controller = this;
    const courseId = controller.get('courseId');
    if (courseId) {
      const userId = controller.get('profile.id');
      const collectionType = controller.get('collectionType');
      const unitId = controller.get('unitId');
      let lessonId = controller.get('lessonId');
      const criteria = {
        courseId,
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
              course,
              items: controller
                .get('performanceService')
                .findMyPerformance(
                  userId,
                  courseId,
                  lessonId,
                  unitId,
                  collectionType
                )
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
  },
  /**
   * Prepare the report value in order to download as csv file
   */
  prepareReportValues: function() {
    const controller = this;
    const collectionType = controller.getContentTitle();
    const metrics = [
      controller
        .get('i18n')
        .t(`gru-performance-metrics.${controller.get('collectionType')}`),
      controller.get('i18n').t('gru-performance-metrics.score'),
      controller.get('i18n').t('gru-performance-metrics.completion'),
      controller.get('i18n').t('gru-performance-metrics.study-time')
    ];
    const performanceSummaryItems = controller.get(
      'collectionPerformanceSummaryItems'
    );
    const collections = controller.get('collections');
    const date = formatDate(new Date(), 'MM-DD-YY');
    const courseTitle = controller.get('course.title');
    var fileNameString = `${courseTitle}`;

    fileNameString = `${fileNameString}_${date}`;

    const fileName = createFileNameToDownload(fileNameString);
    const fileData = prepareStudentFileDataToDownload(
      collections,
      performanceSummaryItems,
      metrics.map(item => item.string),
      collectionType
    );
    return [fileName, fileData];
  },
  /**
   * Download file
   */
  downloadFile: function(name, data) {
    return download(name, data);
  }
});
