import Ember from 'ember';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  parentController: Ember.inject.controller('profile'),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * A link to the parent profile controller
   * @see controllers/profile.js
   * @property {Class}
   */
  profile: Ember.computed.reads('parentController.profile'),

  /**
   * A link to the computed property isMyProfile in profile controller
   * @see controllers/profile.js
   * @property {isMyProfile}
   */
  isMyProfile: Ember.computed.reads('parentController.isMyProfile')
});
