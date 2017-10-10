import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';
import Env from 'gooru-web/config/environment';

export default Ember.Route.extend(PrivateRouteMixin, {
  /**
   * @property {Service} session
   */
  session: Ember.inject.service(),

  /**
   * Authentication (api-sdk/authentication) service.
   * @property {AuthenticationService} authService
   * @readOnly
   */
  authenticationService: Ember.inject.service('api-sdk/authentication'),

  beforeModel: function() {
    this._super(...arguments);

    this.get('session').invalidate();
    this.get('authenticationService').signOut();
    const isProd = Env.environment === 'production';
    if (isProd) {
      setTimeout('location.replace(Env.marketingSiteUrl);', 0);
    }
  }
});
