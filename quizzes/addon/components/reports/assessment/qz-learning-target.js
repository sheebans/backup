import Ember from 'ember';

/**
 * Learning Target Component
 *
 * Component responsible to display the details for a learning target
 *
 * @module
 * @augments Ember/Component
 */
export default Ember.Component.extend({
  maxNumberOfDisplayableResources: 5,

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Handle event triggered by gru-bubbles
     */
    bubbleSelect: function(bubbleOption) {
      this.sendAction('onBubbleSelect', bubbleOption);
    }
  },

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-learning-target'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Learning target to be displayed by the component
   *
   * @property {Ember.Object}
   */
  learningTarget: null,

  /**
   * @property {AssessmentResult} assessment
   */
  assessmentResult: null,

  /**
   * Concise model to be used by the gru-bubbles component
   * @prop {Object[]}
   */
  bubbleQuestions: Ember.computed(
    'learningTarget.relatedQuestions.[]',
    'assessmentResult.questionResults.[]',
    function() {
      const results = this.get('assessmentResult.questionResults').sortBy(
        'resource.sequence'
      );
      return this.getBubblesQuestions(results);
    }
  ),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Return a list of questions associated a specific learning target to be used by the gru-bubbles component
   * @param QuestionResult[]
   */
  getBubblesQuestions: function(questionResults) {
    const results = this.getQuestions(questionResults);
    return results.map(function(questionResult) {
      return Ember.Object.create({
        label: questionResult.get('resource.sequence'),
        status: questionResult.get('correct') ? 'correct' : 'incorrect',
        value: questionResult.get('resourceId')
      });
    });
  },

  getQuestions: function(questionResults) {
    const relatedQuestions = this.get('learningTarget.relatedQuestions');
    const questions = questionResults.filter(function(questionResult) {
      return relatedQuestions.includes(questionResult.get('resourceId'));
    });
    return questions;
  }
});
