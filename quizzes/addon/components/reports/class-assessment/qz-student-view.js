import Ember from 'ember';
import QuestionResult from 'quizzes-addon/models/result/question';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'qz-student-view'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * @function actions:selectQuestion
     * @param {Number} questionId
     */
    selectQuestion: function(questionId) {
      this.get('onSelectQuestion')(questionId);
    },

    /**
     * When clicking at the student header
     * @param {string} studentId
     */
    selectStudent: function(studentId) {
      this.get('onSelectStudent')(studentId);
    },

    /**
     * Sort students view
     * @function actions:sort
     */
    sortStudentView: function(sort) {
      this.set('sortAlphabetically', sort);
      if (this.get('sortAlphabetically')) {
        this.set('studentPerformanceListSorting', ['student.profileName']);
      } else {
        this.set('studentPerformanceListSorting', [
          'student.averageScore:desc',
          'student.profileName'
        ]);
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
   * @prop { Collection } assessment
   */
  assessment: Ember.computed.alias('reportData.collection'),

  /**
   * @prop { ReportData } reportData
   */
  reportData: null,

  /**
   * Indicate if the table is to be sorted alphabetically using the students full name, if not, sort by average of score.
   *
   * @property {Boolean}
   */
  sortAlphabetically: false,

  /**
   * Property containing t he sorted list
   *
   * @property {Ember.computed}
   */
  sortedStudentPerformance: Ember.computed.sort(
    'studentPerformanceList',
    'studentPerformanceListSorting'
  ),

  /**
   * Returns a convenient structure to display the student view
   * @return [] students performance info
   */
  studentPerformanceList: Ember.computed(
    'reportData.reportEvents.@each.updated',
    function() {
      const component = this;
      const reportEvents = component.get('reportData.reportEvents');
      return reportEvents.map(function(studentData) {
        const studentReportData = studentData
          .get('questionResults')
          .reduce(function(studentReport, result) {
            studentReport[result.resourceId] = result;
            return studentReport;
          }, {});

        component.get('assessment.resources').forEach(function(resource) {
          if (!studentReportData[resource.id]) {
            studentReportData[resource.id] = QuestionResult.create({
              score: 0,
              resourceId: resource.id
            });
          }
        });

        const studentResourceResults = component.getReportDataResults(
          studentReportData
        );
        return Ember.Object.create({
          student: studentData,
          reportData: studentResourceResults
        });
      });
    }
  ),

  /**
   * Array containing the criteria that controls the sorting, default is sort alphabetically, default is defined by property '@sortAlphabetically'
   *
   * @property {Array}
   */
  studentPerformanceListSorting: [
    'student.averageScore:desc',
    'student.profileName'
  ],

  // -------------------------------------------------------------------------
  // Methods

  /**
   *
   * Returns only the QuestionResult instances or an empty object when the student has no value for a question
   *
   * studentReportData param looks like
   *
   *    {
   *      questionId1 : QuestionResult,
   *      questionId2 : QuestionResult,
   *      questionId3 : QuestionResult
   *    }
   *
   * @param {Object} studentReportData
   * @returns {QuestionResult[]}
   */
  getReportDataResults: function(studentReportData) {
    const component = this;
    const questions = component.get('assessment.resources');
    return questions.map(question => studentReportData[question.get('id')]);
  }
});
