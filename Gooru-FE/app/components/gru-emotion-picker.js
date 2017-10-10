import Ember from 'ember';
import { EMOTION_VALUES } from 'gooru-web/config/config';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

/**
 * Emotion picker
 *
 * Component responsible for letting the user select and update an emotion
 * from a predefined list of emotions
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-emotion-picker'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Set a new emotion as selected and update the component appearance accordingly
     *
     * @function actions:setEmotion
     * @param {string} newEmotionValue - newly selected emotion
     * @returns {undefined}
     */
    setEmotion: function(newEmotionValue) {
      let component = this;
      if (!component.get('readOnly')) {
        if (
          !component.get('selectedEmotion') ||
          component.get('selectedEmotion') !== newEmotionValue
        ) {
          component.selectEmotion(newEmotionValue);
          component.sendAction(
            'onChangeEmotion',
            component.get('selectedEmotion')
          );
        }
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * Overwrites didInsertElement hook.
   */
  didInsertElement: function() {
    this._super(...arguments);
    const component = this;
    const startEmotion = this.get('startEmotion');

    // Adds tooltip to UI elements (elements with attribute 'data-toggle')
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    // Sets the emotion icon if there is a score for this resource
    if (startEmotion) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        component.selectEmotion(startEmotion);
      });
    }
  },

  didUpdate: function() {
    this._super(...arguments);
    const startEmotion = this.get('startEmotion');
    this.selectEmotion(startEmotion);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of emotions to be displayed by the component
   *
   * @constant {Array}
   */
  emotionValues: EMOTION_VALUES,

  /**
   * @property {String|Function} onChangeEmotion - event handler for when the selected emotion is changed
   */
  onChangeEmotion: null,

  /**
   * @property {?string} selectedEmotion - selected emotion
   */
  selectedEmotion: 0,

  /**
   * @property {number} Initial emotion value
   */
  startEmotion: 0,

  /**
   * Indicates if changes can be made
   * @property {boolean}
   */
  readOnly: false,

  // -------------------------------------------------------------------------
  // Methods

  selectEmotion: function(emotionValue) {
    this.$('.emotions-list li')
      .find('.active')
      .removeClass('active');
    this.set('selectedEmotion', 0);

    if (emotionValue) {
      this.set('selectedEmotion', emotionValue);
      this.$(`.emotion-${emotionValue}`).toggleClass('active');
    }
  }
});
