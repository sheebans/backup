import Ember from 'ember';
import PublicRouteMixin from 'gooru-web/mixins/public-route-mixin';

export default Ember.Route.extend(PublicRouteMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Set all controller properties used in the template
   * @param controller
   * @param model
   */
  setupController: function(controller) {
    // remove old notifications
    this.get('notifications').remove();
    controller.resetProperties();
  }
});
