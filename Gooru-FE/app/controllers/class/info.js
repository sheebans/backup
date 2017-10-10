import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
/**
 * Class Information controller
 *
 * Controller responsible of the logic for the class information page
 */
export default Ember.Controller.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  classController: Ember.inject.controller('class'),

  /**
   * @requires service:api-sdk/class
   */
  classService: Ember.inject.service('api-sdk/class'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     *
     * Triggered when a delete class option is selected
     */
    deleteClass: function() {
      let controller = this;
      var model = {
        content: controller.get('class'),
        deleteMethod: function() {
          return controller
            .get('classService')
            .deleteClass(controller.get('class.id'));
        },
        callback: {
          success: function() {
            controller.send('updateUserClasses');
          }
        }
      };

      this.actions.showModal.call(
        controller,
        'content.modals.gru-delete-class',
        model,
        null,
        null,
        null,
        false
      );
    },
    /**
     * Remove student
     */
    removeStudent: function(student) {
      this.get('class.members').removeObject(student);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * A link to the parent class controller
   * @see controllers/class.js
   * @property {Class}
   */
  class: Ember.computed.alias('classController.class'),

  /**
   * @property {User[]} class students
   */
  students: Ember.computed.reads('classController.members'),

  /**
   * A link to the computed property isStudent in class controller
   * @see controllers/class.js
   * @property {isStudent}
   */
  isStudent: Ember.computed.reads('classController.isStudent')
  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
