import Ember from 'ember';

/**
 * Library card
 *
 * Component responsible of showing the library information in cards, so that most useful information is summarized there.
 * @module
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-partner-library-card'],

  // -------------------------------------------------------------------------
  // Events

  init() {
    let component = this;
    component._super(...arguments);
  },

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Library} content
   */
  content: null,

  /**
   * @property {boolean} Indicates if library has 1 or more courses
   */
  hasCourses: Ember.computed.gt('content.courseCount', 0),

  /**
   * @property {boolean} Indicates if library has 1 or more collections
   */
  hasCollections: Ember.computed.gt('content.collectionCount', 0),

  /**
   * @property {boolean} Indicates if library has 1 or more assessments
   */
  hasAssessments: Ember.computed.gt('content.assessmentCount', 0),

  /**
   * @property {boolean} Indicates if library has 1 or more resources
   */
  hasResources: Ember.computed.gt('content.resourceCount', 0),

  /**
   * @property {boolean} Indicates if library has 1 or more questions
   */
  hasQuestions: Ember.computed.gt('content.questionCount', 0),

  /**
   * @property {boolean} Indicates if library has 1 or more rubrics
   */
  hasRubrics: Ember.computed.gt('content.rubricCount', 0)

  // -------------------------------------------------------------------------
  // Methods
});
