import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';
import ClassesModel from 'gooru-web/models/content/classes';

/**
 * Home route
 *
 * @module
 * @augments Ember.Route
 */
export default Ember.Route.extend(PrivateRouteMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {ClassService} Service to retrieve user information
   */
  classService: Ember.inject.service('api-sdk/class'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service('session'),

  /**
   * @type {I18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),
  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function() {
    let route = this;
    const myId = route.get('session.userId');
    let profilePromise = route.get('profileService').readUserProfile(myId);
    const classesStatus = this.get(
      'classService'
    ).getReportClassesStatusFromStore(myId);

    const tourSteps = Ember.A([
      {
        elementSelector: '.gru-header .home-link',
        title: route.get('i18n').t('gru-tour.home.stepOne.title'),
        description: route.get('i18n').t('gru-tour.home.stepOne.description')
      },
      {
        elementSelector: '.home-navigator .active-classes a',
        title: route.get('i18n').t('gru-tour.home.stepTwo.title'),
        description: route.get('i18n').t('gru-tour.home.stepTwo.description')
      },
      {
        elementSelector: '.home-navigator .archived-classes a',
        title: route.get('i18n').t('gru-tour.home.stepThree.title'),
        description: route.get('i18n').t('gru-tour.home.stepThree.description')
      },
      {
        elementSelector: '.home-navigator .actions .create-class-cta',
        title: route.get('i18n').t('gru-tour.home.stepFour.title'),
        description: route.get('i18n').t('gru-tour.home.stepFour.description')
      },
      {
        elementSelector: '.gru-header .profile-link .profile',
        title: route.get('i18n').t('gru-tour.home.stepFive.title'),
        description: route.get('i18n').t('gru-tour.home.stepFive.description')
      }
    ]);

    return profilePromise.then(function(profile) {
      return Ember.RSVP.hash({
        applicationModel: route.modelFor('application'),
        applicationController: route.controllerFor('application'),
        classesStatus: classesStatus,
        profile: profile,
        tourSteps: tourSteps
      });
    });
  },

  afterModel: function(model) {
    const loadedClasses =
      model.applicationController.myClasses || model.applicationModel.myClasses;
    const myClasses =
      loadedClasses ||
      ClassesModel.create(Ember.getOwner(this).ownerInjection());

    const classes = myClasses.classes || Ember.A([]);
    const archivedClasses = classes.filterBy('isArchived', true);
    const classesStatus = model.classesStatus;
    const classService = this.get('classService');
    const promises = [];

    archivedClasses.forEach(function(aClass) {
      aClass.set('reportStatus', classesStatus[aClass.get('id')]);
      if (aClass.get('isReportInProgress')) {
        //checking if the report is ready for those classes having the report in progress
        const promise = classService
          .readClassReportStatus(aClass.get('id'), aClass.get('courseId'))
          .then(function(status) {
            aClass.set('reportStatus', status);
            return status;
          });
        promises.push(promise);
      }
    });
    return Ember.RSVP.all(promises);
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */

  setupController: function(controller, model) {
    controller.set('profile', model.profile);
    controller.set('steps', model.tourSteps);
  }
});
