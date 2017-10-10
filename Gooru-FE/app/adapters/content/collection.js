import Ember from 'ember';

/**
 * Adapter to support the Collection CRUD operations in the API 3.0
 *
 * @typedef {Object} CollectionAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v1/collections',

  copierNamespace: '/api/nucleus/v1/copier/collections',

  /**
   * Posts a new collection
   *
   * @param data collection data to be sent in the request body
   * @returns {Promise}
   */
  createCollection: function(data) {
    const adapter = this;
    const url = this.get('namespace');
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify(data.body)
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Reads a Collection by id
   *
   * @param {string} collectionId
   * @returns {Promise}
   */
  readCollection: function(collectionId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${collectionId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Update a Collection
   *
   * @param collectionId the id of the Collection to be updated
   * @param data Collection data to be sent in the request body
   * @returns {Promise}
   */
  updateCollection: function(collectionId, data) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${collectionId}`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify(data)
    };

    return Ember.$.ajax(url, options);
  },

  /**
   * Reorder collection resources
   *
   * @param collectionId the id of the Collection to be updated
   * @param data Collection data to be sent in the request body
   * @returns {Promise}
   */
  reorderCollection: function(collectionId, data) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${collectionId}/order`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify(data)
    };

    return Ember.$.ajax(url, options);
  },

  /**
   * Deletes a collection by id
   *
   * @param collectionId collection id to be sent
   * @returns {Promise}
   */
  deleteCollection: function(collectionId) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${collectionId}`;
    const options = {
      type: 'DELETE',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({})
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Adds a resource to a collection
   *
   * @param {string} collectionId
   * @param {string} resourceId
   * @returns {Promise}
   */
  addResource: function(collectionId, resourceId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${collectionId}/resources`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      headers: adapter.defineHeaders(),
      data: JSON.stringify({
        id: resourceId
      })
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Adds a question to a collection
   *
   * @param {string} collectionId
   * @param {string} questionId
   * @returns {Promise}
   */
  addQuestion: function(collectionId, questionId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${collectionId}/questions`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      headers: adapter.defineHeaders(),
      data: JSON.stringify({
        id: questionId
      })
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Copies a collection by id
   *
   * @param collectionId
   * @returns {Promise}
   */
  copyCollection: function(collectionId) {
    const adapter = this;
    const namespace = this.get('copierNamespace');
    const url = `${namespace}/${collectionId}`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({})
    };
    return Ember.$.ajax(url, options);
  },

  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
