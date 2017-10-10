import Ember from 'ember';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';

/**
 * Route for collection/assessment report
 *
 * Gathers and passes initialization data for context events
 * from BE to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({
  queryParams: {
    anonymous: {}
  },

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

  /**
   * @type {ProfileService} profileService
   * @property {Ember.Service} Service to send profile related events
   */
  quizzesProfileService: Ember.inject.service('quizzes/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Navigate to the previous page
     */
    navigateBack: function() {
      // Empty, it does nothing by default
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
    const anonymous = params.anonymous;
    const students = params.students || [];
    const type =
      params.type ||
      route.get('quizzesConfigurationService.configuration.properties.type');

    return route
      .get('quizzesAttemptService')
      .getReportData(contextId)
      .then(reportData => {
        students
          .filter(
            student =>
              !reportData.get('reportEvents').findBy('profileId', student.id)
          )
          .forEach(student => {
            reportData.get('reportEvents').push(
              ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
                profileId: student.get('id'),
                profileName: student.get('fullName'),
                isAttemptStarted: false,
                isAttemptFinished: false
              })
            );
          });
        return reportData;
      })
      .then(reportData =>
        Ember.RSVP.hash({
          anonymous,
          reportData,
          collection: route
            .get('quizzesCollectionService')
            .readCollection(reportData.collectionId, type),
          profiles: route
            .get('quizzesProfileService')
            .readProfiles(
              reportData.get('reportEvents').map(({ profileId }) => profileId)
            )
        })
      );
  },

  setupController(controller, model) {
    const anonymous = model.anonymous;
    const collection = model.collection;
    const reportData = model.reportData;
    const profiles = model.profiles;
    reportData.get('reportEvents').forEach(function(reportEvent) {
      const profile = profiles[reportEvent.get('profileId')];
      reportEvent.setProfileProperties(profile);
    });
    reportData.setCollection(collection);
    controller.set('reportData', reportData);
    controller.set('anonymous', anonymous);
  }
});
