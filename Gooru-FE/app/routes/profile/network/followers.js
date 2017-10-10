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

    var myFollowings = this.get('profileService').readFollowing(
      this.get('session.userId')
    );

    //followers
    var followers = this.get('profileService').readFollowers(profile.get('id'));

    return Ember.RSVP.hash({
      followers: followers,
      myFollowings: myFollowings
    });
  },

  setupController: function(controller, model) {
    controller.set('followers', model.followers);
    controller.set('myFollowings', model.myFollowings);
  }
});
