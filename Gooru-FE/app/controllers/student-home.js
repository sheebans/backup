import Ember from 'ember';
import { arrayChunks } from 'gooru-web/utils/utils';
import ModalMixin from 'gooru-web/mixins/modal';

export default Ember.Controller.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  applicationController: Ember.inject.controller('application'),

  /**
   * @property {Service} Session service
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events
  init: function() {
    let localStorage = this.get('applicationController').getLocalStorage();
    const userId = this.get('session.userId');
    const localStorageItem = `${userId}_dontShowWelcomeModal`;
    const localStorageLogins = `${userId}_logins`;

    if (!localStorage.getItem(localStorageItem)) {
      this.send('showModal', 'content.modals.gru-welcome-message');
    }
    let loginCount = localStorage.getItem(localStorageLogins);
    if (loginCount) {
      this.set('loginCount', +loginCount);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Profile}
   */
  profile: Ember.computed.alias('applicationController.profile'),

  /**
   * @property {Class[]}
   */
  activeClasses: Ember.computed(
    'applicationController.myClasses.classes.[]',
    function() {
      return this.get(
        'applicationController.myClasses'
      ).getStudentActiveClasses(this.get('profile.id'));
    }
  ),

  /**
   * @property {Array[]}
   */
  activeClassesChunks: Ember.computed('activeClasses', function() {
    return arrayChunks(this.get('activeClasses'), 2);
  }),

  /**
   * @property {Number} Total of joined classes
   */
  totalJoinedClasses: Ember.computed.alias('activeClasses.length'),

  /**
   * @property {Boolean} Indicate if the student has classes
   */
  hasClasses: Ember.computed('totalJoinedClasses', function() {
    return this.get('totalJoinedClasses') > 0;
  }),

  /**
   * @property {Array[]} - featuredCourses
   */
  featuredCourses: null,

  /**
   * @property {Number} - Amount of logins by the user
   */
  loginCount: null
});
