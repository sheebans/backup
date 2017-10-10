import Ember from 'ember';

/**
 * Adapter to support the Question CRUD operations in the API 3.0
 *
 * @typedef {Object} QuestionAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v2/questions',

  copierNamespace: '/api/nucleus/v1/copier/questions',

  /**
   * Posts a new question
   *
   * @param data question data to be sent in the request body
   * @returns {Promise}
   */
  createQuestion: function(data) {
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
   * Reads a question by id
   *
   * @param {string} questionId
   * @returns {Promise}
   */
  readQuestion: function(questionId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${questionId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Update a question
   *
   * @param questionId the id of the question to be updated
   * @param data question data to be sent in the request body
   * @returns {Promise}
   */
  updateQuestion: function(questionId, data) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${questionId}`;
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
   * Deletes a question by id
   *
   * @param questionId question id to be sent
   * @returns {Promise}
   */
  deleteQuestion: function(questionId) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${questionId}`;
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
   * Copies a question by id
   *
   * @param data question data to be sent in the request body
   * @returns {Promise}
   */
  copyQuestion: function(questionId) {
    const adapter = this;
    const namespace = this.get('copierNamespace');
    const url = `${namespace}/${questionId}`;
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
