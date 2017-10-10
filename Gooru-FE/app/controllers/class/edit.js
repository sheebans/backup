import Ember from 'ember';

/**
 * Class Information controller
 *
 * Controller responsible of the logic for the class information page
 */
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  classController: Ember.inject.controller('class'),

  /**
   * @property {Ember.Service} Service to do retrieve states, districts
   */
  classService: Ember.inject.service('api-sdk/class'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    updateClass: function() {
      var controller = this;
      let editedClass = this.get('tempClass');
      var greeting = $.trim(this.get('tempClass.greeting'));

      editedClass.validate().then(
        function({ validations }) {
          if (validations.get('isValid')) {
            if (greeting === '') {
              editedClass.set('greeting', null);
            }
            controller
              .get('classService')
              .updateClass(editedClass)
              .then(function() {
                // Trigger action in route
                controller.send('infoClassTransition');
              });
            controller
              .get('class')
              .merge(editedClass, ['title', 'greeting', 'minScore']);
          }
          this.set('didValidate', true);
        }.bind(this)
      );
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * A link to the parent class controller
   * @see controllers/class.js
   * @property {Class}
   */
  class: Ember.computed.reads('classController.class'),

  /**
   * Copy of the class model used for editing.
   * @property {Class}
   */
  tempClass: null,

  /**
   * @param {Boolean } didValidate - value used to check if input has been validated or not
   */
  didValidate: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * init and reset all the properties for the validations
   */
  resetProperties() {
    var controller = this;

    controller.set('didValidate', false);
  }
});
