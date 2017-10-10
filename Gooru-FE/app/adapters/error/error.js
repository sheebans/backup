import Ember from 'ember';

/**
 * Adapter to support the errors API 3.0 integration
 *
 * @typedef {Object} ErrorAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus-utils/v1/user-error',

  createError: function(data) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const path = `${namespace}`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify(data.body)
    };
    return Ember.$.ajax(path, options);
  },

  /**
   *
   * @returns {{Authorization: string}}
   */
  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
