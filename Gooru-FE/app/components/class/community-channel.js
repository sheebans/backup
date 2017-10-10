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
  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),

  firebase: Ember.inject.service('firebase'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['community-channel'],

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

  showChannels: true,

  channels: null,

  messages: null,

  currentUser: null,

  actions: {
    /**
     * Submit a new message
     *
     * @param current user data, list of channels, and message to be sent
     *
     * @returns void
     */
    submitMessage: function(currentUser, channels, message) {
      channels = this.get('channels');
      currentUser = this.get('currentUser');
      message = this.get('message');
      this.get('firebase').submitMessage(currentUser, channels, message);
      Ember.run.later(function() {
        $('.message-row-container').scrollTop(
          $('.message-row-container-inner').height()
        );
      }, 100);
      this.set('message', '');
    },

    //remove a message from firebase
    removeMessage: function(message) {
      this.get('firebase').removeMessage(message, this.channels);
    },

    //submit a file to firebase storage
    submitFile: function(currentUser, channels, fileToSend) {
      channels = this.get('channels');
      currentUser = this.get('currentUser');
      fileToSend = document.getElementById('mediaCapture');
      this.get('firebase').submitFile(currentUser, channels, fileToSend);
      //Move the location in message pane to the bottom
      Ember.run.later(function() {
        $('.message-row-container').scrollTop(
          $('.message-row-container-inner').height()
        );
      }, 100);
      this.set('message', '');
    },

    hideChannels: function() {
      this.toggleProperty('showChannels');
      Ember.$('#channel').hide();
    },

    //Allow the creator of the message the ability to edit their particular messages.
    editMessage: function(message) {
      this.sendAction('oldMessage', message);
      this.get('firebase').editMessage(message, this.get('currentUser'));
    },

    //Allows the creator of a message the ability to edit their own messages
    submitEditedMessage: function(item) {
      let channels = this.get('channels');
      let message = this.get('editedMessage');
      this.get('firebase').submitEditedMessage(
        message,
        this.get('currentUser'),
        item,
        channels
      );
    }
  }
});
