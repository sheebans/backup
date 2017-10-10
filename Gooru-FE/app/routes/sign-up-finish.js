import Ember from 'ember';
import { COUNTRY_CODES } from 'gooru-web/config/config';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Ember.Service} Service to do retrieve countries
   */
  lookupService: Ember.inject.service('api-sdk/lookup'),

  /**
   * @property {Service} Session service
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    if (
      this.get('session.isAnonymous') ||
      !this.get('session.userData.isNew')
    ) {
      this.transitionTo('index');
    }
  },

  model: function() {
    const route = this;
    return route.get('lookupService').readCountries().then(function(countries) {
      var usCountry = countries.findBy('code', COUNTRY_CODES.US);
      var usStates = route.get('lookupService').readStates(usCountry.id);
      return Ember.RSVP.hash({
        countries: countries,
        states: usStates
      });
    });
  },

  /**
   * Set all controller properties used in the template
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('countries', model.countries);
    controller.set('states', model.states);
    controller.resetProperties();
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when submitting the sign up finish form
     */
    signUpFinish: function(role) {
      if (role === 'teacher') {
        this.transitionTo('content.classes.create');
      } else if (role === 'student') {
        this.transitionTo('content.classes.join');
      } else {
        this.transitionTo('index');
      }
    }
  }
});
