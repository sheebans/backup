import Ember from 'ember';
import ContextSerializer from 'quizzes-addon/serializers/context/context';
import ReportData from 'quizzes-addon/models/result/report-data';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';
import LearningTarget from 'quizzes-addon/models/result/learning-target';

export default Ember.Object.extend({
  /**
   * @property {ContextSerializer} contextSerializer
   */
  contextSerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'contextSerializer',
      ContextSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Normalizes a ReportData
   * @returns {ReportData}
   */
  normalizeReportData: function(payload) {
    const serializer = this;
    return ReportData.create(Ember.getOwner(this).ownerInjection(), {
      contextId: payload.contextId,
      collectionId: payload.collectionId,
      reportEvents: serializer.normalizeReportDataEvents(
        payload.profileAttempts
      )
    });
  },

  /**
   * Normalizes a ReportDataEvent
   * @returns {ReportDataEvent}
   */
  normalizeReportDataEvent: function(reportEvent) {
    const summary = reportEvent.eventSummary;
    const taxonomySummary = reportEvent.taxonomySummary;
    const reportDataEvent = ReportDataEvent.create(
      Ember.getOwner(this).ownerInjection(),
      {
        attemptId: reportEvent.attemptId,
        collectionId: reportEvent.collectionId,
        contextId: reportEvent.contextId,
        currentResourceId: reportEvent.currentResourceId,
        profileId: reportEvent.profileId,
        resourceResults: this.get('contextSerializer').normalizeResourceResults(
          reportEvent.events
        ),
        isAttemptFinished: reportEvent.isComplete,
        submittedAt: reportEvent.updatedDate
      }
    );
    if (summary) {
      reportDataEvent.setProperties({
        totalAnswered: summary.totalAnswered,
        totalCorrect: summary.totalCorrect,
        averageReaction: summary.averageReaction,
        averageScore: summary.averageScore,
        totalTimeSpent: summary.totalTimeSpent
      });
    }
    if (taxonomySummary) {
      let learningTargets = [];
      if (Ember.isArray(taxonomySummary)) {
        learningTargets = taxonomySummary.map(function(standard) {
          return LearningTarget.create({
            id: standard.taxonomyId,
            mastery: standard.averageScore,
            relatedQuestions: standard.resources
          });
        });
      }
      reportDataEvent.set('mastery', learningTargets);
    }
    return reportDataEvent;
  },

  /**
   * Normalizes report data events
   * @returns {ReportDataEvent[]}
   */
  normalizeReportDataEvents: function(payload) {
    const serializer = this;
    payload = payload || [];
    return payload.map(reportEvent =>
      serializer.normalizeReportDataEvent(reportEvent)
    );
  },

  /**
   * Normalizes attempt ids to an array
   * @returns {String[]}
   */
  normalizeAttemptIds: function(payload) {
    return payload && payload.attempts ? payload.attempts : [];
  }
});
