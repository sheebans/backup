import Ember from 'ember';
import {
  ANONYMOUS_COLOR,
  STUDY_PLAYER_BAR_COLOR,
  NU_COURSE_VERSION,
  EMOTION_VALUES,
  DISABLED_EMOTION_UNICODE
} from 'gooru-web/config/config';

/**
 * Study Player header
 *
 * Component responsible for showing an informative header for the study player.
 * It may embed other components for interacting with the player.
 *
 * @module
 * @see controllers/study-player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {ClassService} Service to retrieve class information
   */
  classService: Ember.inject.service('api-sdk/class'),

  /**
   * @type {PerformanceService} Service to retrieve class performance summary
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  /**
   * @type {suggestService} Service to retrieve suggest resources
   */
  suggestService: Ember.inject.service('api-sdk/suggest'),

  /**
   * @property {Service} session
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-study-header'],
  classNameBindings: ['showConfirmation:hidden'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Emotion react widget display will set to visible.
     */
    openReactPicker() {
      this.set('showReactPicker', true);
    },
    /**
     * Emotion react widget display will set to hidden.
     */
    onCloseReactPicker() {
      this.set('showReactPicker', false);
    },
    /**
     * This will get triggered when react got choosen from the widget.
     * @param  {Number} It has the choosen reaction.
     */
    onChooseReaction(value) {
      this.sendAction('onChooseReaction', value);
      this.set('showReactPicker', false);
      this.set('ratingScore', value);
      let emotion = EMOTION_VALUES.findBy('value', this.get('ratingScore'));
      let selectedUnicode = emotion
        ? emotion.unicode
        : DISABLED_EMOTION_UNICODE;
      this.set('selectedUnicode', selectedUnicode);
    },
    /**
     * This will set the toggle property value of suggest widget.
     * @return {[type]} [description]
     */
    openSuggestResource() {
      this.toggleProperty('showSuggestBox');
    },

    /**
     * Action triggered when a suggested resource is clicked
     */
    playSuggested(resource) {
      let collectionUrl = window.location.href;
      if (!this.get('collectionUrl')) {
        this.set('collectionUrl', collectionUrl);
      }
      let queryParams = { collectionUrl: this.get('collectionUrl') };
      this.get('router').transitionTo(
        'resource-player',
        this.get('classId'),
        this.get('courseId'),
        resource.id,
        { queryParams }
      );
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    this.loadContent();
  },

  didRender() {
    this._super(...arguments);
    let component = this;
    component.$('.multi-item-carousel').carousel({interval: false});
    // for every slide in carousel, copy the next slide's item in the slide.
    // Do the same for the next, next item.
    component.$('.multi-item-carousel .item').each(function(index, element){
      var next = component.$(element).next();
      if (!next.length) {
        next = component.$(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo(component.$(this));

      if (next.next().length>0) {
        next.next().children(':first-child').clone().appendTo(component.$(this));
      } else {
      	component.$(this).siblings(':first').children(':first-child').clone().appendTo(component.$(this));
      }
    });
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Resource} actualResource
   */
  actualResource: null,
  /**
   * @property {String} collectionUrl
   */
  collectionUrl: null,

  /**
   * @property {Class} class information
   */
  class: null,

  /**
   * @property {String} classId - Class unique Id associated for the collection / assessment.
   */
  classId: null,

  /**
   * @property {String} courseId - course unique Id associated for the collection / assessment.
   */
  courseId: null,

  /**
   * @property {collection} collection - The current Collection
   */
  collection: null,

  /**
   * @property {Number} resourceSequence - The resource sequence in the collection / assessment
   */
  resourceSequence: null,

  /**
   * @property {Number} totalResources - The collection / assessment total resources
   */
  totalResources: null,

  /**
   * @property {Array} list of suggested resources of a collection
   */
  suggestedResources: null,

  /**
   * @property {String} color - Hex color value for the bar in the bar chart
   */
  color: ANONYMOUS_COLOR,

  /**
   * @property {String} color - Hex color value for the default bgd color of the bar chart
   */
  defaultBarColor: STUDY_PLAYER_BAR_COLOR,

  /**
   * Shows if the component is called from collection report
   * @property {Boolean} fromReport
   */
  fromReport: false,

  /**
   * Indicates if PreTest is showing
   * @property {Boolean} isPreTest
   */
  isPreTest: false,

  /**
   * Indicates if an external assessment is showing
   * @property {Boolean} isExternalAssessment
   */
  isExternalAssessment: false,

  /**
   * @property {Number} barChartData
   */
  barChartData: Ember.computed(
    'class.performanceSummary',
    'class.courseCompetencyCompletion',
    function() {
      const isNUCourse = this.get('isNUCourse');
      const completed = isNUCourse
        ? this.get('class.courseCompetencyCompletion.completedCount')
        : this.get('class.performanceSummary.totalCompleted');
      const total = isNUCourse
        ? this.get('class.courseCompetencyCompletion.totalCount')
        : this.get('class.performanceSummary.total');
      const percentage = completed ? completed / total * 100 : 0;
      return [
        {
          color: this.get('color'),
          percentage
        }
      ];
    }
  ),

  /**
   * Course version name
   * @type {String}
   */
  courseVersion: null,

  /**
   * Check it's nu course version or not
   * @type {Boolean}
   */
  isNUCourse: Ember.computed.equal('courseVersion', NU_COURSE_VERSION),

  /**
   * property will have the rating score.
   * @property {Number}
   */
  ratingScore: 0,

  /**
   * This property will decide to show the suggested resoure or not.
   * @property {Boolean}
   */
  hasSuggestedResources: false,

  /**
   * This property will decide to show the reaction picker  or not.
   * @property {Boolean}
   */
  showReactPicker: false,

  /**
   * This property will decide to show the suggest widget or not
   * @type {Boolean}
   */
  showSuggestBox: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Load Header Content
   */

  loadContent: function() {
    const component = this;
    const myId = component.get('session.userId');
    const classId = component.get('classId');
    const collectionId = component.get('collection.id');
    const totalResources = component.get('collection.resources')
      ? component.get('collection.resources').length
      : null;
    component.set('totalResources', totalResources);
    const courseId = component.get('courseId');
    if (classId) {
      Ember.RSVP
        .hash({
          aClass: component.get('classService').readClassInfo(classId),
          classPerformanceSummaryItems: component
            .get('performanceService')
            .findClassPerformanceSummaryByStudentAndClassIds(myId, [classId])
        })
        .then(({ aClass, classPerformanceSummaryItems }) => {
          aClass.set(
            'performanceSummary',
            classPerformanceSummaryItems.findBy('classId', classId)
          );
          const isNUCourse = this.get('isNUCourse');
          if (isNUCourse) {
            Ember.RSVP
              .hash({
                courseCompetencyCompletion: component
                  .get('performanceService')
                  .findCourseCompetencyCompletionByCourseIds(myId, [courseId])
              })
              .then(({ courseCompetencyCompletion }) => {
                aClass.set(
                  'courseCompetencyCompletion',
                  courseCompetencyCompletion.findBy('courseId', courseId)
                );
              });
          }
          component.set('class', aClass);
        });
    }
    if (collectionId) {
      component
        .get('suggestService')
        .suggestResourcesForCollection(
          component.get('session.userId'),
          collectionId
        )
        .then(suggestedResources => {
          component.set('suggestedResources', suggestedResources);
          if (suggestedResources && suggestedResources.length > 0) {
            component.set('hasSuggestedResources', true);
          }
        });
    }
  }

});
