import Ember from 'ember';

/**
 * Route for student report
 *
 * Gathers and passes initialization data for attempt events
 * from BE to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({
  /**
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesAttemptService: Ember.inject.service('quizzes/attempt'),

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  quizzesCollectionService: Ember.inject.service('quizzes/collection'),

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Navigate to the previous page
     */
    navigateBack: function() {
      window.history.back();
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model: function(params) {
    return this.quizzesModel(params);
  },

  /**
   * @param {{ contextId: string }} params
   */
  quizzesModel: function(params) {
    const route = this;
    const contextId = params.contextId;
    const profileId =
      params.profileId ||
      route.get(
        'quizzesConfigurationService.configuration.properties.profileId'
      );
    const type =
      params.type ||
      route.get('quizzesConfigurationService.configuration.properties.type');

    return route
      .get('quizzesAttemptService')
      .getAttemptIds(contextId, profileId)
      .then(
        attemptIds =>
          !attemptIds || !attemptIds.length
            ? {}
            : route
              .get('quizzesAttemptService')
              .getAttemptData(attemptIds[attemptIds.length - 1])
              .then(attemptData =>
                Ember.RSVP.hash({
                  attemptData,
                  collection: route
                    .get('quizzesCollectionService')
                    .readCollection(attemptData.collectionId, type)
                })
              )
      );
  },

  setupController(controller, model) {
    if (model && model.attemptData) {
      model.attemptData.setCollection(model.collection);
      controller.set('attemptData', model.attemptData);
    }
  }
});
