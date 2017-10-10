import Ember from 'ember';

/**
 * Convenience mixin for accesing the app configuration
 *
 * @typedef {Object} ConfigurationMixin
 */
export default Ember.Mixin.create({
  /**
   * @property {Ember.Service} Service to configuration properties
   */
  configurationService: Ember.inject.service('configuration'),

  /**
   * @property {*} application configuration properties
   */
  configuration: Ember.computed.alias('configurationService.configuration'),

  /**
   * @property {*} application feature properties
   */
  features: Ember.computed.alias('configuration.features'),

  /**
   * @property {string}
   */
  appRootPath: Ember.computed.alias('configuration.appRootPath'),

  /**
   * Returns the local storage
   * @returns {Storage}
   */
  getLocalStorage: function() {
    return window.localStorage;
  }
});
