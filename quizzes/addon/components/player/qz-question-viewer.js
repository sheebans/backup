import Ember from 'ember';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import {
  KEY_CODES,
  ASSESSMENT_SHOW_VALUES,
  FEEDBACK_EMOTION_VALUES,
  FIB_REGEX
} from 'quizzes-addon/config/quizzes-config';

/**
 * Player question viewer
 *
 * Component responsible for providing a frame where all question types
 * will be displayed i.e. it will be responsible for selecting any specific
 * question components per question type.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:quizzes/configuration
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-question-viewer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the question answer has been changed
     * @param {Resource} question the question
     */
    changeAnswer: function(question) {
      if (!this.get('submitted')) {
        //todo track analytics
        this.set('question', question);
      }
    },

    /**
     * When the question answer has been cleared
     * @param {Resource} question the question
     */
    clearAnswer: function(question) {
      if (!this.get('submitted')) {
        //todo track analytics
        this.set('question', question);
        this.set('answerCompleted', false);
      }
    },

    /**
     * When the question answer has been completed
     * @param {Resource} question the question
     * @param { { answer: Object, correct: boolean } } stats
     */
    completeAnswer: function(question, answer) {
      if (!this.get('submitted')) {
        const questionResult = this.get('questionResult');
        questionResult.set('answer', answer);

        this.set('question', question);
        this.set('answerCompleted', true);
      }
    },

    /**
     * When the question answer was loaded from BE
     * @param {Resource} question the question
     * @param { { answer: Object, correct: boolean } } stats
     */
    loadedAnswer: function(question, answer) {
      if (!this.get('submitted')) {
        const questionResult = this.get('questionResult');
        questionResult.set('answer', answer);

        this.set('question', question);
        this.set('answerCompleted', false);
      }
    },

    /**
     * Show explanation action triggered
     */
    showExplanation: function() {
      this.set('isExplanationShown', true);
    },
    /**
    * Action triggered when the user see a hint
    */
    showHint: function() {
      var actualHint = this.get('actualHint');

      this.get('hintsToDisplay').pushObject(
        this.get('question.hints').objectAt(actualHint)
      );
      actualHint += 1;
      this.set('actualHint', actualHint);
    },

    /**
     * When the question is submitted
     */
    submitQuestion: function() {
      this.submitQuestion();
    }
  },
  // -------------------------------------------------------------------------
  // Events

  /**
   * Removed keyup handler when the component will destroy
   */
  disableListenToEnter: Ember.on('willDestroyElement', function() {
    $(document).off('keyup');
  }),

  /**
   * Listen to enter in order to submit the question when the user press enter
   */
  listenToEnter: Ember.on('didInsertElement', function() {
    const component = this;
    $(document).on('keyup', function(e) {
      if (e.which === KEY_CODES.ENTER) {
        if (!component.get('isSubmitDisabled')) {
          if (!component.get('question.isOpenEnded')) {
            component.submitQuestion();
          }
        }
      }
    });
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Hits available for a question
   * @property {number} availableHints
   */
  actualHint: 0,

  /**
   * @property {boolean} indicates when the answer is completed
   */
  answerCompleted: false,

  /**
   * @property {string} Return the question body and modified the text if the question is
   * FIB to show the correct format.
   */
  questionBody: Ember.computed(
    'question.body',
    'question.description',
    function() {
      const component = this;
      let text = this.get('question.body');

      if (component.get('question.isHotTextHighlight')) {
        text = this.get('question.description');
      }

      if (component.get('question.isFIB')) {
        const regex = new RegExp(FIB_REGEX.source, 'g');
        text = component.get('question.body').replace(regex, '_______');
      }
      return text;
    }
  ),

  /**
   * Hits available for a question
   * @property {number} availableHints
   */
  availableHints: Ember.computed('actualHint', 'question', function() {
    return this.get('question.hints.length') - this.get('actualHint');
  }),

  /**
   * Default button text key
   * @property {string}
   */
  buttonTextKey: 'common.save',

  /**
   * The collection
   * @property {Collection}
   */
  collection: null,

  /**
   * Indicates when the question has explanation
   * @property {boolean}
   */
  doesNotHaveExplanation: Ember.computed.not('question.explanation'),

  /**
   * Unicode value depending on the correctness of the question
   * @property {boolean}
   */
  feedbackUnicode: Ember.computed('questionResult.correct', function() {
    return this.get('questionResult.correct')
      ? FEEDBACK_EMOTION_VALUES.CORRECT
      : FEEDBACK_EMOTION_VALUES.INCORRECT;
  }),

  /**
   * Indicate if the question is a free response question
   * @property {boolean}
   */
  freeResponse: Ember.computed.equal('question.type', QUESTION_TYPES.openEnded),

  /**
   * Hints to display
   * @property {Array} hintsToDisplay
   */
  hintsToDisplay: Ember.A(),

  /**
   * Default instructions action text key
   * @property {string}
   */
  instructionsActionTextKey: 'common.save',

  /**
   * Key to show the correct/incorrect message
   * @property {String} isCorrectMessageKey
   */
  isCorrectMessageKey: Ember.computed('questionResult.correct', function() {
    return this.get('questionResult.correct')
      ? 'common.answer-correct'
      : 'common.answer-incorrect';
  }),

  /**
   * Is the explanation button disabled?
   * @property {boolean} disableHint
   */
  isExplanationButtonDisabled: Ember.computed.or(
    'isExplanationShown',
    'doesNotHaveExplanation'
  ),

  /**
   * Is the explanation shown?
   * @property {boolean} disableExplanation
   */
  isExplanationShown: false,

  /**
   * Is the hints button disabled?
   * @property {boolean} disableHint
   */
  isHintButtonDisabled: Ember.computed.not('availableHints'),

  /**
   * @property {boolean} indicates when the inputs are enabled
   */
  isInputDisabled: Ember.computed(
    'questionResult.submitted',
    'collection.showFeedback',
    function() {
      const showFeedback =
        this.get('collection.showFeedback') ===
        ASSESSMENT_SHOW_VALUES.IMMEDIATE;
      return (
        (showFeedback &&
          this.get('isStudent') &&
          this.get('questionResult.submitted')) ||
        this.get('submitted')
      );
    }
  ),

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal('role', 'student'),

  /**
   * @property {boolean} indicates when the submit functionality is enabled
   */
  isSubmitDisabled: Ember.computed(
    'answerCompleted',
    'submitted',
    'questionResult.submitted',
    'collection.showFeedback',
    function() {
      const showFeedback =
        this.get('collection.showFeedback') ===
        ASSESSMENT_SHOW_VALUES.IMMEDIATE;
      if (
        !showFeedback ||
        this.get('isTeacher') ||
        !this.get('questionResult.submitted')
      ) {
        return this.get('submitted') || !this.get('answerCompleted');
      }
      return false;
    }
  ),

  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.not('isStudent'),

  /**
   * @property {string} on submit question action
   */
  onSubmitQuestion: 'submitQuestion',

  /**
   * The question
   * @property {Resource} question
   */
  question: null,

  /**
   * Question result, it is passed as a parameter for this component
   * @property {QuestionResult}
   */
  questionResult: null,

  /**
   * Indicates the user's role, could be 'student', 'teacher' or null
   * @property {string}
   */
  role: null,

  /**
   * Indicates if feedback should be shown
   * @property {boolean}
   */
  showFeedback: Ember.computed(
    'collection.showFeedback',
    'questionResult.submitted',
    function() {
      const feedback =
        this.get('collection.showFeedback') ===
        ASSESSMENT_SHOW_VALUES.IMMEDIATE;
      return (
        feedback &&
        this.get('isStudent') &&
        this.get('questionResult.submitted')
      );
    }
  ),

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false,

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
   * Observes for the question itself
   * When it is changed some data should be reloaded
   */
  reloadQuestion: function() {
    this.setProperties({
      actualHint: 0,
      answerCompleted: false,
      hintsToDisplay: Ember.A(),
      isExplanationShown: false
    });
  }.observes('question'),

  // -------------------------------------------------------------------------
  // Methods

  submitQuestion: function() {
    if (!this.get('submitted')) {
      const questionResult = this.get('questionResult');
      this.sendAction('onSubmitQuestion', this.get('question'), questionResult);
    }
  }
});
