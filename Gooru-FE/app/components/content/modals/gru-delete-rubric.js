import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'modals', 'gru-delete-rubric'],

  // -------------------------------------------------------------------------
  // Events
  init() {
    this._super(...arguments);
    // 'validator' should never be set as a param except for testing
    var validator = this.get('validator');
    if (!validator) {
      this.set(
        'validator',
        Ember.Object.create({
          check1: false
        })
      );
    } else {
      this.set('validator', validator);
    }
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Delete Content
     */
    deleteContent: function(model) {
      let component = this;

      component.set('isLoading', true);

      // This deleteMethod will be a wrapper around the actual delete method that is particular to
      // each question type.
      model
        .deleteMethod()
        .then(function() {
          if (model.callback) {
            model.callback.success();
          }
          component.set('isLoading', false);
          component.triggerAction({ action: 'closeModal' });

          if (model.redirect) {
            component
              .get('router')
              .transitionTo(model.redirect.route, model.redirect.params.id);
          }
        })
        .catch(function(error) {
          var message = component
            .get('i18n')
            .t('content.modals.delete-content.delete-error', {
              type: component
                .get('i18n')
                .t(`common.'${model.type}`)
                .string.toLowerCase()
            }).string;
          component.get('notifications').error(message);
          Ember.Logger.error(error);
        });
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * This is the model used to delete.
   * @property {model}
   */
  model: null,

  /**
   * Object to control when the delete button becomes enabled
   * @property {model}
   */
  validator: null,

  /**
   * Indicate if it's waiting for deleteMethod callback
   */
  isLoading: false,

  /**
   * Indicate if delete button is disabled
   */
  isDisabled: Ember.computed.not('validator.check1')
});
