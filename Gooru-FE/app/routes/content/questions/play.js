import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:api-sdk/course
   */
  questionService: Ember.inject.service('api-sdk/question'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  model: function(params) {
    var route = this;
    var question = this.get('questionService')
      .readQuestion(params.questionId)
      .then(function(question) {
        return route
          .get('profileService')
          .readUserProfile(question.owner)
          .then(function(owner) {
            question.set('owner', owner);
            return Ember.RSVP.resolve(question);
          });
      });
    return Ember.RSVP.hash({
      question: question
    });
  },

  setupController(controller, model) {
    controller.set('question', model.question);
  }
});
