import Ember from 'ember';
/**
 * Stacked Horizontal Bar Chart
 *
 * Component responsible for showing the stacked horizontal bar chart.
 * This component takes the dimensions of height and width from the parent element.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['charts', 'gru-x-bar-chart'],

  // -------------------------------------------------------------------------
  // Properties
  /**
   *
   * Sample
   * [
   *    {
   *      color: failColor,
   *      percentage: Math.round(dataObj.incorrect / dataObj.total * 100)
   *    },
   *    {
   *      color: correctColor,
   *      percentage: Math.round(dataObj.correct / dataObj.total * 100)
   *    },
   *    ...
   *  ]
   * @property {Array} options data
   */
  data: null,

  isFull: Ember.computed('data.[]', function() {
    var sum = this.get('data').reduce(function(previousValue, value) {
      return previousValue + value.percentage;
    }, 0);
    return sum >= 100;
  }),

  styles: Ember.computed('data', function() {
    return this.get('data').map(function(questionData) {
      return Ember.String.htmlSafe(
        `background-color: ${questionData.color}; width: ${questionData.percentage}%;`
      );
    });
  }),

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    if (!this.validValues()) {
      Ember.Logger.warn('Graph values sum more than 100');
    }
  },

  /*
   * Check if the values are up 100%
   */
  validValues: function() {
    var sum = this.get('data').reduce(function(previousValue, value) {
      return previousValue + parseInt(value.percentage);
    }, 0);
    return sum <= 100;
  }
});
