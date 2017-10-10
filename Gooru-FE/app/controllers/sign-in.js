import Ember from 'ember';
import User from 'gooru-web/models/sign-in/sign-in';
import Env from 'gooru-web/config/environment';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  queryParams: ['sessionEnds'],

  /**
   * @property {Service} Session
   */
  session: Ember.inject.service(),

  /**
   * @property {Service} Session service
   */
  sessionService: Ember.inject.service('api-sdk/session'),

  /**
   * @property {Service} Notifications service
   */
  notifications: Ember.inject.service(),

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    authenticate: function() {
      const controller = this;
      const user = controller.get('user');
      const errorMessage = controller
        .get('i18n')
        .t('common.errors.sign-in-credentials-not-valid').string;

      controller.get('notifications').clear();
      controller.get('notifications').setOptions({
        positionClass: 'toast-top-full-width sign-in'
      });

      // TODO needs to be revisited, this is a quick fix
      controller.get('sessionService').authorize().then(function() {
        if (controller.get('didValidate') === false) {
          var username = Ember.$('.gru-input.username input').val();
          var password = Ember.$('.gru-input.password input').val();
          user.set('username', username);
          user.set('password', password);
        }
        user.validate().then(function({ validations }) {
          if (validations.get('isValid')) {
            controller.get('sessionService').signInWithUser(user, true).then(
              function() {
                controller.set('didValidate', true);
                // Trigger action in parent
                controller.send('signIn');
              },
              function() {
                controller.get('notifications').warning(errorMessage);
                // Authenticate as anonymous if it fails to mantain session
                controller.get('session').authenticateAsAnonymous();
              }
            );
          }
        });
      });
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * init and reset all the properties for the validations
   */

  resetProperties() {
    var controller = this;
    var user = User.create(Ember.getOwner(this).ownerInjection(), {
      username: null,
      password: null
    });

    controller.set('user', user);
    const url = `${window.location.protocol}//${window.location.host}${Env[
      'google-sign-in'
    ].url}`;
    controller.set('googleSignInUrl', url);
    controller.set('didValidate', false);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @type {User} user
   */
  user: null,

  target: null,

  /**
   * @param {Boolean } didValidate - value used to check if input has been validated or not
   */
  didValidate: false,

  /**
   * Query param
   * @property {Boolean} sessionEnds
   */
  sessionEnds: false
});
