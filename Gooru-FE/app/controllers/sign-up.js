import Ember from 'ember';
import Profile from 'gooru-web/models/profile/profile';
import Env from 'gooru-web/config/environment';
import signUpValidations from 'gooru-web/validations/sign-up';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} Session service
   */
  sessionService: Ember.inject.service('api-sdk/session'),

  /**
   * @property {Service} Profile service
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  applicationController: Ember.inject.controller('application'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    next: function() {
      const controller = this;
      const profile = controller.get('profile');
      const birthDayDate = controller.validDateSelectPicker();

      if (controller.get('didValidate') === false) {
        var username = Ember.$('.gru-input.username input').val();
        var email = Ember.$('.gru-input.email input').val();
        var password = Ember.$('.gru-input.password input').val();
        var rePassword = Ember.$('.gru-input.rePassword input').val();
        var firstName = Ember.$('.gru-input.firstName input').val();
        var lastName = Ember.$('.gru-input.lastName input').val();
        profile.set('username', username);
        profile.set('password', password);
        profile.set('rePassword', rePassword);
        profile.set('email', email);
        profile.set('firstName', firstName);
        profile.set('lastName', lastName);
      }

      profile.validate().then(function({ validations }) {
        if (validations.get('isValid') && birthDayDate !== '') {
          profile.set('dateOfBirth', birthDayDate);
          controller.get('profileService').createProfile(profile).then(
            function(profile) {
              controller.get('sessionService').signUp(profile).then(function() {
                controller.set('didValidate', true);
                // Trigger action in parent
                controller.send('signUp');
                controller.get('applicationController').loadUserClasses();
              });
            },
            function(error) {
              if (error && (error.email || error.username)) {
                controller.set('emailError', error.email);
                controller.set('usernameError', error.username);
                controller.keydownEvents();
              } else {
                // Unexpected error
                var message = controller
                  .get('i18n')
                  .t('common.errors.sign-up-error').string;
                controller.get('notifications').error(message);
                Ember.Logger.error(error);
              }
            }
          );
        }
        controller.set('dateValidated', true);
      });
    },

    close: function() {
      var controller = this;
      controller.set('showChildLayout', false);
      controller.send('closeSignUp');
    },

    /**
     * Triggered when the gru-select-date-picker options are selected
     * @param {*} item
     */
    validDate: function() {
      const controller = this;
      const birthDayDate = controller.validDateSelectPicker();

      if (controller.calculateAge(birthDayDate) >= 13) {
        controller.set('showChildLayout', false);
      } else {
        controller.set('showChildLayout', true);
      }
    }
  },
  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @type {String} Error with email field
   */
  emailError: false,

  /**
   * @type {String} Error with username field
   */
  usernameError: false,

  /**
   * @type {Profile} profile
   */
  profile: null,

  /**
   * @type {String} monthSelected
   */
  monthSelected: null,

  /**
   * @type {String} daySelected
   */
  daySelected: null,

  /**
   * @type {String} yearSelected
   */
  yearSelected: null,

  /**
   * Show child layout or not
   * @property {Boolean}
   */

  showChildLayout: false,

  /**
   * @param {Boolean } didValidate - value used to check if input has been validated or not
   */
  didValidate: false,

  /**
   * @param {Boolean } dateValidated - value used to check if birthdate has been validated or not
   */
  dateValidated: false,

  /**
   * terms and conditions url
   * @property {string}
   */
  termsConditionsUrl: Ember.computed(function() {
    return Env.termsConditionsUrl;
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * init and reset all the properties for the validations
   */

  resetProperties() {
    var controller = this;
    var signUpProfile = Profile.extend(signUpValidations);
    var profile = signUpProfile.create(Ember.getOwner(this).ownerInjection(), {
      username: null,
      password: null,
      firstName: null,
      lastName: null,
      email: null
    });

    controller.set('profile', profile);
    const url = `${window.location.protocol}//${window.location.host}${Env[
      'google-sign-in'
    ].url}`;
    controller.set('googleSignUpUrl', url);
    controller.set('didValidate', false);
    controller.set('emailError', false);
    controller.set('usernameError', false);
  },

  /**
   * validate Date SelectPicker
   * @returns {Boolean}
   */
  validDateSelectPicker: function() {
    var controller = this;
    var monthSelected = $('.selectpicker.months option:selected').val();
    var daySelected = $('.selectpicker.days option:selected').val();
    var yearSelected = $('.selectpicker.years option:selected').val();
    var birthDayDate = '';

    controller.set('monthSelected', controller.getMonthName(monthSelected));
    controller.set('daySelected', daySelected);
    controller.set('yearSelected', yearSelected);

    if (monthSelected || daySelected || yearSelected) {
      birthDayDate = `${monthSelected}/${daySelected}/${yearSelected}`;
    }

    return birthDayDate;
  },

  /**
   * get month name of monthSelected
   * @param {String} monthSelected
   * @returns {String}
   */
  getMonthName: function(monthSelected) {
    const i18n = this.get('i18n');
    const monthNames = [
      i18n.t('sign-up.dateOfBirth.months.january'),
      i18n.t('sign-up.dateOfBirth.months.february'),
      i18n.t('sign-up.dateOfBirth.months.march'),
      i18n.t('sign-up.dateOfBirth.months.april'),
      i18n.t('sign-up.dateOfBirth.months.may'),
      i18n.t('sign-up.dateOfBirth.months.june'),
      i18n.t('sign-up.dateOfBirth.months.july'),
      i18n.t('sign-up.dateOfBirth.months.august'),
      i18n.t('sign-up.dateOfBirth.months.september'),
      i18n.t('sign-up.dateOfBirth.months.october'),
      i18n.t('sign-up.dateOfBirth.months.november'),
      i18n.t('sign-up.dateOfBirth.months.december')
    ];

    return monthNames.objectAt(parseInt(monthSelected) - 1);
  },

  /**
   * calculate age of user
   * @param {String} dateOfBirth
   * @returns {Number}
   */
  calculateAge: function(dateOfBirth) {
    var today = new Date();
    var birthDate = new Date(dateOfBirth);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  },

  /**
   * Add keydown events to clear errors on username and email
   */
  keydownEvents: function() {
    const controller = this;
    var $username = Ember.$('.username input');
    var $email = Ember.$('.email input');
    $username.on('keydown', function() {
      controller.set('usernameError', false);
    });
    $email.unbind('keydown');
    $email.on('keydown', function() {
      controller.set('emailError', false);
    });
  }
});
