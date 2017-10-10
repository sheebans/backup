import Ember from 'ember';
import ConfigurationMixin from 'gooru-web/mixins/configuration';
/**
 * Class navigation
 *
 * Component responsible for enabling more flexible navigation options for the class.
 * For example, where {@link class/gru-class-navigation.js}} allows access the class information and navigate through the menu options.
 * @module
 * @see controllers/class.js
 * @augments ember/Component
 */
export default Ember.Component.extend(ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-class-navigation'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     *
     * Triggered when an menu item is selected
     * @param item
     */
    selectItem: function(item) {
      if (this.get('onItemSelected')) {
        this.selectItem(item);
        this.sendAction('onItemSelected', item);
      }
    },

    /**
     *
     * Triggered when the Info icon is selected for sm and xs
     * @param item
     */
    showDescription: function() {
      this.$('.greetings').toggleClass('in');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    var item = this.get('selectedMenuItem');
    this.selectItem(item);
  },

  // -------------------------------------------------------------------------
  // Properties
  teamsURL: Ember.computed('teamsURLs', function() {
    const mappedHost = this.get('configurationService.configuration.teams.url');
    const sessionToken = this.get('session.token-api3');
    const classId = this.get('class.id');
    return `${mappedHost}/#/integration/gooru?token=${sessionToken}&classId=${classId}`;
  }),
  /**
   * @property {Class} class
   */
  class: null,

  /**
   * @property {String|Function} onItemSelected - event handler for when an menu item is selected
   */
  onItemSelected: null,

  /**
   * @property {String} selectedMenuItem - menu Item selected
   */

  selectedMenuItem: null,

  // -------------------------------------------------------------------------
  // Observers
  /**
   * Refreshes the left navigation with the selected menu item
   */
  refreshSelectedMenuItem: function() {
    var item = this.get('selectedMenuItem');
    this.selectItem(item);
  }.observes('selectedMenuItem'),

  // -------------------------------------------------------------------------

  // Methods

  /**
   * Triggered when a menu item is selected. Set the class icon for the item selected showing in the mobiles dropdown menu.
   * @param {string} item
   */
  selectItem: function(item) {
    var classIconItem = 'info';
    if (item) {
      var itemElement = `.${item}`;
      this.$('.class-menu-item').removeClass('selected');
      this.$(itemElement).addClass('selected');
    }
    switch (item) {
    case 'overview':
      classIconItem = 'dashboard';
      break;
    case 'analytics.performance':
      classIconItem = 'graphic_eq';
      break;
    case 'teams':
      classIconItem = 'group';
      break;
    case 'info':
      classIconItem = 'info';
      break;
    }
    this.set('iconClassMenuItem', classIconItem);
  }
});
