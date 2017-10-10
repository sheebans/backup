import Ember from 'ember';
import { toLocal } from 'gooru-web/utils/utils';
import { ASSESSMENT_SHOW_VALUES } from 'gooru-web/config/config';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

/**
 *
 * Controls the access to the analytics data for a
 * student related to a collection of resources
 *
 */

export default Ember.Controller.extend(ConfigurationMixin, {
  queryParams: [
    'classId',
    'courseId',
    'unitId',
    'lessonId',
    'collectionId',
    'userId',
    'type',
    'role'
  ],
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Ember.Service} Service to retrieve an assessment result
   */
  performanceService: Ember.inject.service('api-sdk/performance'),
  // -------------------------------------------------------------------------
  // Actions
  actions: {
    selectAttempt: function(attempt) {
      const session = this.get('completedSessions')[attempt - 1];
      this.loadSession(session);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean} areAnswersHidden - Should answer results be hidden?
   */
  areAnswersHidden: Ember.computed(
    'collection.isAssessment',
    'collection.showFeedback',
    function() {
      return (
        this.get('collection.isAssessment') &&
        this.get('collection.showFeedback') === ASSESSMENT_SHOW_VALUES.NEVER
      );
    }
  ),

  /**
   * @property {boolean} isAnswerKeyHidden - Should the answer key be hidden?
   */
  isAnswerKeyHidden: Ember.computed(
    'collection.isAssessment',
    'collection.showKey',
    function() {
      return (
        this.get('collection.isAssessment') && !this.get('collection.showKey')
      );
    }
  ),

  /**
   * @property {Collection}
   */
  collection: null,

  /**
   * @property {AssessmentResult}
   */
  assessmentResult: null,

  /**
   * @property {UserSession[]}
   */
  completedSessions: [],

  /**
   * @property {Context}
   */
  context: null,

  /**
   * @property {Lesson}
   */
  lesson: null,

  /**
   * @property {string} indicates if it is collection or assessment
   */
  type: null,

  /**
   * @property {string} indicates if it is a student or teacher view
   */
  role: null,

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal('role', 'student'),

  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.not('isStudent'),

  /**
   * indicates if it is assessment type
   * @property {boolean}
   */
  isAssessment: Ember.computed.equal('type', 'assessment'),

  /**
   * indicates if it is collection type
   * @property {boolean}
   */
  isCollection: Ember.computed.not('isAssessment'),

  /**
   * indicates the session id of collection
   * @property {string}
   */
  collectionSessionId: null,
  /**
   * Indicates which is the url to go back when pressing the button
   * this is useful when coming from the player out of the context of a class
   * this needs to be improved so it works when refreshing the page
   * @property {string}
   */
  backUrl: null,

  /**
   * Indicates if the back navigation is visible
   * @property {boolean} showBackLink
   */
  showBackLink: Ember.computed.alias(
    'features.collections.player.showBackLink'
  ),

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
  loadSession: function(session) {
    const controller = this;
    const context = controller.get('context');
    if (session) {
      //collections has no session
      context.set('sessionId', session.sessionId);
    }
    const performanceService = controller.get('performanceService');
    const loadStandards = session && context.get('isInContext');
    return performanceService
      .findAssessmentResultByCollectionAndStudent(context, loadStandards)
      .then(function(assessmentResult) {
        controller.setAssessmentResult(assessmentResult, session);
      });
  },

  setAssessmentResult: function(assessmentResult, session) {
    const controller = this;
    const collection = controller.get('collection');
    const totalAttempts = controller.get('completedSessions.length'); //TODO this is coming wrong from BE
    assessmentResult.merge(collection);
    assessmentResult.set('totalAttempts', totalAttempts);
    if (session && session.eventTime) {
      assessmentResult.set('submittedAt', toLocal(session.eventTime));
    }
    controller.set('assessmentResult', assessmentResult);
  },

  resetValues: function() {
    this.set('assessmentResult', null);
    this.set('completedSessions', []);
    this.set('context', null);
    this.set('lesson', null);
    this.set('type', undefined);
    this.set('classId', undefined);
    this.set('courseId', undefined);
    this.set('unitId', undefined);
    this.set('lessonId', undefined);
    this.set('collectionId', undefined);
    this.set('userId', undefined);
    this.set('role', undefined);
    this.set('backUrl', undefined);
  }
});
