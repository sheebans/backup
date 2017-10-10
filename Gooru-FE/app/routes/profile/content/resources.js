import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import { DEFAULT_PAGE_SIZE } from 'gooru-web/config/config';

export default Ember.Route.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * On card edit resource button click
     * @param {Resource} resource
     */
    editResource: function(resource) {
      this.transitionTo('content.resources.edit', resource.get('id'));
    },

    /**
     * On card play resource button click
     * @param {Resource} resource
     */
    playResource: function(resource) {
      this.transitionTo('content.resources.play', resource.get('id'));
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    const profile = this.modelFor('profile').profile;
    const params = {
      pageSize: DEFAULT_PAGE_SIZE,
      searchText: this.paramsFor('profile.content').term,
      sortOn: this.paramsFor('profile.content').sortOn,
      order: this.paramsFor('profile.content').order
    };

    return this.get('profileService').readResources(profile.get('id'), params);
  },

  setupController: function(controller, model) {
    controller.set('resources', model);
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
