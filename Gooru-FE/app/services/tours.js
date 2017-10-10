import Ember from 'ember';

/**
 * Service for the Tour steps
 *
 * @typedef {Object} Tour steps Service
 */
export default Ember.Service.extend({
  i18n: Ember.inject.service(),
  /**
   * Returns the Assessment Settings tour object
   *
   * @returns {Ember.A}
   */
  getAssessmentSettingsTourSteps: function() {
    const service = this;
    return new Ember.A([
      {
        elementSelector:
          '.assessments.edit .gru-settings-edit .nav-score-settings h3 span',
        title: service
          .get('i18n')
          .t('gru-tour.assessments-settings.stepOne.title'),
        description: service
          .get('i18n')
          .t('gru-tour.assessments-settings.stepOne.description')
      },
      {
        elementSelector:
          '.assessments.edit .gru-settings-edit .key-attempts-settings h3 span',
        title: service
          .get('i18n')
          .t('gru-tour.assessments-settings.stepTwo.title'),
        description: service
          .get('i18n')
          .t('gru-tour.assessments-settings.stepTwo.description')
      }
    ]);
  },
  /**
   * Returns the Assessment Settings tour object
   *
   * @returns {Ember.A}
   */
  getRealTimeTourSteps: function() {
    const service = this;
    return new Ember.A([
      {
        elementSelector:
          '.gru-class-assessment-report .gru-questions-summary ol',
        title: service.get('i18n').t('gru-tour.real-time.stepOne.title'),
        description: service
          .get('i18n')
          .t('gru-tour.real-time.stepOne.description')
      },
      {
        title: service.get('i18n').t('gru-tour.real-time.stepTwo.title'),
        description: service
          .get('i18n')
          .t('gru-tour.real-time.stepTwo.description'),
        image: 'real-time-tour-image'
      },
      {
        elementSelector: '.gru-class-assessment-report .gru-view-layout-picker',
        title: service.get('i18n').t('gru-tour.real-time.stepThree.title'),
        description: service
          .get('i18n')
          .t('gru-tour.real-time.stepThree.description')
      },
      {
        elementSelector:
          '.gru-class-assessment-report .overview .average-score',
        title: service.get('i18n').t('gru-tour.real-time.stepFour.title'),
        description: service
          .get('i18n')
          .t('gru-tour.real-time.stepFour.description')
      },
      {
        elementSelector: '.controller.reports .header .actions .anonymous',
        title: service.get('i18n').t('gru-tour.real-time.stepFive.title'),
        description: service
          .get('i18n')
          .t('gru-tour.real-time.stepFive.description')
      }
    ]);
  }
});
