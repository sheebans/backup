import Ember from 'ember';
import GooruIntegration from 'gooru-web/utils/gooru-integration';
import PublicRouteMixin from 'gooru-web/mixins/public-route-mixin';

export default Ember.Route.extend(PublicRouteMixin, {
  authSvc: Ember.inject.service('api-sdk/authentication'),
  session: Ember.inject.service(),
  sessionSvc: Ember.inject.service('api-sdk/session'),

  model(params) {
    return Ember.RSVP.hash({
      params: params
    });
  },

  redirect(model) {
    let route = this;
    let params = model.params;
    let token = params.token;

    let tokenPromise = token
      ? route.get('authSvc').checkToken(token)
      : Ember.RSVP.resolve(false);
    tokenPromise.then(function(result) {
      let signInPromise = result
        ? route.get('sessionSvc').signInWithToken(token)
        : Ember.RSVP.resolve(false);
      signInPromise.then(function() {
        let integration = GooruIntegration.create({ params: params });
        if (integration.get('validAppKey')) {
          route.transitionTo.apply(route, integration.get('routeParams'));
        } else {
          Ember.Logger.warn('Invalid valid app key', params);
          route.transitionTo('sign-in');
        }
      });
    });
  }
});
