import Ember from 'ember';
import { download } from 'gooru-web/utils/csv';
import {
  prepareFileDataToDownload,
  formatDate,
  createFileNameToDownload
} from 'gooru-web/utils/utils';

/**
 * Teacher Performance Controller
 *
 * Controller responsible of the logic for the teacher performance
 *
 * @module
 * @augments ember/Controller
 */
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  queryParams: ['filterBy', 'unitId', 'lessonId', 'collectionId'],

  classController: Ember.inject.controller('teacher.class'),

  /**
   * @type {UnitService}
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  /**
   * @type {LessonService}
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),

  /**
   * @type CollectionService
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @type AssessmentService
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),

  /**
   * @type {PerformanceService}
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * navigateToUnits
     */
    navigateTo: function(id) {
      if (this.get('isAtCourseLevel')) {
        this.set('unitId', id);
      } else if (this.get('isAtUnitLevel')) {
        this.set('lessonId', id);
      } else if (this.get('isAtLessonLevel')) {
        this.set('collectionId', id);
        this.transitionToRoute(
          'teacher.class.collection',
          this.get('unitId'),
          this.get('lessonId'),
          this.get('collectionId')
        );
      }
    },

    /**
     * Triggered when a filter option is selected
     * @param {string} option
     */
    optionsChange: function(options) {
      this.set('selectedOptions', options.mapBy('value'));
    },

    /**
     * Triggered when a filter option is selected
     * @param {string} option
     */
    selectFilterBy: function(option) {
      this.set('filterBy', option);
    },

    /**
     * Triggered when the breadcrumb item is selected
     * @param {*} item
     */
    selectBreadcrumbItem: function(item) {
      const type = item.get('value').type;
      const itemId = item.get('value').id;

      if (type === 'course') {
        this.setProperties({
          unitId: null,
          lessonId: null,
          collectionId: null
        });
      } else if (type === 'unit') {
        this.setProperties({
          unitId: itemId,
          lessonId: null,
          collectionId: null
        });
      } else {
        this.setProperties({
          lessonId: itemId,
          collectionId: null
        });
      }
    },

    /**
     * When clicking at the download button
     */
    download: function() {
      const controller = this;
      const performanceDataHeaders = controller.get('performanceDataHeaders');
      const performanceDataMatrix = controller.get('performanceDataMatrix');
      const date = formatDate(new Date(), 'MM-DD-YY');
      const classTitle = controller.get('class.title');
      const courseTitle = controller.get('course.title');
      var fileNameString = `${classTitle}_${courseTitle}`;
      var unitIndex;
      var lessonIndex;
      var level = 'course';

      if (controller.get('isAtUnitLevel')) {
        unitIndex = controller
          .get('course')
          .getChildUnitIndex(controller.get('unit'));
        fileNameString = `${fileNameString}_unit${unitIndex + 1}`;
        level = 'unit';
      }

      if (controller.get('isAtLessonLevel')) {
        level = 'lesson';
        unitIndex = controller
          .get('course')
          .getChildUnitIndex(controller.get('unit'));
        lessonIndex = controller
          .get('unit')
          .getChildLessonIndex(controller.get('lesson'));
        fileNameString = `${fileNameString}_unit${unitIndex +
          1}_lesson${lessonIndex + 1}`;
      }

      fileNameString = `${fileNameString}_${date}`;

      const fileName = createFileNameToDownload(fileNameString);
      const fileData = prepareFileDataToDownload(
        performanceDataHeaders,
        performanceDataMatrix,
        controller.get('filterBy'),
        level
      );

      download(fileName, fileData);
    }
  },

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
   * A link to the parent class controller
   * @see controllers/class.js
   * @property {Course}
   */
  course: Ember.computed.alias('classController.course'),

  /**
   * @property {Unit} unit
   */
  unit: null,

  /**
   * @property {Lesson} lesson
   */
  lesson: null,

  /**
   * @property {collection/Collection} collection
   */
  collection: null,

  /**
   * Query param, filterBy selected
   * @property {String}
   */
  filterBy: 'assessment',

  /**
   * Query param, unitId selected
   * @property {String}
   */
  unitId: null,

  /**
   * Query param, lessonId selected
   * @property {String}
   */
  lessonId: null,

  /**
   * Query param, collectionId selected
   * @property {String}
   */
  collectionId: null,

  /**
   * @property {ReportData} the selected collection report data
   */
  reportData: null,

  /**
   * @property {boolean} indicates if the loading icon should be shown
   */
  loading: false,

  /**
   * @property {boolean}
   */
  filteredByAssessment: Ember.computed.not('filteredByCollection'),

  /**
   * @property {boolean}
   */
  filteredByCollection: Ember.computed.equal('filterBy', 'collection'),

  /**
   * The performance data header titles of the course, unit, lesson. This is setting in each setupController
   * @property {Headers[]}
   */
  performanceDataHeaders: null,

  /**
   * The performanceDataMatrix of the course, unit, lesson. This is setting in each setupController
   * @property {performanceData[]}
   */
  performanceDataMatrix: null,

  /**
   * List of selected options from the data picker.
   * @property {Array}
   */
  selectedOptions: null,

  /**
   * List of breadcrumbs.
   * @property {Array}
   */
  breadcrumb: Ember.A(),

  /**
   * A link to the content visibility from class controller
   * @see controllers/class.js
   * @property {Class}
   */
  contentVisibility: Ember.computed.alias('classController.contentVisibility'),

  /**
   * @property {boolean}
   */
  showPerformanceData: Ember.computed(
    'performanceDataMatrix',
    'class.courseId',
    function() {
      return (
        this.get('performanceDataMatrix').length > 1 &&
        this.get('class.courseId') !== ''
      );
    }
  ),

  /**
   * @property {string} indicates the header type unit/lesson/assessment
   */
  headerType: null,

  /**
   * @property {boolean} indicates the app is showing course data
   */
  isAtCourseLevel: Ember.computed.not('unitId'),

  /**
   * @property {boolean} indicates the app is showing unit data
   */
  isAtUnitLevel: Ember.computed('lessonId', 'unitId', function() {
    return this.get('unitId') && !this.get('lessonId');
  }),

  /**
   * @property {boolean} indicates the app is showing lesson data
   */
  isAtLessonLevel: Ember.computed('lessonId', 'collectionId', function() {
    return this.get('lessonId') && !this.get('collectionId');
  }),

  /**
   * @property {boolean} indicates the app is showing collection/assessment data
   */
  isAtCollectionLevel: Ember.computed.bool('collectionId'),

  /**
   * Default data picker options for assessments
   * @constant {Array}
   */
  defaultAssessmentOptions: Ember.A([
    Ember.Object.create({
      value: 'score',
      selected: true,
      readOnly: true,
      isDisabled: false
    }),
    Ember.Object.create({
      value: 'completion',
      selected: false,
      readOnly: false,
      isDisabled: true
    }),
    Ember.Object.create({
      value: 'time-spent',
      selected: false,
      readOnly: false,
      isDisabled: false
    })
  ]),

  /**
   * Default data picker options for collections
   *
   * @constant {Array}
   */
  defaultCollectionOptions: Ember.A([
    Ember.Object.create({
      value: 'score',
      selected: false,
      readOnly: false,
      isDisabled: false
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
      readOnly: true,
      isDisabled: false
    })
  ]),

  /**
   * The Questions needs to grade
   * @property {GradeQuestionItem[]}
   */
  gradeQuestions: null,

  /**
   * @property {Course} courseStructure
   */
  courseStructure: null,

  /**
   * @property {Array} list of grade questions information
   */
  questionItems: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Creates the grade item information
   * @param {[]} grade item
   * @param {item} item
   */
  createGradeItemObject: function(item) {
    const controller = this;
    const itemObject = Ember.Object.create();

    const courseStructure = controller.get('courseStructure');
    const unitId = item.get('unitId');
    const lessonId = item.get('lessonId');
    const collectionId = item.get('collectionId');
    const collectionType = item.get('collectionType');
    const isAssessment = !collectionType || collectionType === 'assessment';
    const resourceId = item.get('resourceId');
    const studentCount = item.get('studentCount');
    const unit = courseStructure.get('children').findBy('id', unitId);
    const lesson = unit.get('children').findBy('id', lessonId);

    const unitIndex = courseStructure.getChildUnitIndex(unit) + 1;
    const lessonIndex = unit.getChildLessonIndex(lesson) + 1;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      return Ember.RSVP
        .hash({
          collection: collectionId
            ? isAssessment
              ? controller.get('assessmentService').readAssessment(collectionId)
              : controller.get('collectionService').readCollection(collectionId)
            : undefined
        })
        .then(function(hash) {
          const collection = hash.collection;
          const question = collection.get('children').findBy('id', resourceId);
          itemObject.setProperties({
            unitPrefix: `U${unitIndex}`,
            lessonPrefix: `L${lessonIndex}`,
            classId: controller.get('class.id'),
            courseId: controller.get('course.id'),
            unitId: unit.get('id'),
            lessonId: lesson.get('id'),
            collection,
            question,
            studentCount
          });

          resolve(itemObject);
        }, reject);
    });
  },

  /**
   * Updates the breadcrumb based on the provided item
   * @param {[]} breadcrumb
   * @param {item} item
   * @param {type} course, unit, lesson, assessment
   */
  updateBreadcrumb: function(item, type) {
    const controller = this;
    let breadcrumb = controller.get('breadcrumb');
    let prefix;

    if (type !== 'course') {
      prefix = `${type[0].toUpperCase() + item.get('sequence')}: `;
    }

    const value = Ember.Object.create({ id: item.get('id'), type: type });
    const breadcrumbObject = Ember.Object.create({
      label: item.get('title'),
      value,
      prefix
    });

    //removes all items
    const levels = ['course', 'unit', 'lesson'];
    const index = levels.indexOf(type);
    const toRemove = breadcrumb.slice(index, breadcrumb.get('length'));
    breadcrumb.removeObjects(toRemove.toArray());

    //add new breadcrumb item
    breadcrumb.pushObject(breadcrumbObject);
    return breadcrumb;
  },

  /**
   * willDestroyElement event
   */
  willDestroyElement: function() {
    this.resetValues();
  },

  /**
   * Reset controller values and breadcrumb list
   */
  resetValues: function() {
    const controller = this;
    let breadcrumb = controller.get('breadcrumb');
    this.set('unit', null);
    this.set('unitId', null);
    this.set('lesson', null);
    this.set('lessonId', null);
    this.set('collection', null);
    this.set('collectionId', null);
    this.set('anonymous', false);
    this.set('filterBy', 'assessment');
    breadcrumb.clear();
  },

  /**
   * Reset the options base on filters
   */
  restoreSelectedOptions: function() {
    const controller = this;
    const assessment = controller.get('filteredByAssessment');
    const options = assessment
      ? controller.get('defaultAssessmentOptions')
      : controller.get('defaultCollectionOptions');
    controller.set(
      'selectedOptions',
      options.filterBy('selected', true).mapBy('value')
    );
  },

  // -------------------------------------------------------------------------
  // Observers

  setQuestionItems: Ember.observer('courseStructure', function() {
    const controller = this;
    const filterBy = controller.get('filterBy');
    const courseStructure = controller.get('courseStructure');
    let gradeItems = controller.get('gradeQuestions.gradeItems');

    if (gradeItems && courseStructure) {
      gradeItems = gradeItems.filterBy('collectionType', filterBy);

      const items = gradeItems.map(function(item) {
        return controller.createGradeItemObject(item);
      });
      Ember.RSVP.all(items).then(function(questionItems) {
        controller.set('questionItems', questionItems);
      });
    }
  })
});
