import Ember from 'ember';
import { SCORES } from 'gooru-web/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-metrics-performance-information'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the user clicks at the score
     */
    clickReport: function(performance) {
      if (this.get('onClickReport')) {
        this.sendAction(
          'onClickReport',
          performance,
          this.get('userPerformance')
        );
      }
    }
  },
  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of selected options from the data picker.
   * @property {Array}
   */
  dataPickerOptions: Ember.A(['score']),

  /**
   * The performanceData information
   * @property {performance}
   */

  performanceData: null,

  /**
   * The parent user performance data
   * @property
   */
  userPerformance: null,

  /**
   * Show the score class
   * @property {String}
   */
  scoreClass: Ember.computed('performanceData', function() {
    var performanceDataScore = this.get('performanceData').score;
    var classScore = 'excellent';

    switch (true) {
    case performanceDataScore < SCORES.REGULAR:
      classScore = 'bad';
      break;
    case performanceDataScore >= SCORES.REGULAR &&
        performanceDataScore < SCORES.GOOD:
      classScore = 'regular';
      break;
    case performanceDataScore >= SCORES.GOOD &&
        performanceDataScore < SCORES.VERY_GOOD:
      classScore = 'good';
      break;
    case performanceDataScore >= SCORES.VERY_GOOD &&
        performanceDataScore < SCORES.EXCELLENT:
      classScore = 'very-good';
      break;
    }
    return classScore;
  }),

  /**
   * If score option is selected
   * @property {Boolean}
   */
  showScore: Ember.computed('dataPickerOptions.[]', function() {
    const dataPickerOptions = this.get('dataPickerOptions');
    return dataPickerOptions.includes('score');
  }),
  /**
   * If completion option is selected
   * @property {Boolean}
   */
  showCompletion: Ember.computed('dataPickerOptions.[]', function() {
    const dataPickerOptions = this.get('dataPickerOptions');
    return dataPickerOptions.includes('completion');
  }),

  /**
   * If study time option is selected
   * @property {Boolean}
   */
  showStudyTime: Ember.computed('dataPickerOptions.[]', function() {
    const dataPickerOptions = this.get('dataPickerOptions');
    return dataPickerOptions.includes('time-spent');
  }),

  /**
   * Action name when the user clicks at any report icon
   * @property {string}
   */
  onClickReport: null

  // -------------------------------------------------------------------------

  // Methods
});
