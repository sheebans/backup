import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';
import { VIEW_LAYOUT_PICKER_OPTIONS } from 'quizzes-addon/config/quizzes-config';
import ContextResult from 'quizzes-addon/models/result/context';

export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'qz-class-assessment-report'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Set a new emotion as selected and update the component appearance accordingly
     *
     * @function actions:changeView
     * @param {string} layout type @see gru-view-layout-picker
     * @returns {undefined}
     */
    changeView: function(layout) {
      const thumbnails = layout === VIEW_LAYOUT_PICKER_OPTIONS.LIST;
      this.set('isTableView', !thumbnails);
    },

    /**
     * When showing the student details
     * @param {string} studentId
     */
    viewAssessmentReport: function(studentId) {
      Ember.Logger.debug(
        `Class assessment report: student with ID ${studentId} was selected`
      );

      const reportData = this.get('reportData');
      const assessment = this.get('assessment');
      const reportEvent = reportData.findByProfileId(studentId)[0];
      const resourceResults = reportEvent.get('resourceResults');
      resourceResults.forEach(function(resourceResult) {
        const resource = assessment
          .get('resources')
          .findBy('id', resourceResult.get('resourceId'));
        resourceResult.set('resource', resource);
      });

      const contextResult = ContextResult.create({
        reportEvent,
        averageReaction: Ember.computed.alias('reportEvent.averageReaction'),
        correctPercentage: Ember.computed.alias('reportEvent.averageScore'),
        correctAnswers: Ember.computed.alias('reportEvent.totalCorrect'),
        currentResourceId: Ember.computed.alias(
          'reportEvent.currentResourceId'
        ),
        totalTimeSpent: Ember.computed.alias('reportEvent.totalTimeSpent'),
        totalAttempts: 1,
        selectedAttempt: 1,
        resourceResults: Ember.computed.alias('reportEvent.resourceResults'),
        collection: assessment,
        isRealTime: this.get('isRealTime'),
        showAttempts: this.get('showAttempts')
      });

      const modalModel = {
        contextResult,
        width: '80%'
      };
      this.actions.showModal.call(
        this,
        'reports.qz-assessment-report',
        modalModel,
        null,
        'qz-assessment-report-modal',
        true
      );
    },

    /**
     * When showing the question details
     * @param {string} questionId
     */
    viewQuestionDetail: function(questionId) {
      Ember.Logger.debug(
        `Assessment report: question with ID ${questionId} was selected`
      );

      const question = this.get('assessment.resources').findBy(
        'id',
        questionId
      );
      const modalModel = {
        anonymous: this.get('anonymous'),
        selectedQuestion: question,
        reportData: this.get('reportData'),
        width: '75%'
      };
      this.actions.showModal.call(
        this,
        'reports.class-assessment.qz-questions-detail',
        modalModel,
        null,
        'qz-questions-detail-modal',
        true
      );
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: false,

  /**
   * @prop { Collection } assessment - Assessment taken by a group of students
   */
  assessment: Ember.computed.alias('reportData.collection'),

  /**
   * @prop { boolean } isTableView - is the table view currently selected?
   */
  isTableView: true,

  /**
   * @property { ReportData } report data
   */
  reportData: null,

  /**
   * @prop { boolean } isRealTime - if the report is a real time report
   */
  isRealTime: false,

  /**
   * @prop { boolean } isRealTime - if the report is a real time report
   */
  showAttempts: false
});
