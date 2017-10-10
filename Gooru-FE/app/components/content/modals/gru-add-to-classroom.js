import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {ClassActivityService}
   */
  classActivityService: Ember.inject.service('api-sdk/class-activity'),

  /**
   * @property {classService}
   */
  classService: Ember.inject.service('api-sdk/class'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'modals', 'gru-add-to-classroom'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Select classroom
     */
    selectClassroom: function(classroom) {
      this.set('selectedClassroom', classroom);
    },

    /**
     * Add to classroom or daily class activity
     */
    addTo: function() {
      let component = this;
      let content = component.get('model.content');
      let isClassActivity = component.get('model.classActivity');
      let selectedClassroom = component.get('selectedClassroom');
      let classId = selectedClassroom.get('id');

      if (isClassActivity) {
        component
          .get('classActivityService')
          .addActivityToClass(
            classId,
            content.get('id'),
            content.get('collectionType')
          )
          .then(function() {
            component.triggerAction({ action: 'closeModal' });
          });
      } else {
        component
          .get('classService')
          .associateCourseToClass(content.get('id'), classId)
          .then(function() {
            let callback = component.get('model.callback');
            callback.success();
            component.triggerAction({ action: 'closeModal' });
          });
      }
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Model with the values to use in the modal
   */
  model: null
});
