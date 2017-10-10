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
     * On card edit question button click
     * @param {Question} question
     */
    editQuestion: function(question) {
      this.transitionTo('content.questions.edit', question.get('id'));
    },

    /**
     * On card play question button click
     * @param {Question} question
     */
    playQuestion: function(question) {
      this.transitionTo('content.questions.play', question.get('id'));
    },

    /**
     * On card remix question button click
     * @param {Question} question
     */
    remixQuestion: function(question) {
      var remixModel = {
        content: question
      };
      this.send('showModal', 'content.modals.gru-question-remix', remixModel);
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

    return this.get('profileService').readQuestions(profile.get('id'), params);
  },

  setupController: function(controller, model) {
    controller.set('questions', model);
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
