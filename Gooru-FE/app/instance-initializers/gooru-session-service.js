import Ember from 'ember';

/**
 * Initialize session service
 */
export function initialize(application) {
  const sessionService = application.lookup('service:session');
  const quizzesConfigurationService = application.lookup(
    'service:quizzes/configuration'
  );

  sessionService.reopen({
    /**
     * @property {string} Session token
     */
    token: Ember.computed.alias('data.authenticated.token'),

    // TODO This property should be removed once API 2.0 is not needed anymore
    /**
     * @property {string} Session Token coming from API 3.0
     */
    'token-api3': Ember.computed.alias('data.authenticated.token-api3'),

    /**
     * @property {string} Session user data
     */
    userData: Ember.computed.alias('data.authenticated.user'),

    /**
     * @property {string} Session user data
     */
    cdnUrls: Ember.computed.alias('data.authenticated.cdnUrls'),

    /**
     * @property {string} Session user id
     */
    userId: Ember.computed('userData', function() {
      return this.get('userData').gooruUId;
    }),

    /**
     * @property {boolean} Indicates if the session is for an anonymous user
     */
    isAnonymous: Ember.computed('data.authenticated', function() {
      return this.get('data.authenticated').isAnonymous;
    }),

    /**
     * @property {string} session tenant id
     */
    tenantId: Ember.computed.alias('data.authenticated.tenant.tenantId'),

    /**
     * @property {string} session partner id
     */
    partnerId: Ember.computed.alias('data.authenticated.partnerId'),

    /**
     * This method authenticates using the default authenticator for an anonymous user
     * @returns {*|Ember.RSVP.Promise}
     */
    authenticateAsAnonymous: function() {
      return this.authenticate('authenticator:auth-api-3', {
        isAnonymous: true
      });
    },

    /**
     * Checks for changes at token-api3
     * @observer
     */
    tokenObserver: Ember.observer('token-api3', function() {
      if (quizzesConfigurationService) {
        quizzesConfigurationService.setToken(this.get('token-api3'));
        quizzesConfigurationService.setCdnUrl(this.get('cdnUrls.content'));
      }
    })
  });
}

export default {
  name: 'gooru-session-service',
  after: 'ember-simple-auth',
  initialize: initialize
};
