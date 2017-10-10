import Ember from 'ember';
import { ASSESSMENT_SHOW_VALUES, MAX_ATTEMPTS } from 'gooru-web/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  tourService: Ember.inject.service('tours'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'gru-settings-edit'],

  tagName: 'section',

  actions: {
    onBackwardsChange: function(isChecked) {
      if (isChecked) {
        this.set('model.showFeedback', ASSESSMENT_SHOW_VALUES.SUMMARY);
      }
      this.sendAction('action');
    },

    onAnswerKeyChange: function(isChecked) {
      if (isChecked) {
        this.set('model.attempts', 1);
      }
      this.sendAction('action');
    },

    onAttemptsChange: function(newValue) {
      this.set('model.attempts', +newValue);
      this.sendAction('action');
    },

    onGenericChange: function() {
      this.sendAction('action');
    },
    onClassroomPlayEnabledChange: function() {
      this.sendAction('action');
    }
  },

  /**
   * Options for attempts
   * @property {Array}
   */
  attemptsOptions: Ember.computed(function() {
    let options = [
      {
        id: -1,
        name: this.get('i18n').t('gru-settings-edit.attempts-unlimited')
      }
    ];
    for (let i = 1; i <= MAX_ATTEMPTS; i += 1) {
      options.push({
        id: i,
        name: i
      });
    }
    return options;
  }),

  /**
   * Options for feedback
   * @property {Map}
   */
  feedbackItems: ASSESSMENT_SHOW_VALUES,
  /**
   * Request pending approval
   * @property {Boolean}
   */
  isRequestApproved: false,

  /**
   * Model to change settings to
   * @property {Object}
   */
  model: null,

  /**
   * Has the request to make the item searchable been sent?
   * @property {Boolean}
   */
  wasRequestSent: false,

  /**
   * Toggle Options
   * @property {Ember.Array}
   */
  switchOptions: Ember.A([
    Ember.Object.create({
      label: 'On',
      value: true
    }),
    Ember.Object.create({
      label: 'Off',
      value: false
    })
  ]),

  // -------------------------------------------------------------------------
  // Events
  init: function() {
    var component = this;
    component._super(...arguments);
    component.set(
      'assessmentSettingSteps',
      component.get('tourService').getAssessmentSettingsTourSteps()
    );
  }
});
