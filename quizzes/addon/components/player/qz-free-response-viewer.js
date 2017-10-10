import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:quizzes/configuration
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['player', 'qz-free-response-viewer'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Show full rubric
     */
    showFullRubric: function() {
      this.set('showFullRubric', !this.get('showFullRubric'));
    },
    /**
     * Submit Question
     */
    submitQuestion: function() {
      this.sendAction('onSubmitQuestion');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * When loading the user answer
   */
  updateUserAnswer: Ember.on('init', function() {
    const component = this;
    component.setAnswers();
  }),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {string} the user answer
   */
  answer: '',

  /**
   * @property {Array[RubricCategory]} categories
   */
  categories: Ember.computed('hasRubric', function() {
    return this.get('question.rubric').get('categories');
  }),

  /**
   * Indicates if the question has a rubric assigned
   * @return {bool}
   */
  hasRubric: Ember.computed.bool('question.rubric.rubricOn'),

  /**
   * Indicates if rubric contains a url
   * @return {bool}
   */
  hasUrl: Ember.computed.bool('question.rubric.url'),

  /**
   * Indicates when the answer is completed
   * @return {bool}
   */
  isAnswerCompleted: Ember.computed.bool('answer.length'),

  /**
   * Free Response Question
   * @property {Question} question
   */
  question: null,

  /**
   * Parsed Question Text
   * @property {String} questionText
   */
  questionText: null,

  /**
   * @property {Boolean} showFullRubric
   */
  showFullRubric: false,

  /**
   * Indicates when the answer is completed
   * @return {bool}
   */
  showPanel: Ember.computed('hasRubric', 'hasUrl', 'categories', function() {
    return (
      this.get('hasRubric') &&
      (this.get('categories.length') || this.get('hasUrl'))
    );
  }),

  /**
   * @property {Number} totalPoints
   */
  totalPoints: Ember.computed('hasRubric', function() {
    return this.get('question.rubric').get('totalPoints');
  }),

  /**
   * Returns the thumbnail url if it exists
   * @property {String}
   */
  thumbnail: Ember.computed('question.thumbnail', function() {
    const cdnURL = this.get(
      'configurationService.configuration.properties.cdnURL'
    );
    return this.get('question.thumbnail')
      ? `${cdnURL}${this.get('question.thumbnail')}`
      : null;
  }),

  // -------------------------------------------------------------------------
  // Observers

  /**
   * When the user changes the response
   */
  updateAnswerObserver: function() {
    this.notify(false);
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Notifies answer events
   * @param {boolean} onLoad if this was called when loading the component
   */
  notify: function(onLoad) {
    const component = this,
      answer = [{ value: Ember.$.trim(component.get('answer')) }];
    component.notifyAnswerChanged(answer);
    if (component.get('isAnswerCompleted')) {
      if (onLoad) {
        component.notifyAnswerLoaded(answer);
      } else {
        component.notifyAnswerCompleted(answer);
      }
    } else {
      component.notifyAnswerCleared(answer);
    }
  },

  /**
   * Set answer
   * */
  setAnswers: function() {
    if (this.get('hasUserAnswer')) {
      const userAnswer = this.get('userAnswer.firstObject.value');
      this.set('answer', userAnswer);
      this.notify(true);
    }
    // set observer for answer update
    this.addObserver('answer', this.updateAnswerObserver);
  }
});
