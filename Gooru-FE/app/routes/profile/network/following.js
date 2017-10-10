import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    const profile = this.modelFor('profile').profile;
    var myFollowings;
    if (profile.get('id') !== this.get('session.userId')) {
      myFollowings = this.get('profileService').readFollowing(
        this.get('session.userId')
      );
    }
    //followings
    var followings = this.get('profileService').readFollowing(
      profile.get('id')
    );

    return Ember.RSVP.hash({
      followings: followings,
      myFollowings: myFollowings
    });
  },

  setupController: function(controller, model) {
    controller.set('followings', model.followings);
    if (model.myFollowings) {
      controller.set('myFollowings', model.myFollowings);
    } else {
      controller.set('myFollowings', model.followings);
    }
  }
});
