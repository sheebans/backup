import Ember from 'ember';
import RubricSerializer from 'gooru-web/serializers/rubric/rubric';
import RubricAdapter from 'gooru-web/adapters/rubric/rubric';

/**
 * Rubric Service
 *
 * Service responsible for performing CRUD operations on a rubric model
 *
 * @typedef {Object} RubricService
 * @augments Ember/Service
 */
export default Ember.Service.extend({
  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    this.set(
      'serializer',
      RubricSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'adapter',
      RubricAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {RubricSerializer} serializer
   */
  serializer: null,

  /**
   * @property {RubricAdapter} adapter
   */
  adapter: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Creates a rubric
   * @param {Rubric} rubric
   * @returns {Promise|Rubric} returns the rubric model with the newly assigned ID
   */
  createRubric: function(rubric) {
    var data = this.get('serializer').serializeCreateRubric(rubric);

    return this.get('adapter').createRubric(data).then(function(rubricId) {
      rubric.set('id', rubricId);
      return rubricId;
    });
  },

  /**
   * Updates a rubric
   * @param {Rubric} rubric
   * @returns {Promise|Rubric} returns the rubric model with the newly assigned ID
   */
  updateRubric: function(rubric) {
    var data = this.get('serializer').serializeUpdateRubric(rubric);
    return this.get('adapter').updateRubric(data, rubric.get('id'));
  },

  /**
   * Updates score of question
   * @param {Rubric} rubric
   * @returns {Promise|Rubric} returns the rubric model with the newly assigned ID
   */
  updateScore: function(rubricData, questionId) {
    var data = this.get('serializer').serializeUpdateScore(rubricData);
    return this.get('adapter').updateScore(data, questionId);
  },

  /**
   * Deletes a rubric
   * @param {String} rubricId
   * @returns {Promise|boolean} returns true if deleted
   */
  deleteRubric: function(rubricId) {
    return this.get('adapter').deleteRubric(rubricId);
  },

  /**
   * Returns rubric
   * @param {string} rubricId
   * @returns {Promise|Rubric}
   */
  getRubric: function(rubricId) {
    const service = this;
    return service.get('adapter').getRubric(rubricId).then(function(data) {
      return service.get('serializer').normalizeRubric(data);
    });
  },

  /**
   * Returns user rubrics
   * @param {string} userId
   * @returns {Promise|Rubric[]}
   */
  getUserRubrics: function(userId) {
    const service = this;
    return service.get('adapter').getUserRubrics(userId).then(function(data) {
      return service.get('serializer').normalizeGetRubrics(data);
    });
  },

  /**
   * Copies a rubric
   * @param {String} rubricId
   * @returns {Promise|string} returns the copied id
   */
  copyRubric: function(rubricId) {
    return this.get('adapter').copyRubric(rubricId);
  },

  /**
   * Associates a rubric with a question
   * @param {String} rubricId
   * @param {String} questionId
   * @returns {Promise|boolean} true when successful
   */
  associateRubricToQuestion: function(rubricId, questionId) {
    return this.get('adapter').associateRubricToQuestion(rubricId, questionId);
  },

  /**
   * Returns the list of Questions that the teacher needs to grade.
   * @param {string} classId
   * @param {string} courseId
   * @returns {Promise|GradeQuestion}
   */
  getQuestionsToGrade: function(classId, courseId) {
    const service = this;
    return service
      .get('adapter')
      .getQuestionsToGrade(classId, courseId)
      .then(data => service.get('serializer').normalizeQuestionsToGrade(data));
  },

  /**
   * Returns the list of Students for a Question to be graded
   * @param {string} questionId
   * @param {string} classId
   * @param {string} courseId
   * @param {string} collectionId
   * @returns {Promise|GradeQuestionStudents}
   */
  getStudentsForQuestion: function(
    questionId,
    classId,
    courseId,
    collectionId
  ) {
    const service = this;
    return service
      .get('adapter')
      .getStudentsForQuestion(questionId, classId, courseId, collectionId)
      .then(data =>
        service.get('serializer').normalizeStudentsForQuestion(data)
      );
  },

  /**
   * Returns Answer for Rubric Grading
   * @param {string} studentId
   * @param {string} classId
   * @param {string} courseId
   * @param {string} collectionId
   * @param {string} questionId
   * @param {string} unitId
   * @param {string} lessonId
   * @returns {Promise|GradeQuestionAnswer}
   */
  getAnswerToGrade: function(
    studentId,
    classId,
    courseId,
    collectionId,
    questionId,
    unitId = null,
    lessonId = null
  ) {
    const service = this;
    return service
      .get('adapter')
      .getAnswerToGrade(
        studentId,
        classId,
        courseId,
        collectionId,
        questionId,
        unitId,
        lessonId
      )
      .then(data => service.get('serializer').normalizeAnswerToGrade(data));
  },

  /**
   * Set student rubric grades
   * @param {RubricGrade} rubricGrade
   * @returns {Promise|RubricGrade} returns the rubric model with the newly assigned ID
   */
  setStudentRubricGrades: function(rubricGrade) {
    var data = this.get('serializer').serializeStudentRubricGrades(rubricGrade);
    return this.get('adapter').setStudentRubricGrades(data);
  },

  /**
   * Gets report of Rubric Grading for a Question
   * @param {string} studentId
   * @param {string} classId
   * @param {string} courseId
   * @param {string} collectionId
   * @param {string} questionId
   * @param {string} sessionId
   * @returns {Promise|RubricGrade}
   */
  getRubricQuestionSummary: function(
    studentId,
    classId,
    courseId,
    collectionId,
    questionId,
    sessionId
  ) {
    const service = this;
    return service
      .get('adapter')
      .getRubricQuestionSummary(
        studentId,
        classId,
        courseId,
        collectionId,
        questionId,
        sessionId
      )
      .then(data =>
        service.get('serializer').normalizeRubricQuestionSummary(data)
      );
  }
});
