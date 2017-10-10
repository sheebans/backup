import Ember from 'ember';
import { getGradeColor } from 'quizzes-addon/utils/utils';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'qz-student-performance-box'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the user clicks at the box
     */
    selectStudent: function() {
      const component = this;
      component.get('onSelectStudent')(component.get('student.profileId'));
      Ember.Logger.debug(
        `Clicking at student: ${component.get('student.profileId')}`
      );
    },

    /**
     * @function actions:selectQuestion
     * @param {Number} questionId
     */
    selectQuestion: function(questionId) {
      if (questionId) {
        this.get('onSelectQuestion')(questionId);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: false,

  /**
   * @property {Function} onSelectQuestion - Event handler called when a question in a column is selected
   */
  onSelectQuestion: null,

  /**
   * It returns an object representing the status for each question
   * @property {[]} questions
   */
  questions: Ember.computed('reportData.@each.answer', function() {
    const component = this;
    const reportData = component.get('reportData');
    return reportData.map(item => component.getQuestionStatus(item));
  }),

  /**
   * Array containing the QuestionResult or empty object based on the student responses
   * empty object for not started questions
   * @property {QuestionResult[]} reportData
   */
  reportData: null,

  /**
   * @property {number} user assessment score
   */
  score: Ember.computed.alias('student.averageScore'),

  /**
   * @property {String} startedStyle style safe string for started
   */
  startedStyle: Ember.computed('score', 'student.totalAnswered', function() {
    return this.get('student.totalAnswered')
      ? Ember.String.htmlSafe(
        `background-color: ${getGradeColor(this.get('score'))}`
      )
      : '';
  }),

  /**
   * @property {User} student
   */
  student: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Gets the question status
   * @param {QuestionResult} questionResult
   */
  getQuestionStatus: function(questionResult) {
    let status = 'not-started';
    let questionId;
    if (questionResult.get('started')) {
      //if it has been started
      status = questionResult.get('attemptStatus');
      questionId = questionResult.get('questionId');
    }
    return Ember.Object.create({
      status,
      id: questionId
    });
  }
});
