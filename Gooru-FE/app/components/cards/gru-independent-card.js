import Ember from 'ember';
import {
  ROLES,
  CONTENT_TYPES,
  PLAYER_EVENT_SOURCE,
  TIME_SPENT_CHART_COLOR
} from 'gooru-web/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['gru-independent-card'],

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Ember.Service} session service
   */
  session: Ember.inject.service('session'),

  /**
   * @property {NavigateMapService}
   */
  navigateMapService: Ember.inject.service('api-sdk/navigate-map'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When opening the player for current activity
     */
    playCurrent: function() {
      let collectionId = this.get('location.currentId');
      let type = this.get('location.currentType');
      let unitId = this.get('location.unitId');
      let lessonId = this.get('location.lessonId');
      let courseId = this.get('location.courseId');
      let queryParams = {
        classId: null,
        unitId,
        lessonId,
        collectionId,
        role: ROLES.STUDENT,
        source: PLAYER_EVENT_SOURCE.INDEPENDENT_ACTIVITY,
        type
      };

      this.get('navigateMapService')
        .startCollection(courseId, unitId, lessonId, collectionId, type)
        .then(() =>
          this.get('router').transitionTo('study-player', courseId, {
            queryParams
          })
        );
    },

    /**
     * When going to an assessment/collection report
     */
    toReport: function() {
      const router = this.get('router');
      const location = this.get('location');
      const queryParams = {
        collectionId: location.get('collectionId'),
        userId: this.get('session.userId'),
        type: location.get('type'),
        role: ROLES.STUDENT
      };
      const reportController = Ember.getOwner(this).lookup(
        'controller:reports.student-collection-analytics'
      );
      reportController.set('backUrl', router.get('currentPath'));
      router.transitionTo('reports.student-collection-analytics', {
        queryParams
      });
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Boolean} if the location is of type course
   */
  isCourse: Ember.computed.equal('location.type', CONTENT_TYPES.COURSE),

  /**
   * @property {Boolean} if the location is of type assessment
   */
  isAssessment: Ember.computed.equal('location.type', CONTENT_TYPES.ASSESSMENT),

  /**
   * @property {Boolean} if the current activity is of type assessment
   */
  isCurrentAssessment: Ember.computed.equal(
    'location.currentType',
    CONTENT_TYPES.ASSESSMENT
  ),

  /**
   * @property {LearnerLocation} location information
   */
  location: null,

  /**
   * @property {LearnerPerformance} performance information
   */
  performance: null,

  /**
  * Percentage value for the score chart
  * @property {String}
  */
  percentageToShow: Ember.computed('performance.scoreInPercentage', function() {
    const score = this.get('performance.scoreInPercentage');
    return score || score === 0 ? `${score}%` : '--';
  }),

  /**
   * @property {String} source value when playing a collection/assessment
   */
  source: PLAYER_EVENT_SOURCE.INDEPENDENT_ACTIVITY,

  /**
   * @property {String} time spent chart background color
   */
  timeSpentColor: TIME_SPENT_CHART_COLOR
});
