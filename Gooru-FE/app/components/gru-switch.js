import Ember from 'ember';
/**
 * Switch component
 * Component responsible for show two options to switch
 * Use Bootstrap Toggle component that helps
 * you turn your default HTML checkboxes into toggles.
 * @see https://github.com/minhur/bootstrap-toggle/
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-switch'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  /**
   * Overwrites didInsertElement hook.
   */
  didInsertElement: function() {
    const component = this;
    const $toggle = this.$('input[type=checkbox][data-toggle^=toggle]');
    $toggle.bootstrapToggle();
    $toggle.change(function() {
      const checked = $toggle.prop('checked');
      if (checked !== component.get('isChecked')) {
        component.set('isChecked', checked);
        component.sendAction('onOptionSwitch', checked, component.get('item'));
      }
    });
    this.changeStatus(this.get('isChecked'));
  },

  stateObserver: Ember.observer('isChecked', function() {
    this.changeStatus(this.get('isChecked'));
  }),

  // -------------------------------------------------------------------------
  // Methods
  changeStatus: function(isChecked) {
    const $toggle = this.$('input[type=checkbox][data-toggle^=toggle]');
    $toggle.prop('checked', isChecked).change();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Disabled the switch
   * @property {Boolean} disabled
   */
  disabled: false,

  /**
   * List of options to show in the switch
   *
   * @property {Array}
   */
  switchOptions: null,
  /**
   * Item to change
   *
   */
  item: null,

  /**
   * Option in the left side of the switch
   * @property {Array} Option A
   */
  optionA: Ember.computed('switchOptions.[]', function() {
    return this.get('switchOptions')[0];
  }),
  /**
   * Option in the right side of the switch
   * @property {Array} Option B
   */
  optionB: Ember.computed('switchOptions.[]', function() {
    return this.get('switchOptions')[1];
  }),
  /**
   * Indicate if the switch is checked
   * @property {Boolean} isChecked
   */
  isChecked: false
});
