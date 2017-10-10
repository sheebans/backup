import Ember from 'ember';
import QuestionMixin from 'gooru-web/mixins/reports/assessment/questions/question';
import FillInTheBlank from 'gooru-web/utils/question/fill-in-the-blank';

/**
 * Fill in the blank
 *
 * Component responsible for controlling the logic and appearance of a fill in the blank
 * question inside of the assessment report.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'gru-fib'],

  // -------------------------------------------------------------------------
  // Properties

  answer: Ember.computed('question', 'anonymous', function() {
    let component = this;
    let question = component.get('question');
    let questionUtil = this.getQuestionUtil(question);
    let questionText = question.get('fibText');
    let questionTextParts = questionText.split(
      FillInTheBlank.LEGACY_REGEX.text
    );
    let userAnswers = component.get('userAnswer');
    let anonymous = component.get('anonymous');

    if (component.get('showCorrect')) {
      userAnswers = questionUtil.getCorrectAnswer();
    }

    let answers = userAnswers.map(function(userAnswer, index) {
      let userAnswerCorrect = questionUtil.isAnswerChoiceCorrect(
        userAnswer,
        index
      );
      let elementClass = anonymous
        ? 'anonymous'
        : userAnswerCorrect ? 'correct' : 'incorrect';
      return {
        text: userAnswer,
        class: `answer ${elementClass}`
      };
    });

    let sentences = questionTextParts.map(function(questionTextPart) {
      return {
        text: questionTextPart,
        class: 'sentence'
      };
    });

    sentences = userAnswers && userAnswers.length ? sentences : [];

    return this.mergeArrays(sentences, answers);
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Merge sentences and answers arrays
   * @return {Array}
   */
  mergeArrays: function(sentences, answers) {
    answers.forEach(function(item, index) {
      sentences.insertAt(index * 2 + 1, item);
    });
    return sentences;
  }
});
