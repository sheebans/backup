import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Service} Session service
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    if (!this.get('session.isAnonymous')) {
      this.transitionTo('index');
    }
  },

  /**
   * Set all controller properties used in the template
   * @param controller
   * @param model
   */
  setupController: function(controller) {
    controller.resetProperties();
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when submitting the sign up form
     * @see application.hbs
     * @see gru-header.hbs
     */
    signUp: function() {
      this.transitionTo('sign-up-finish');
    },

    /**
     * Action triggered when close sign up form from childLayout
     */
    closeSignUp: function() {
      this.transitionTo('index');
    }
  }
});
