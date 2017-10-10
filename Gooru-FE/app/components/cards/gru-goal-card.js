import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['cards gru-goal-card'],

  classNameBindings: ['expanded:expanded:collapsed', 'isEdition:edit-view'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    toggle: function() {
      this.set('expanded', !this.get('expanded'));
    },

    editView: function() {
      let goal = this.get('goal');
      let tmpGoal = goal.copy();
      this.set('tmpGoal', tmpGoal);
      this.set('isEdition', true);
    },

    update: function(areDatesOk) {
      const component = this;
      if (component.get('onUpdate')) {
        let tmpGoal = component.get('tmpGoal');
        component.get('onUpdate')(tmpGoal, areDatesOk).then(function(saved) {
          if (saved) {
            const originalGoal = component.get('goal');
            var properties = originalGoal
              .modelProperties()
              .concat(['startDate', 'endDate']);
            originalGoal.merge(tmpGoal, properties);
          }
          component.set('isEdition', !saved);
        });
      }
    },

    cancelEditGoal: function() {
      this.set('isEdition', false);
    },

    delete: function() {
      if (this.get('onDelete')) {
        this.sendAction('onDelete', this.get('goal'));
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Goal} goal information
   */
  goal: null,

  /**
   * @property {Goal} original goal information
   */
  tmpGoal: null,

  /**
   * @property {boolean}
   */
  expanded: false,

  /**
   * @property {boolean}
   */
  isEdition: false,

  /**
   * @property {string} name of the delete action
   */
  onDelete: null,

  /**
   * @property {string} name of the update action
   */
  onUpdate: null
});
