import Ember from 'ember';
import { KEY_CODES } from 'gooru-web/config/config';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * The class presented to the user
   * @property {Class}
   */
  class: null,

  /**
   * The course presented to the user
   * @property {Course}
   */
  course: null,

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
   * If analytics is fullScreen
   * @property {Boolean}
   */
  isFullScreen: false,

  /*
  * If this variable is set to false then the channel section should not be shown
  * @property {Booelan}
  */
  showChannels: true,

  /**
   * Indicates if a user is a teacher of this class
   * @property {isTeacher}
   * @see {Class} class
   * @returns {bool}
   */
  isTeacher: Ember.computed('class', function() {
    return this.get('class').isTeacher(this.get('session.userId'));
  }),

  /**
   * Indicates if a user is a student of this class
   * @property {isStudent}
   * @see {Class} class
   * @returns {bool}
   */
  isStudent: Ember.computed('class', function() {
    return this.get('class').isStudent(this.get('session.userId'));
  }),

  // -------------------------------------------------------------------------
  // Observers

  setupSubscriptions: Ember.on('init', function() {
    var controller = this;
    Ember.$(window).on('keyup.exitFullScreen', function(e) {
      if (e.keyCode === KEY_CODES.ESCAPE && controller.get('isFullScreen')) {
        // Exit full screen mode
        controller.set('isFullScreen', false);
      }
    });
  }),

  removeSubscriptions: Ember.on('willDestroy', function() {
    Ember.$(window).off('keyup.exitFullScreen');
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Toggles the full screen mode for all class children pages
   */
  toggleFullScreen: function() {
    var isFullScreen = this.get('isFullScreen');
    this.set('isFullScreen', !isFullScreen);
  },

  /**
   * Exits the full screen mode for all class children pages
   */
  exitFullScreen: function() {
    this.set('isFullScreen', false);
  },

  /**
   * Selected the menu item
   * @param {string} item
   */
  selectMenuItem: function(item) {
    this.set('menuItem', item);
  },

  /**
  * Hide channels in the class page
  * @param empty
  */
  hideChannels: function() {
    this.toggleProperty('showChannels');
    //Ember.$('#channel').hide();
  }
});
