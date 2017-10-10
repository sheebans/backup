import Ember from 'ember';
import TenantSerializer from 'gooru-web/serializers/tenant/tenant';
import TenantAdapter from 'gooru-web/adapters/tenant/tenant';

/**
 * Service to support the Lookup entities
 *
 * Country, State, District
 *
 * @typedef {Object} LookupService
 */
export default Ember.Service.extend({
  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service(),

  lookupSerializer: null,

  lookupAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'tenantSerializer',
      TenantSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'tenantAdapter',
      TenantAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Gets tenant information by id
   * @returns {Promise.<Tenant>}
   */
  findTenantById: function(id) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve) {
      service.get('tenantAdapter').findTenantById(id).then(
        function(response) {
          resolve(service.get('tenantSerializer').normalizeTenant(response));
        },
        function() {
          resolve(undefined); //ignore if the api call fails
        }
      );
    });
  },

  /**
   * Gets tenant information from current session
   * @returns {Promise.<Tenant>}
   */
  findTenantFromCurrentSession: function() {
    const tenantId = this.get('session.tenantId');
    return this.findTenantById(tenantId);
  }
});
