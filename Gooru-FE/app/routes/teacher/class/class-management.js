import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Set all controller properties from the model
   * @param controller
   */
  setupController: function(controller) {
    controller.resetValues();
    controller.set('tempClass', controller.get('class').copy());
    controller.get('classController').selectMenuItem('class-management');
  }
});
