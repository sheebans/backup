import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  /**
   * @requires service:api-sdk/class-activity
   */
  classActivityService: Ember.inject.service('api-sdk/class-activity'),

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    const route = this;
    const currentClass = route.modelFor('student.class').class;
    const userId = route.get('session.userId');

    return Ember.RSVP.hash({
      classActivities: route
        .get('classActivityService')
        .findStudentClassActivities(userId, currentClass.get('id'))
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.get('classController').selectMenuItem('class-activities');
    controller.set('classActivities', model.classActivities);
  }
});
