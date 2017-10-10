import Ember from 'ember';
import ProfileSerializer from 'gooru-web/serializers/profile/profile';
import CourseSerializer from 'gooru-web/serializers/content/course';
import AuthenticationSerializer from 'gooru-web/serializers/authentication/authentication';
import ProfileAdapter from 'gooru-web/adapters/profile/profile';
import ProfileCoursesAdapter from 'gooru-web/adapters/profile/courses';
import AvailabilityAdapter from 'gooru-web/adapters/profile/availability';
import { NETWORK_TYPE } from 'gooru-web/config/config';

/**
 * Service to support the Profile CRUD operations
 *
 * @typedef {Object} ProfileService
 */
export default Ember.Service.extend({
  session: Ember.inject.service(),

  store: Ember.inject.service(),

  profileSerializer: null,

  courseSerializer: null,

  authenticationSerializer: null,

  profileAdapter: null,

  i18n: Ember.inject.service(),

  init: function() {
    this._super(...arguments);
    this.set(
      'profileSerializer',
      ProfileSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'courseSerializer',
      CourseSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'authenticationSerializer',
      AuthenticationSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'profileAdapter',
      ProfileAdapter.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'profileCoursesAdapter',
      ProfileCoursesAdapter.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'availabilityAdapter',
      AvailabilityAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Creates a new user account
   *
   * @param profileData object with the profile data
   * @returns {Promise}
   */
  createProfile: function(profileData) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      profileData.set('tenantId', service.get('session.tenantId'));
      let serializedProfileData = service
        .get('profileSerializer')
        .serializeCreateProfile(profileData);
      service
        .get('profileAdapter')
        .createProfile({
          body: serializedProfileData
        })
        .then(
          function(response) {
            resolve(
              service
                .get('authenticationSerializer')
                .normalizeResponse(response, false, undefined)
            );
          },
          function(error) {
            reject(
              error && error.responseText
                ? JSON.parse(error.responseText)
                : error
            );
          }
        );
    });
  },

  /**
   * Updates the current user Profile information
   *
   * @param profile
   * @returns {Ember.RSVP.Promise}
   */
  updateMyProfile: function(profile) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let serializedProfile = service
        .get('profileSerializer')
        .serializeUpdateProfile(profile);
      service
        .get('profileAdapter')
        .updateMyProfile({
          body: serializedProfile
        })
        .then(
          function() {
            resolve();
          },
          function(error) {
            reject(
              error && error.responseText
                ? JSON.parse(error.responseText)
                : error
            );
          }
        );
    });
  },

  /**
   * Gets the user Profile information of a given user id
   *
   * @returns {Promise}
   */
  readUserProfile: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.readMultipleProfiles([userId]).then(function(profiles) {
        resolve(profiles.length ? profiles[0] : undefined);
      }, reject);
    });
  },

  /**
   * Gets the user Profile information of a given username
   *
   * @returns {Promise}
   */
  readUserProfileByUsername: function(username) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('profileAdapter').readUserProfileByUsername(username).then(
        function(response) {
          resolve(
            service.get('profileSerializer').normalizeReadProfile(response)
          );
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Follows a user profile
   * @param userId
   * @returns {Ember.RSVP.Promise}
   */
  followUserProfile: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('profileAdapter').followUserProfile(userId).then(
        function() {
          resolve();
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Unfollows a user profile
   * @param userId
   * @returns {Ember.RSVP.Promise}
   */
  unfollowUserProfile: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('profileAdapter').unfollowUserProfile(userId).then(
        function() {
          resolve();
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Checks if the username was already taken
   * @param username
   * @returns {Promise}
   */
  checkUsernameAvailability: function(username) {
    const service = this;
    const i18n = service.get('i18n');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('availabilityAdapter').verifyUsername(username).then(
        function() {
          reject(i18n.t('sign-up.error-username-taken').string);
        },
        function(error) {
          if (
            error.status === 404 ||
            error.status === 500 ||
            error.status === 200
          ) {
            resolve();
          } else {
            reject(error);
          }
        }
      );
    });
  },

  /**
   * Checks if the email was already taken
   * @param email
   * @returns {Promise}
   */
  checkEmailAvailability: function(email) {
    const service = this;
    const i18n = service.get('i18n');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('availabilityAdapter').verifyEmail(email).then(
        function() {
          reject(i18n.t('sign-up.error-email-taken').string);
        },
        function(error) {
          if (
            error.status === 404 ||
            error.status === 500 ||
            error.status === 200
          ) {
            resolve();
          } else {
            reject(error);
          }
        }
      );
    });
  },

  /**
   * Checks if the email exists
   * @param email
   * @returns {Promise}
   */
  checkEmailExists: function(email) {
    const service = this;
    const i18n = service.get('i18n');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('availabilityAdapter').verifyEmail(email).then(
        function() {
          resolve();
        },
        function() {
          reject(i18n.t('forgot-password.error-email-not-exists').string);
        }
      );
    });
  },

  /**
   * Checks if the email was already taken by a google account
   * @param email
   * @returns {Promise}
   */
  checkGoogleEmail: function(email) {
    const service = this;
    const i18n = service.get('i18n');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('availabilityAdapter').verifyEmail(email).then(
        function(user) {
          if (user.login_type === 'google') {
            reject(i18n.t('common.errors.reset-google-account-exists').string);
          } else {
            resolve();
          }
        },
        function(error) {
          if (error.status === 404 || error.status === 200) {
            resolve();
          } else {
            reject(error);
          }
        }
      );
    });
  },

  /**
   * Checks if the username was already taken by a google account
   * @param username
   * @returns {Promise}
   */
  checkGoogleUsername: function(username) {
    const service = this;
    const i18n = service.get('i18n');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('availabilityAdapter').verifyUsername(username).then(
        function(user) {
          if (user.login_type === 'google') {
            reject(
              i18n.t('common.errors.sign-in-google-account-exists').string
            );
          } else {
            resolve();
          }
        },
        function(error) {
          if (error.status === 404 || error.status === 200) {
            resolve();
          } else {
            reject(error);
          }
        }
      );
    });
  },

  /**
   * Gets the list of courses created by the profile and filter by subject
   *
   * @param profile the Profile object
   * @param subject the subject to filter the courses
   * @returns {Promise}
   */
  getCourses: function(profile, subject, params) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileCoursesAdapter')
        .getCourses(profile.get('id'), subject, params)
        .then(
          function(response) {
            resolve(
              service.get('courseSerializer').normalizeGetCourses(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Returns the current logged user information
   * @returns {*}
   */
  findByCurrentUser: function() {
    if (!this.get('session.isAnonymous')) {
      var currentProfileId = this.get('session.userId');
      return this.readUserProfile(currentProfileId);
    }
    return null;
  },

  /**
   * Return the list of resources related to a user
   * @param {string} userId
   * @param {*} params
   * @returns {RSVP.Promise.<Resource>}
   */
  readResources: function(userId, params) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .readResources(userId, params)
        .then(function(response) {
          resolve(
            service.get('profileSerializer').normalizeReadResources(response)
          );
        }, reject);
    });
  },

  /**
   * Return the list of questions related to a user
   * @param {string} userId
   * @param {*} params
   * @returns {RSVP.Promise.<Question>}
   */
  readQuestions: function(userId, params) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .readQuestions(userId, params)
        .then(function(response) {
          resolve(
            service.get('profileSerializer').normalizeReadQuestions(response)
          );
        }, reject);
    });
  },

  /**
   * Return the list of collections related to a user
   * @param {string} userId
   * @param {*} params
   * @returns {RSVP.Promise.<Collection>}
   */
  readCollections: function(userId, params) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .readCollections(userId, params)
        .then(function(response) {
          resolve(
            service.get('profileSerializer').normalizeReadCollections(response)
          );
        }, reject);
    });
  },

  /**
   * Return the list of assessments related to a user
   * @param {string} userId
   * @param {*} params
   * @returns {RSVP.Promise.<Assessment>}
   */
  readAssessments: function(userId, params) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .readAssessments(userId, params)
        .then(function(response) {
          resolve(
            service.get('profileSerializer').normalizeReadAssessments(response)
          );
        }, reject);
    });
  },
  /**
   * Return the list of rubrics related to a user
   * @param {string} userId
   * @param {*} params
   * @returns {RSVP.Promise.<Rubric>}
   */
  readRubrics: function(userId, params) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .readRubrics(userId, params)
        .then(function(response) {
          resolve(
            service.get('profileSerializer').normalizeReadRubrics(response)
          );
        }, reject);
    });
  },

  /**
   * Starts the forgot password workflow
   * @param {string} username - account's username or email
   * @returns {Ember.RSVP.Promise}
   */
  forgotPassword: function(email) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('profileAdapter').forgotPassword(email).then(
        function() {
          resolve();
        },
        function(error) {
          reject(
            error && error.responseText ? JSON.parse(error.responseText) : error
          );
        }
      );
    });
  },

  /**
   * Resets the user password
   * @param {string} password
   * @param {string} token
   * @returns {Ember.RSVP.Promise}
   */
  resetPassword: function(password, token) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('profileAdapter').resetPassword(password, token).then(
        function() {
          resolve(token);
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Return the list of profiles the user is following
   * @param userId
   * @returns {Ember.RSVP.Promise}
   */
  readFollowing: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .readNetwork(userId, NETWORK_TYPE.FOLLOWING)
        .then(
          function(response) {
            resolve(
              service
                .get('profileSerializer')
                .normalizeReadNetwork(response, NETWORK_TYPE.FOLLOWING)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Return the list of profiles that are following the user
   * @param userId
   * @returns {Ember.RSVP.Promise}
   */
  readFollowers: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .readNetwork(userId, NETWORK_TYPE.FOLLOWERS)
        .then(
          function(response) {
            resolve(
              service
                .get('profileSerializer')
                .normalizeReadNetwork(response, NETWORK_TYPE.FOLLOWERS)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  readMultipleProfiles: function(profileIds, max = 30) {
    const service = this;
    var chunk = profileIds.length > max ? max : profileIds.length;
    const promises = [];
    var usersProfile = Ember.A([]);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      for (let i = 0, j = profileIds.length; i < j; i += chunk) {
        let temparray = profileIds.slice(i, i + chunk);
        const promise = service
          .get('profileAdapter')
          .readMultipleProfiles(temparray);
        promises.push(promise);
      }
      Ember.RSVP.all(promises).then(
        function(values) {
          values.forEach(function(value) {
            usersProfile.addObjects(
              service
                .get('profileSerializer')
                .normalizeReadMultipleProfiles(value)
            );
          });

          resolve(usersProfile);
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Creates a new empty user model
   * @returns {User}
   */
  newUser: function() {
    return this.get('store').createRecord('user/user');
  }
});
