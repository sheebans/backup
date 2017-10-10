import Ember from 'ember';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  profileService: Ember.inject.service('api-sdk/profile'),

  sessionService: Ember.inject.service('api-sdk/session'),
  // -------------------------------------------------------------------------
  // Actions
  actions: {
    toggleFollowingStatus() {
      const controller = this;

      if (this.get('session.isAnonymous')) {
        this.send('showModal', 'content.modals.gru-login-prompt');
      } else {
        if (controller.get('profile.isFollowing')) {
          controller
            .get('profileService')
            .unfollowUserProfile(controller.get('profile.id'))
            .then(function() {
              controller
                .get('profileService')
                .readUserProfile(controller.get('profile.id'))
                .then(function(updatedProfile) {
                  controller.set('profile', updatedProfile);
                });
            });
        } else {
          controller
            .get('profileService')
            .followUserProfile(controller.get('profile.id'))
            .then(function() {
              controller
                .get('profileService')
                .readUserProfile(controller.get('profile.id'))
                .then(function(updatedProfile) {
                  controller.set('profile', updatedProfile);
                });
            });
        }
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the user is seeing his own profile
   * @property {isMyProfile}
   * @see {Class} profile
   * @returns {bool}
   */
  isMyProfile: Ember.computed('profile', function() {
    return this.get('profile').get('id') === this.get('currentUserId');
  }),

  /**
   * Current user id
   */
  currentUserId: Ember.computed.alias('session.userId'),

  /**
   * The profile presented to the user
   * @property {Profile}
   */
  profile: null,

  /**
   * The menuItem selected
   * @property {String}
   */
  menuItem: null,

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Selected the menu item
   * @param {string} item
   */
  selectMenuItem: function(item) {
    this.set('menuItem', item);
  }
});
