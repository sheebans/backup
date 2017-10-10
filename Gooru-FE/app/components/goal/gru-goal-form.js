import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @dependency service:goal
   */
  goalService: Ember.inject.service('api-sdk/goal'),

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['gru-goal-form'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    onStatusChange: function(newValue) {
      this.set('showStatusErrorMessage', false);
      const goal = this.get('goal');
      goal.set('status', newValue);
    },

    onTypesChange: function(newValue) {
      this.set('type', newValue);
    },

    create: function() {
      const component = this;
      const goal = component.get('goal');
      const startDate = goal.get('startDate');
      const endDate = goal.get('endDate');
      let areDatesOk = false;

      if (component.get('onCreate')) {
        let statusSelected = component.get('statusSelected');
        let showStatusErrorMessage = !statusSelected;
        component.set('showStatusErrorMessage', showStatusErrorMessage);

        if (startDate != null && endDate != null) {
          areDatesOk = component
            .get('goalService')
            .checkBothDates(startDate, endDate);
          component.set('showDatesError', !areDatesOk);
        }

        this.sendAction('onCreate', goal, areDatesOk);
      }
    },

    update: function() {
      if (this.get('onUpdate')) {
        const component = this;
        const goal = component.get('goal');
        const startDate = goal.get('startDate');
        const endDate = goal.get('endDate');
        let areDatesOk = false;

        if (startDate != null && endDate != null) {
          areDatesOk = component
            .get('goalService')
            .checkBothDates(startDate, endDate);
          component.set('showDatesError', !areDatesOk);
        }

        this.sendAction('onUpdate', areDatesOk);
      }
    },

    cancelEdit: function() {
      if (this.get('onCancelEdit')) {
        this.sendAction('onCancelEdit');
      }
    },

    cancel: function() {
      if (this.get('onCancel')) {
        this.sendAction('onCancel');
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events
  didInsertElement: function() {
    this.$('.form-group .title input').focus();
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Goal} goal information
   */
  goal: null,

  /**
   * @property {boolean}
   */
  isEditView: null,

  /**
   * @property {string} name of the create action
   */
  onCreate: null,

  /**
   * @property {string} name of the update action
   */
  onUpdate: null,

  /**
   * @property {string} name of the cancel edit action
   */
  onCancelEdit: null,

  /**
   * @property {string} name of the cancel action
   */
  onCancel: null,

  /**
   * statusSelected
   * @property {String}
   */
  statusSelected: Ember.computed.alias('goal.status'),

  /**
   * @property {Array} Returns the list of possible status to fill component
   */
  statusOptions: Ember.computed(function() {
    return this.get('goalService').getGoalStatusOptions();
  }),

  /**
   * @property {String} Goal type
   */
  type: '',

  typeOptions: Ember.computed(function() {
    let options = [
      {
        id: 'Completion',
        name: 'Completion'
      },
      {
        id: 'Performance',
        name: 'Performance'
      },
      {
        id: 'Improvement',
        name: 'Improvement'
      },
      {
        id: 'Teamwork',
        name: 'Teamwork'
      },
      {
        id: 'Growth',
        name: 'Growth'
      },
      {
        id: 'Mindset',
        name: 'Mindset'
      },
      {
        id: 'Seek help',
        name: 'Seek help'
      },
      {
        id: 'Help another',
        name: 'Help another'
      }
    ];
    return options;
  })
});
