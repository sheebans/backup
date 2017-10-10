import Ember from 'ember';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
    * Collapses the header section
    * @param {boolean} state
    */
    toggleHeader: function(state) {
      var $panels = $('.header .panel');
      if (state) {
        $panels.slideUp();
      } else {
        $panels.slideDown();
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    var item = this.get('menuItem');
    this.selectItem(item);
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * The course presented to the user
   * @property {Course}
   */
  course: null,

  /**
   * The performance for the presented course
   * @property {Performance}
   */
  performance: null,

  /**
   * The units presented to the user
   * @property {Unit}
   */
  units: null,

  /**
   * The menuItem selected
   * @property {String}
   */
  menuItem: null,

  /**
  * Percentage value for the score chart
  * @property {Boolean}
  */
  percentageToShow: Ember.computed('performance.scoreInPercentage', function() {
    const score = this.get('performance.scoreInPercentage');
    return score || score === 0 ? `${score}%` : '--';
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Selected the menu item
   * @param {string} item
   */
  selectMenuItem: function(item) {
    this.set('menuItem', item);
  }
});
