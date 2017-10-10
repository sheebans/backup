import Ember from 'ember';
import Env from 'gooru-web/config/environment';
import ModalMixin from 'gooru-web/mixins/modal';

export default Ember.Controller.extend(ModalMixin, {
  queryParams: ['showArchivedClasses', 'showActiveClasses'],

  // -------------------------------------------------------------------------
  // Dependencies
  classService: Ember.inject.service('api-sdk/class'),

  applicationController: Ember.inject.controller('application'),

  /**
   * @property {Service} Session service
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     *Filter by most recent
     */
    filterByDate: function() {
      if (this.get('sortOn') === 'title') {
        this.set('order', 'desc');
        this.set('sortOn', 'startDate');
      } else {
        this.set('order', this.get('order') === 'asc' ? 'desc' : 'asc');
      }
    },
    /**
     *Filter by alphanumeric
     */
    filterByTitle: function() {
      if (this.get('sortOn') === 'startDate') {
        this.set('order', 'asc');
        this.set('sortOn', 'title');
      } else {
        this.set('order', this.get('order') === 'desc' ? 'asc' : 'desc');
      }
    },
    showClasses: function(type) {
      this.set('showActiveClasses', type === 'active');
      this.set('showArchivedClasses', type === 'archived');
    }
  },

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
   * Indicates when then active classes are visible
   * @property {boolean}
   */
  showActiveClasses: true,

  /**
   * Indicates when then archived classes are visible
   * @property {boolean}
   */
  showArchivedClasses: false,

  /**
   * A link to the parent application controller
   * @see controllers/application.js
   * @property {ClassesModel}
   */
  myClasses: Ember.computed.alias('applicationController.myClasses'),

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
      ).getTeacherActiveClasses(this.get('profile.id'));
    }
  ),

  /**
   * @property {Class[]}
   */
  archivedClasses: Ember.computed.filterBy(
    'myClasses.classes',
    'isArchived',
    true
  ),

  /**
   * @property {Number} Total of teaching classes
   */
  totalTeachingClasses: Ember.computed.alias('activeClasses.length'),

  /**
   * @property {boolean} Indicates if there are classes
   */
  hasClasses: Ember.computed.bool('totalTeachingClasses'),

  /**
   * @property {string} Indicates the order of the sorting
   */
  order: 'desc',

  /**
   * @property {string} Indicates the sorting criteria
   */
  sortOn: 'startDate',
  /**
   * @property {[Class]} Sorted archived classrooms
   */
  sortedArchivedClassrooms: Ember.computed.sort(
    'archivedClasses',
    'sortDefinition'
  ),
  /**
   * sort Definition
   */
  sortDefinition: Ember.computed('sortOn', 'order', function() {
    return [`${this.get('sortOn')}:${this.get('order')}`];
  }),

  /**
   * Toolkit site url
   * @property {string}
   */
  toolkitSiteUrl: Ember.computed(function() {
    return Env.toolkitSiteUrl;
  }),

  /**
   * @property {Array[]} - featuredCourses
   */
  featuredCourses: null,

  /**
   * @property {Number} - Amount of logins by the user
   */
  loginCount: null,

  /**
   * Reset to default values
   */
  resetValues: function() {
    this.set('showActiveClasses', true);
  }
});
