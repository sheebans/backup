import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Selects Performance Option or not
     * @function actions:selectPerformanceOption
     */
    selectPerformanceOption: function(showPerformance) {
      if (!this.get('isAnswerKeyHidden')) {
        this.set('showPerformance', showPerformance);
      }
    }
  },
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-questions'],

  classNameBindings: [
    'isAnswerKeyHidden:key-hidden',
    'showPerformance:performance-view'
  ],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean} isAnswerKeyHidden - Should the answer key be hidden?
   */
  isAnswerKeyHidden: false,

  /**
   * List of questions to be displayed by the component
   *
   * @constant {Array}
   */
  results: null,

  /**
   * Indicate if the table show the performance columns
   *
   * @property {Boolean}
   */
  showPerformance: true,

  /**
   * Indicate if the table show the score column
   *
   * @property {Boolean}
   */
  showScore: true,

  /**
   * The components title
   *
   * @property {String}
   */
  title: null,

  /**
   * Indicates if the view is open ended
   * @property {boolean}
   */
  isOpenEnded: Ember.computed('viewMode', function() {
    return this.get('viewMode') === 'open-ended';
  })
});
