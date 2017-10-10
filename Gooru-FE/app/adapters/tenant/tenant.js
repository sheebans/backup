import Ember from 'ember';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

/**
 * Adapter for the Tenant model
 *
 * @typedef {Object} TenantAdapter
 */
export default Ember.Object.extend(ConfigurationMixin, {
  /**
   * Find a tenant by id
   * @param {string} id
   * @returns {Promise.<Tenant>}
   */
  findTenantById: function(id) {
    const adapter = this;
    const basePath = adapter.get('configuration.endpoint.tenantUrl');
    const url = `${basePath}/${id}/tenant.json`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8'
    };
    return Ember.$.ajax(url, options);
  }
});
