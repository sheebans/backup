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
     * On card edit assessment button click
     * @param {Assessment} assessment
     */
    editAssessment: function(assessment) {
      this.transitionTo('content.assessments.edit', assessment.get('id'), {
        queryParams: { editingContent: true }
      });
    },

    /**
     * On card remix assessment button click
     * @param {Assessment} assessment
     */
    remixAssessment: function(assessment) {
      var remixModel = {
        content: assessment
      };
      this.send('showModal', 'content.modals.gru-assessment-remix', remixModel);
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

    return this.get('profileService').readAssessments(
      profile.get('id'),
      params
    );
  },

  setupController: function(controller, model) {
    controller.set('assessments', model);
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
