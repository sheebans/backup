import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';

/**
 * Manage Goals route
 *
 * @module
 * @augments Ember.Route
 */

export default Ember.Route.extend(PrivateRouteMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @dependency service:goal
   */
  goalService: Ember.inject.service('api-sdk/goal'),

  // -------------------------------------------------------------------------
  // Methods
  model: function() {
    const route = this;
    const userId = route.get('session.userId');
    const goalService = route.get('goalService');

    return Ember.RSVP.hash({
      goals: goalService.getGoalsByUser(userId)
    });
  },

  /**
   * Set all controller properties used in the template
   * @param controller
   */
  setupController: function(controller, model) {
    controller.set('goals', model.goals);
    controller.resetProperties();
  }
});
