import Ember from 'ember';
import { QUESTION_TYPES } from 'gooru-web/config/question';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-question-options'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * selectOption selects menu option
     */
    selectOption: function(option) {
      this.sendAction('onSelectedOption', option);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {*} questionTypes
   */
  questionTypes: QUESTION_TYPES,

  /**
   * Types of question selected
   *  @property {array} selectedOptionTypes
   *
   */
  selectedOptionTypes: Ember.A([]),

  /**
   * True if multiple-choice option is selected
   *  @property {boolean} multipleChoiceSelected
   *
   */

  multipleChoiceSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.multipleChoice);
  }),

  /**
   * True if multiple-answer option is selected
   *  @property {boolean} multipleAnswerSelected
   *
   */

  multipleAnswerSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.multipleAnswer);
  }),

  /**
   * True if true-false option is selected
   *  @property {boolean} trueFalseSelected
   *
   */

  trueFalseSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.trueFalse);
  }),

  /**
   * True if fib option is selected
   *  @property {boolean} fibSelected
   *
   */

  fibSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.fib);
  }),

  /**
   * Free response option is selected
   *  @property {boolean} freeResponseSelected
   *
   */

  freeResponseSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.openEnded);
  }),

  /**
   * True if ht-highlight option is selected
   *  @property {boolean} htHighlightSelected
   *
   */

  htHighlightSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.hotTextHighlight);
  }),

  /**
   * True if ht-reorder option is selected
   *  @property {boolean} htReorderSelected
   *
   */

  htReorderSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.hotTextReorder);
  }),

  /**
   * True if hs-text option is selected
   *  @property {boolean} hsTextSelected
   *
   */

  hsTextSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.hotSpotText);
  }),

  /**
   * True if hs-images option is selected
   *  @property {boolean} hsImagesSelected
   *
   */

  hsImagesSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.includes(QUESTION_TYPES.hotSpotImage);
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
