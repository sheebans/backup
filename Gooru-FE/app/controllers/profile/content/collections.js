import Ember from 'ember';
import { DEFAULT_PAGE_SIZE } from 'gooru-web/config/config';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  contentController: Ember.inject.controller('profile.content'),

  profileController: Ember.inject.controller('profile'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @type {Controller} Application controller
   */
  appController: Ember.inject.controller('application'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    openContentPlayer: function(collection) {
      this.transitionToRoute('player', collection.id, {
        queryParams: { type: collection.get('collectionType') }
      });
    },

    showMoreResults: function() {
      this.showMoreResults();
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Class[]}
   */
  activeClasses: Ember.computed(
    'appController.myClasses.classes.[]',
    function() {
      const classes = this.get('appController.myClasses');
      return classes
        ? classes.getTeacherActiveClasses(this.get('sessionProfile.id'))
        : [];
    }
  ),

  /**
   * A link to the parent application controller
   * @see controllers/application.js
   * @property {ClassesModel}
   */
  myClasses: Ember.computed.alias('appController.myClasses'),

  /**
   * @property {string} term filter
   */
  term: Ember.computed.alias('contentController.term'),

  /**
   * @property {string} sortOn filter
   */
  sortOn: Ember.computed.alias('contentController.sortOn'),

  /**
   * @property {string} order filter
   */
  order: Ember.computed.alias('contentController.order'),

  /**
   * @property {Collection[]} collections
   */
  collections: null,

  /**
   * @property {boolean} isMyProfile
   */
  isMyProfile: Ember.computed.alias('profileController.isMyProfile'),

  /**
   * @property {Profile}
   */
  profile: Ember.computed.alias('profileController.profile'),

  /**
   * @property {Profile} Session Profile
   */
  sessionProfile: Ember.computed.alias('appController.profile'),

  /**
   * @property {*}
   */
  pagination: {
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE
  },

  /**
   * @property {boolean}
   */
  showMoreResultsButton: Ember.computed('collections.[]', function() {
    return (
      this.get('collections.length') &&
      this.get('collections.length') % this.get('pagination.pageSize') === 0
    );
  }),

  // Methods
  showMoreResults: function() {
    const controller = this;
    const profile = this.get('profile');
    const pagination = this.get('pagination');
    pagination.page = pagination.page + 1;
    pagination.pageSize = pagination.pageSize;
    pagination.searchText = this.get('term');
    pagination.sortOn = this.get('sortOn');
    pagination.order = this.get('order');

    controller
      .get('profileService')
      .readCollections(profile.get('id'), pagination)
      .then(function(collections) {
        controller.get('collections').pushObjects(collections.toArray());
      });
  },

  resetValues: function() {
    this.set('pagination', {
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE
    });
  }
});
