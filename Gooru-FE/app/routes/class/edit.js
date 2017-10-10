import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    infoClassTransition: function() {
      let route = this;
      let classId = route.controller.get('class.id');
      this.transitionTo('class.info', classId);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    var classModel = model.class;
    var courseModel = model.course;

    controller.get('classController').selectMenuItem('info');

    controller.set('class', classModel);
    controller.set('course', courseModel);
    controller.set('tempClass', classModel.copy());
    controller.resetProperties();
  }
});
