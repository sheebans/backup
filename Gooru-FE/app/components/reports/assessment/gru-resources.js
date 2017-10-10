import Ember from 'ember';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

export default Ember.Component.extend(ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'gru-resources'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of resources to be displayed by the component
   *
   * @constant {Array}
   */
  results: null,

  /**
   * Indicates if the reaction bar is visible
   * @property {boolean}
   */
  showReactionBar: true
});
