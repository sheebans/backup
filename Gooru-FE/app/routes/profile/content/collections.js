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
     * On card edit collection button click
     * @param {Collection} collection
     */
    editCollection: function(collection) {
      this.transitionTo('content.collections.edit', collection.get('id'));
    },

    /**
     * On card remix collection button click
     * @param {Collection} collection
     */
    remixCollection: function(collection) {
      var remixModel = {
        content: collection
      };
      this.send('showModal', 'content.modals.gru-collection-remix', remixModel);
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
    return this.get('profileService').readCollections(
      profile.get('id'),
      params
    );
  },

  setupController: function(controller, model) {
    controller.set('collections', model);
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
