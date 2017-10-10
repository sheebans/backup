import Ember from 'ember';
import QuestionMixin from 'gooru-web/mixins/reports/assessment/questions/question';

/**
 * Multiple choice
 *
 * Component responsible for show the reorder, what option are selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'gru-reorder'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  answers: Ember.computed('question', function() {
    let component = this;
    let question = component.get('question');
    let questionUtil = component.getQuestionUtil(question);
    let userAnswers = component.get('userAnswer');
    let correctAnswers = questionUtil.getCorrectAnswer();
    if (component.get('showCorrect')) {
      userAnswers = correctAnswers;
    }

    //answer in the correct order
    let answers = question.get('answers').sortBy('order');
    return answers.map(function(answer, index) {
      let userAnswerAtIndex = userAnswers.objectAt(index);
      let correctAnswerAtIndex = correctAnswers.objectAt(index);
      return {
        selectedOrder: userAnswers.indexOf(correctAnswerAtIndex) + 1,
        text: answer.get('text'),
        correct: questionUtil.isAnswerChoiceCorrect(userAnswerAtIndex, index)
      };
    });
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
