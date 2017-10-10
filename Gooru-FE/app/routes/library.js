import Ember from 'ember';
import { ROLES } from 'gooru-web/config/config';

/**
 * Library route
 *
 * @module
 * @augments Ember.Route
 */

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {searchService} Search service object
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * @type {libraryService} Library service object
   */
  libraryService: Ember.inject.service('api-sdk/library'),

  /**
   * @dependency {i18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    let route = this;

    //Steps for Take a Tour functionality
    const tourSteps = Ember.A([
      {
        title: route.get('i18n').t('gru-take-tour.library.stepOne.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.library.stepOne.description')
      },
      {
        elementSelector: '.tab.featured-courses',
        title: route.get('i18n').t('gru-take-tour.library.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.library.stepTwo.description')
      },
      {
        elementSelector: '.gru-collection-card .panel-footer .preview-btn',
        title: route.get('i18n').t('gru-take-tour.library.stepFour.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.library.stepFour.description')
      },
      {
        elementSelector: '.gru-collection-card .panel-footer .share-btn',
        title: route.get('i18n').t('gru-take-tour.library.stepFive.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.library.stepFive.description')
      },
      {
        elementSelector: '.gru-collection-card .panel-footer .bookmark-btn',
        title: route.get('i18n').t('gru-take-tour.library.stepSix.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.library.stepSix.description'),
        role: ROLES.STUDENT
      }
    ]);

    return Ember.RSVP.hash({
      tourSteps: tourSteps,
      courses: this.get('searchService').searchFeaturedCourses('*'),
      libraries: this.get('libraryService').fetchLibraries()
    });
  },

  setupController: function(controller, model) {
    controller.set('steps', model.tourSteps);
    controller.set('courses', model.courses);
    controller.set('libraries', model.libraries);
  }
});
