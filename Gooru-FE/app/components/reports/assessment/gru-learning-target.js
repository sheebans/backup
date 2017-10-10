import Ember from 'ember';

import { correctPercentage } from 'gooru-web/utils/question-result';

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

  classNames: ['reports', 'assessment', 'gru-learning-target'],

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
        'resource.order'
      );
      return this.getBubblesQuestions(results);
    }
  ),
  /**
   * List of questions
   * @prop {QuestionResult[]}
   */
  questionsList: Ember.computed(
    'assessmentResult.questionResults.[]',
    function() {
      return this.getQuestions(this.get('assessmentResult.questionResults'));
    }
  ),
  /**
   * Percentage of correct answers vs. the total number of questions
   * @prop {Number}
   */
  correctPercentage: Ember.computed('questionsList.[]', function() {
    return correctPercentage(this.get('questionsList'));
  }),

  suggestedResources: Ember.computed(
    'learningTarget.suggestedResources.[]',
    function() {
      var suggestedResources = this.get('learningTarget.suggestedResources');
      return suggestedResources.slice(
        0,
        this.get('maxNumberOfDisplayableResources')
      );
    }
  ),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Return a list of questions associated a specific learning target to be used by the gru-bubbles component
   * @param QuestionResult[]
   */
  getBubblesQuestions: function(questionResults) {
    let results = this.getQuestions(questionResults);
    return results.map(function(questionResult) {
      return Ember.Object.create({
        label: questionResult.get('question.order'),
        status: questionResult.get('correct') ? 'correct' : 'incorrect',
        value: questionResult.get('id')
      });
    });
  },

  getQuestions: function(questionResults) {
    let relatedQuestions = this.get('learningTarget.relatedQuestions');
    let questions = questionResults.filter(function(questionResult) {
      return relatedQuestions.includes(questionResult.get('resourceId'));
    });
    return questions;
  }
});
