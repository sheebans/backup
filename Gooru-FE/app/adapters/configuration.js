import Ember from 'ember';

/**
 * Adapter to support the Lookup API 3.0 integration
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/config',

  /**
   * Gets custom configuration
   * @returns {Promise.<[]>}
   */
  loadConfiguration: function(key, configBaseUrl) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const basePath = configBaseUrl ? configBaseUrl : '';
    const url = `${basePath}${namespace}/${key}.json`;
    const options = {
      type: 'GET'
    };
    return Ember.RSVP
      .hashSettled({
        configuration: Ember.$.ajax(url, options)
      })
      .then(function(hash) {
        return hash.configuration.value;
      });
  }
});
