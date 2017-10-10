import Ember from 'ember';
import { download } from 'gooru-web/utils/csv';
import {
  prepareFileDataToDownload,
  formatDate,
  createFileNameToDownload
} from 'gooru-web/utils/utils';

/**
 * Teacher Analytics Performance Controller
 *
 * Controller responsible of the logic for the teacher performance
 *
 * @module
 * @see routes/analytics/performance/teacher.js
 * @augments ember/Controller
 */
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  queryParams: ['filterBy'],

  classController: Ember.inject.controller('class'),

  applicationController: Ember.inject.controller('application'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Triggered when a filter option is selected
     * @param {string} option
     */
    optionsChange: function(options) {
      this.set(
        'selectedOptions',
        options.map(function(option) {
          return option.get('value');
        })
      );
    },

    /**
     * Edit content action, when clicking Edit content on Class Overview
     * @param {Content/Course}
     */
    editContent: function() {
      this.transitionToRoute('content.courses.edit', this.get('course.id'));
    },

    /**
     * Triggered when a filter option is selected
     * @param {string} option
     */
    selectFilterBy: function(option) {
      this.set('filterBy', option);
    },

    /**
     * Triggered when the user toggles between normal and full screen mode
     */
    toggleFullScreen: function() {
      this.get('classController').hideChannels();
      return this.get('classController').toggleFullScreen();
    },

    /**
     * When clicking at the download button
     */
    download: function() {
      const performanceDataHeaders = this.get('performanceDataHeaders');
      const performanceDataMatrix = this.get('performanceDataMatrix');
      const date = formatDate(new Date(), 'MM-DD-YY');
      const classTitle = this.get('class.title');
      const courseTitle = this.get('course.title');
      const currentRouteName = this.get(
        'applicationController.currentRouteName'
      );
      var fileNameString = `${classTitle}_${courseTitle}`;
      var unitIndex;
      var lessonIndex;
      var level = 'course';

      if (currentRouteName === 'class.analytics.performance.teacher.unit') {
        unitIndex = this.get('course').getChildUnitIndex(this.get('unit'));
        fileNameString = `${fileNameString}_unit${unitIndex + 1}`;
        level = 'unit';
      }

      if (currentRouteName === 'class.analytics.performance.teacher.lesson') {
        level = 'lesson';
        unitIndex = this.get('course').getChildUnitIndex(this.get('unit'));
        lessonIndex = this.get('unit').getChildLessonIndex(this.get('lesson'));
        fileNameString = `${fileNameString}_unit${unitIndex +
          1}_lesson${lessonIndex + 1}`;
      }

      fileNameString = `${fileNameString}_${date}`;

      const fileName = createFileNameToDownload(fileNameString);
      const fileData = prepareFileDataToDownload(
        performanceDataHeaders,
        performanceDataMatrix,
        this.get('filterBy'),
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
   * @property {Collection} collection
   */
  collection: null,

  /**
   * @property {Boolean} collectionLevel - shows if the collection level.
   */
  collectionLevel: false,

  /**
   * @property {Boolean} lessonLevel - shows if the lesson level.
   */
  lessonLevel: false,

  /**
   * The filterBy selected
   * @property {String}
   */
  filterBy: 'assessment',

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
  selectedOptions: Ember.computed(function() {
    return this.get('filterBy') === 'assessment'
      ? Ember.A(['score'])
      : Ember.A(['study-time']);
  }),

  /**
   * If analytics is fullscreen
   * @property {Boolean}
   */
  isFullScreen: Ember.computed.alias('classController.isFullScreen'),

  /**
   * List of breadcrumbs.
   * @property {Array}
   */
  breadcrumb: Ember.A(),

  /**
   * Indicates if the filters are visible
   * @property {boolean}
   */
  showFilters: Ember.computed.not('collectionLevel'),

  /**
   * List of  options specific to teacher to be displayed by the component Data picker
   *
   * Only to validate acceptance criteria 6 "The data picker could received which options are selectable by default"
   *
   * @constant {Array}
   */
  optionsTeacher: Ember.A([
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
      isDisabled: false
    }),
    Ember.Object.create({
      value: 'study-time',
      selected: false,
      readOnly: false,
      isDisabled: false
    })
  ]),

  /**
   * List of  options specific to teacher to be displayed by the component Data picker when filter by collection
   *
   * @constant {Array}
   */
  optionsCollectionsTeacher: Ember.A([
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
      value: 'study-time',
      selected: true,
      readOnly: false,
      isDisabled: true
    })
  ]),
  /**
   * List of  options specific to teacher to be displayed by the component Data picker when filter by collection
   *
   * @constant {Array}
   */
  mobileOptionsCollectionsTeacher: Ember.A([
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
      value: 'study-time',
      selected: true,
      readOnly: false,
      isDisabled: true
    })
  ]),

  /**
   * List of  options specific to teacher to be displayed by the component Data picker for mobiles
   * @constant {Array}
   */
  mobileOptionsTeacher: Ember.A([
    Ember.Object.create({
      value: 'score',
      selected: true,
      readOnly: false,
      isDisabled: false
    }),
    Ember.Object.create({
      value: 'completion',
      selected: false,
      readOnly: false,
      isDisabled: false
    }),
    Ember.Object.create({
      value: 'study-time',
      selected: false,
      readOnly: false,
      isDisabled: false
    })
  ]),

  /**
   * If analytics is fullscreen
   * @property {Boolean}
   */
  enableEdit: Ember.computed.alias('class.hasCourse'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Updates the breadcrumb based on the provided item
   * @param {[]} breadcrumb
   * @param {item} item
   * @param {type} course, unit, lesson, assessment
   */
  updateBreadcrumb: function(item, type) {
    const controller = this;
    let breadcrumb = controller.get('breadcrumb');

    const value = Ember.Object.create({ id: item.get('id'), type: type });
    const breadcrumbObject = Ember.Object.create({
      label: item.get('title'),
      value: value
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
    this.set('lesson', null);
    this.set('collection', null);
    breadcrumb.clear();
  },

  // -------------------------------------------------------------------------
  // Observers
  restoreSelectedOptions: function(lessonLevel = false) {
    var component = this;
    if (component.get('filterBy') === 'assessment') {
      component.set('showFilters', true);
      let options = component.get('optionsTeacher').filterBy('selected', true);
      component.set(
        'selectedOptions',
        options.map(function(option) {
          return option.get('value');
        })
      );
    } else {
      lessonLevel
        ? component.set('showFilters', true)
        : component.set('showFilters', false);
      let options = component
        .get('optionsCollectionsTeacher')
        .filterBy('selected', true);
      component.set(
        'selectedOptions',
        options.map(function(option) {
          return option.get('value');
        })
      );
    }
  }
});
