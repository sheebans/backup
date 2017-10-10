import Ember from 'ember';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

export default Ember.Component.extend(ConfigurationMixin, {
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
    },

    /**
     * View Open Ended report
     * @param questionId {String}
     */
    viewOEReport: function(questionId) {
      this.sendAction('onViewOEReport', questionId);
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

  classNames: ['reports', 'assessment', 'gru-questions'],

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
   * Indicates if the reaction bar is visible
   * @property {boolean}
   */
  showReactionBar: true,

  /**
   * Indicates if the view is open ended
   * @property {boolean}
   */
  isOpenEnded: Ember.computed('viewMode', function() {
    return this.get('viewMode') === 'open-ended';
  })
});
