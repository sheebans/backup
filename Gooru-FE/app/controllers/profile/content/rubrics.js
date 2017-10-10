import Ember from 'ember';
import { DEFAULT_PAGE_SIZE } from 'gooru-web/config/config';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Show more rubrics results
     */
    showMoreResults: function() {
      this.showMoreResults();
    },
    /**
     * Edit rubric
     */
    editRubric: function(resource) {
      this.transitionToRoute('content.rubric.edit', resource.get('id'));
    }
  },

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {ProfileService} Service to retrieve profile controller
   */
  profileController: Ember.inject.controller('profile'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Rubric[]} rubrics
   */
  rubrics: null,

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
  showMoreResultsButton: Ember.computed('rubrics.[]', function() {
    return (
      this.get('rubrics.length') &&
      this.get('rubrics.length') % this.get('pagination.pageSize') === 0
    );
  }),

  // Methods
  showMoreResults: function() {
    const controller = this;
    const profile = this.get('profile');
    const pagination = this.get('pagination');
    pagination.page = pagination.page + 1;
    pagination.pageSize = pagination.pageSize;

    controller
      .get('profileService')
      .readRubrics(profile.get('id'), pagination)
      .then(function(rubrics) {
        controller.get('rubrics').pushObjects(rubrics.toArray());
      });
  },

  resetValues: function() {
    this.set('pagination', {
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE
    });
  }
});
