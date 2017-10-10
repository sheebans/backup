import Ember from 'ember';
import { DEFAULT_PAGE_SIZE } from 'gooru-web/config/config';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {ProfileService} Service to retrieve content controller
   */
  contentController: Ember.inject.controller('profile.content'),

  /**
   * @type {ProfileService} Service to retrieve profile controller
   */
  profileController: Ember.inject.controller('profile'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    showMoreResults: function() {
      this.showMoreResults();
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} term filter
   */
  term: Ember.computed.alias('contentController.term'),

  /**
   * @property {string} sortRecent filter
   */
  sortOn: Ember.computed.alias('contentController.sortOn'),

  /**
   * @property {string} order filter
   */
  order: Ember.computed.alias('contentController.order'),

  /**
   * @property {Collection[]} questions
   */
  questions: null,

  /**
   * @property {boolean} isMyProfile
   */
  isMyProfile: Ember.computed.alias('profileController.isMyProfile'),

  /**
   * @property {Profile}
   */
  profile: Ember.computed.alias('profileController.profile'),

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
  showMoreResultsButton: Ember.computed('questions.[]', function() {
    return (
      this.get('questions.length') &&
      this.get('questions.length') % this.get('pagination.pageSize') === 0
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
      .readQuestions(profile.get('id'), pagination)
      .then(function(questions) {
        controller.get('questions').pushObjects(questions.toArray());
      });
  },

  resetValues: function() {
    this.set('pagination', {
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE
    });
  }
});
