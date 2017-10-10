import Ember from 'ember';
import Env from '../config/environment';
import PublicRouteMixin from 'gooru-web/mixins/public-route-mixin';

/**
 * @typedef {object} Index Route
 */
export default Ember.Route.extend(PublicRouteMixin, {
  session: Ember.inject.service(),

  sessionService: Ember.inject.service('api-sdk/session'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  queryParams: {
    access_token: {}
  },

  beforeModel(transition) {
    const route = this;
    return this._super(...arguments).then(function() {
      let anonymous = route.get('session.isAnonymous');
      let isProd = Env.environment === 'production';
      let url = route.get('router.url');
      let googleSignIn = url.indexOf('access_token') > 0; //if it has the access_token parameter
      if (anonymous && !googleSignIn && isProd) {
        transition.abort();
        window.location = Env.marketingSiteUrl; //this is not an ember route, see nginx.conf
      }
    });
  },

  model(params) {
    const route = this;
    let details = null;
    let accessToken = params.access_token;
    if (accessToken) {
      // this is for google sign in
      details = this.get('sessionService')
        .signInWithToken(accessToken)
        .then(function() {
          const applicationController = route.controllerFor('application');
          return Ember.RSVP.all([
            applicationController.loadUserClasses(),
            applicationController.setupTenant()
          ]);
        });
    }
    return details;
  },

  afterModel() {
    const route = this;
    const anonymous = route.get('session.isAnonymous');
    const userId = route.get('session.userId');

    if (!anonymous) {
      if (route.get('session.userData.isNew')) {
        route.transitionTo('sign-up-finish');
      } else {
        return route
          .get('profileService')
          .readUserProfile(userId)
          .then(function(userProfile) {
            const isStudent = userProfile.get('isStudent');
            const isTeacher = userProfile.get('isTeacher');

            if (isStudent) {
              route.transitionTo('student-home');
            } else {
              if (isTeacher) {
                route.transitionTo('teacher-home');
              } else {
                route.transitionTo('profile.content.courses', userId);
              }
            }
          });
      }
    }
  }
});
