import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';
import { FIB_REGEX } from 'quizzes-addon/config/quizzes-config';

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

  classNames: ['reports', 'assessment', 'questions', 'qz-fib'],

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Return an array with every sentence and user answer, and indicate if is correct or incorrect
   * @return {Array}
   */
  answer: Ember.computed(
    'question',
    'anonymous',
    'userAnswer',
    'question.answers.@each.value',
    function() {
      const component = this;
      const question = component.get('question');
      const questionText = question.get('question.body');
      const questionTextParts = questionText.split(FIB_REGEX);
      let userAnswers = component.get('userAnswer');
      const anonymous = component.get('anonymous');
      let correctAnswers = question.get('question.correctAnswer');

      if (component.get('showCorrect')) {
        userAnswers = question.get('question.correctAnswer');
      }

      correctAnswers = correctAnswers.map(function(correctAnswer) {
        correctAnswer.normalizedValue = correctAnswer.value.toLowerCase();
        return correctAnswer;
      });

      const answers = userAnswers.map(function(answer) {
        const userAnswer = userAnswers.findBy('value', answer.value);
        const correctAnswer = correctAnswers.findBy(
          'normalizedValue',
          userAnswer.value.toLowerCase()
        );
        const correct =
          correctAnswer &&
          correctAnswers.indexOf(correctAnswer) ===
            userAnswers.indexOf(userAnswer);
        const elementClass = anonymous
          ? 'anonymous'
          : correct ? 'correct' : 'incorrect';
        return {
          text: userAnswer.value,
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
    }
  ),

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
