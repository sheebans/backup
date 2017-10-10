import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

/**
 * True or false Question
 * Component responsible for controlling the logic and appearance of a true
 * or false question inside of the {@link player/qz-question-viewer.js}
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments ember/Component
 */
export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-true-false'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the user changes the answer choice selection
     * @param {number} answerId
     * @param {boolean} onLoad if this was called when loading the component
     */
    selectAnswerChoice: function(answerId, onLoad) {
      const component = this;
      const answer = [
        {
          value: answerId
        }
      ];
      component.notifyAnswerChanged(answer);
      if (onLoad) {
        component.notifyAnswerLoaded(answer);
      } else {
        component.notifyAnswerCompleted(answer);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    if (this.get('hasUserAnswer')) {
      this.actions.selectAnswerChoice.call(
        this,
        this.get('userAnswer.firstObject.value'),
        true
      );
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Returns the 'false' answer value
   */
  falseAnswerId: Ember.computed('question.answers', function() {
    const answers = this.get('question.answers');
    const found = answers.filterBy('text', 'False');
    return found ? found.get('firstObject.value') : 'true'; //TODO, is this a data problem?
  }),

  /**
   * Returns the 'true' answer value
   */
  trueAnswerId: Ember.computed('question.answers', function() {
    const answers = this.get('question.answers');
    const found = answers.filterBy('text', 'True');
    return found ? found.get('firstObject.value') : 'true'; //TODO, is this a data problem?
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
