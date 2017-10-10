import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {I18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    let route = this;

    //Steps for Take a Tour functionality
    const tourSteps = Ember.A([
      {
        title: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepOne.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepOne.description')
      },
      {
        elementSelector: '.gru-performance-filter-panel .header .title',
        title: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepTwo.description')
      },
      {
        elementSelector:
          '.gru-performance-filter-panel .body .actions .update-report',
        title: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepThree.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepThree.description')
      },
      {
        elementSelector: '.performance-content .panel-header .download',
        title: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepFour.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepFour.description')
      },
      {
        title: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepFive.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-performance.stepFive.description')
      }
    ]);

    return {
      tourSteps
    };
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('steps', model.tourSteps);
    controller.loadData();
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
