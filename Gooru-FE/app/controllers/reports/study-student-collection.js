import Ember from 'ember';
import StudentCollection from 'gooru-web/controllers/reports/student-collection';
import { ASSESSMENT_SUB_TYPES, ROLES } from 'gooru-web/config/config';

/**
 *
 * Controls the access to the analytics data for a
 * student related to a collection of resources
 *
 */

export default StudentCollection.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {CourseMapService}
   */
  courseMapService: Ember.inject.service('api-sdk/course-map'),

  /**
   * @property {NavigateMapService}
   */
  navigateMapService: Ember.inject.service('api-sdk/navigate-map'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered for the next button
     */
    next: function() {
      this.playNextContent();
    },

    /**
     * If the user want to continue playing the post-test suggestion
     */
    playPostTestSuggestion: function() {
      this.playSuggestedContent(this.get('mapLocation.postTestSuggestion'));
    },

    /**
     * If the user want to continue playing the backfill suggestion
     */
    playBackFillSuggestion: function() {
      this.playSuggestedContent(this.get('mapLocation.backFillSuggestion'));
    },

    /**
     * If the user want to continue playing the resource suggestion
     */
    playResourceSuggestion: function() {
      this.playSuggestedContent(this.get('mapLocation.resourceSuggestion'));
    },

    /**
     * If the user want to continue playing the benchmark suggestion
     */
    playBenchmarkSuggestion: function() {
      this.playSuggestedContent(this.get('mapLocation.benchmarkSuggestion'));
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Course} course
   */
  course: null,

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
   * Shows the performance information
   * @property {Boolean} toggleState
   */
  toggleState: true,

  /**
   *Back fill backfill suggestion
   * @property {String} typeSuggestion
   */
  backFillType: ASSESSMENT_SUB_TYPES.BACKFILL,

  /**
   *Post test suggestion
   * @property {String} typeSuggestion
   */
  postTestType: ASSESSMENT_SUB_TYPES.POST_TEST,

  /**
   *Post Test resource suggestion
   * @property {String} typeSuggestion
   */
  resourceType: ASSESSMENT_SUB_TYPES.RESOURCE,

  /**
   *Benchmark suggestion
   * @property {String} benchmarkType
   */
  benchmarkType: ASSESSMENT_SUB_TYPES.BENCHMARK,

  /**
   * Indicate if show pre test suggestion
   * @property {Boolean} showSuggestion
   */
  showSuggestion: true,

  /**
   * Current map location
   * @property {MapSuggestions}
   */
  mapLocation: null,

  /**
   * @property {boolean}
   */
  hasPreTestSuggestions: Ember.computed.alias(
    'mapLocation.hasPreTestSuggestions'
  ),

  /**
   * @property {boolean}
   */
  hasPostTestSuggestions: Ember.computed.alias(
    'mapLocation.hasPostTestSuggestions'
  ),

  /**
   * @property {boolean}
   */
  hasBackFillSuggestions: Ember.computed.alias(
    'mapLocation.hasBackFillSuggestions'
  ),

  /**
   * @property {boolean}
   */
  hasResourceSuggestions: Ember.computed.alias(
    'mapLocation.hasResourceSuggestions'
  ),

  /**
   * @property {boolean}
   */
  isDone: Ember.computed('mapLocation.context.status', function() {
    return (
      (this.get('mapLocation.context.status') || '').toLowerCase() === 'done'
    );
  }),

  /**
   * @property {boolean}
   */
  hasAnySuggestion: Ember.computed(
    'hasBackFillSuggestions',
    'hasPostTestSuggestions',
    'hasResourceSuggestions',
    'hasBenchmarkSuggestions',
    'showSuggestion',
    function() {
      return (
        (this.get('hasBackFillSuggestions') ||
          this.get('hasPostTestSuggestions') ||
          this.get('hasResourceSuggestions') ||
          this.get('hasBenchmarkSuggestions')) &&
        this.get('showSuggestion')
      );
    }
  ),

  /**
   * @property {boolean}
   */
  hasBenchmarkSuggestions: Ember.computed.alias(
    'mapLocation.hasBenchmarkSuggestions'
  ),

  /**
   * Extracted the course version from course object
   * @property {String}
   */
  courseVersion: Ember.computed.alias('course.version'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Navigate to study player to play next collection/assessment
   */
  toPlayer: function(suggestion) {
    const context = this.get('mapLocation.context');
    let queryParams = {
      role: ROLES.STUDENT,
      source: this.get('source')
    };
    if (suggestion && suggestion.get('isResource')) {
      this.transitionToRoute(
        'resource-player',
        context.get('classId'),
        context.get('courseId'),
        suggestion.get('id'),
        { queryParams }
      );
    } else {
      let classId = context.get('classId');
      if (classId) {
        queryParams.classId = classId;
      }
      this.transitionToRoute('study-player', context.get('courseId'), {
        queryParams
      });
    }
  },

  playNextContent: function() {
    const navigateMapService = this.get('navigateMapService');
    const context = this.get('mapLocation.context');
    navigateMapService
      .getStoredNext()
      .then(
        mapLocation =>
          mapLocation.get('hasContent') || this.get('hasPreTestSuggestions')
            ? Ember.RSVP.resolve(mapLocation)
            : navigateMapService.next(context)
      )
      .then(mapLocation => {
        let status = (mapLocation.get('context.status') || '').toLowerCase();
        if (status === 'done') {
          this.setProperties({
            isDone: true,
            hasAnySuggestion: false
          });
        } else {
          this.toPlayer();
        }
      });
  },

  playSuggestedContent: function(suggestion) {
    const navigateMapService = this.get('navigateMapService');
    const courseMapService = this.get('courseMapService');
    navigateMapService
      .getStoredNext()
      .then(mapLocation =>
        Ember.RSVP.hash({
          context: mapLocation.get('context'),
          pathId: courseMapService.createNewPath(
            mapLocation.get('context'),
            suggestion
          )
        })
      )
      .then(({ context }) => navigateMapService.next(context))
      .then(() => this.toPlayer(suggestion));
  },

  /**
   * Resets to default values
   */
  resetValues: function() {
    this.setProperties({
      courseId: null,
      userId: null,
      role: null,
      contextId: null,
      source: null,
      classId: '',
      unitId: null,
      lessonId: null,
      collectionId: null,
      type: null
    });
  }
});
