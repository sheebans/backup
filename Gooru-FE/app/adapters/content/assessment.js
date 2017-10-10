import Ember from 'ember';

/**
 * Adapter to support the Assessment CRUD operations in the API 3.0
 *
 * @typedef {Object} AssessmentAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v1/assessments',

  copierNamespace: '/api/nucleus/v1/copier/assessments',

  externalNamespace: '/api/nucleus/v1/assessments-external',
  /**
   * Posts a new assessment
   *
   * @param data assessment data to be sent in the request body
   * @returns {Promise}
   */
  createAssessment: function(data) {
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
   * Reads an Assessment by id
   *
   * @param {string} assessmentId
   * @returns {Promise}
   */
  readAssessment: function(assessmentId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${assessmentId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Update an Assessment
   *
   * @param assessmentId the id of the Assessment to be updated
   * @param data Assessment data to be sent in the request body
   * @returns {Promise}
   */
  updateAssessment: function(assessmentId, data) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${assessmentId}`;
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
   * Deletes an assessment by id
   *
   * @param assessmentId assessment id to be sent
   * @returns {Promise}
   */
  deleteAssessment: function(assessmentId) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${assessmentId}`;
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
   * Deletes an assessment by id
   *
   * @param assessmentId assessment id to be sent
   * @returns {Promise}
   */
  deleteExternalAssessment: function(assessmentId) {
    const adapter = this;
    const namespace = this.get('externalNamespace');
    const url = `${namespace}/${assessmentId}`;
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
   * Adds a question to an assessment
   *
   * @param {string} assessmentId
   * @param {string} questionId
   * @returns {Promise}
   */
  addQuestion: function(assessmentId, questionId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${assessmentId}/questions`;
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
   * Copies an assessment by id
   *
   * @param assessmentId
   * @returns {Promise}
   */
  copyAssessment: function(assessmentId) {
    const adapter = this;
    const namespace = this.get('copierNamespace');
    const url = `${namespace}/${assessmentId}`;
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

  /**
   * Reorder assessment resources
   *
   * @param assessmentId the id of the Assessment to be updated
   * @param data Assessment data to be sent in the request body
   * @returns {Promise}
   */
  reorderAssessment: function(assessmentId, data) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${assessmentId}/questions/order`;
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

  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
