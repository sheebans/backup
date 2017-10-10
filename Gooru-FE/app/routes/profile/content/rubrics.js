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
  // Methods

  model: function() {
    const profile = this.modelFor('profile').profile;
    const params = {
      pageSize: DEFAULT_PAGE_SIZE
      //TO DO: SEARCH BY TERM AND SORT WILL BE COMPLETED IN OTHER TICKET
      //searchText:  this.paramsFor('profile.content').term,
      //sortOn: this.paramsFor('profile.content').sortOn,
      //order:this.paramsFor('profile.content').order
    };

    return this.get('profileService').readRubrics(profile.get('id'), params);
  },

  setupController: function(controller, model) {
    controller.set('rubrics', model);
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
