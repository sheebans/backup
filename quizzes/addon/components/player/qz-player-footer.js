import Ember from 'ember';

/**
 * Player navigation
 *
 * Component responsible for showing simple navigation controls (i.e. back/next)
 * for the player. It may embed other components for interacting with the player.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-player-footer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user change the emotion
     * @see qz-emotion-picker
     */
    changeEmotion: function(emotionScore) {
      this.sendAction('onChangeEmotion', emotionScore);
    },

    /**
     * Action triggered when the user open the navigator panel
     */
    openNavigator: function() {

    },

    /**
     *
     * Triggered when an item is selected
     * @param item
     */
    selectItem: function(item) {
      this.selectItem(item.resource);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} on change emotion action
   */
  onChangeEmotion: 'onChangeEmotion',

  /**
   * @property {number} The rating score for the current resource
   */
  ratingScore: 0,

  /**
   * Indicates if changes can be made
   * @property {boolean} readOnly
   */
  readOnly: false,

  /**
   * @property {Collection
   */
  collection: null,

  /**
   * @property {String} It will decided to show react widget or not
   */
  showReactButton: true,

  /**
   * @property {String} selectedResourceId - resource Id selected
   */
  selectedResourceId: null,

  /**
   * @property {string|function} onItemSelected - event handler for when an item is selected
   */
  onItemSelected: null,

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false,

  /**
   * Resource result for the selected resource
   * @property {ResourceResult}
   */
   resourceResults: Ember.A([]),

   /**
   * A convenient structure to render the menu
   * @property
   */
  resourceItems: Ember.computed(
    'collection',
    'resourceResults.@each.value',
    'selectedResourceId',
    'showFinishConfirmation',
    function() {
      const component = this;
      const collection = component.get('collection');
      const resourceResults = component.get('resourceResults');
      return resourceResults.map(function(resourceResult) {
        const resourceId = resourceResult.get('resource.id');
        return {
          resource: collection.getResourceById(resourceId),
          started: resourceResult.get('started'),
          isCorrect: resourceResult.get('isCorrect'),
          selected: resourceId === component.get('selectedResourceId')
        };
      });
    }
  ),

  /**
   * Should resource links in the navigator be disabled?
   * @property {boolean}
   */
  isNavigationDisabled: false,

  /**
   * @property {string} on finish collection, having type = 'collection'
   */
  onFinishCollection: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Triggered when a resource item is selected
   * @param {Resource} resource
   */
  selectItem: function(resource) {
    if (resource && !this.get('isNavigationDisabled')) {
      if (this.get('onItemSelected')) {
        this.sendAction('onItemSelected', resource);
      }
      this.sendAction('onCloseNavigator');
    }
  }

});
