import Ember from 'ember';

/**
 * Adapter to support the Class CRUD operations in the API 3.0
 *
 * @typedef {Object} ClassAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v1/classes',

  reportNamespace: '/api/nucleus-download-reports/v1',

  /**
   * Archive class
   *
   * @param classId Identifier of the class to be archive
   * @returns {Promise}
   */
  archiveClass: function(classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${classId}/archive`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({})
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Posts a new class
   *
   * @param data class data to be sent in the request body
   * @returns {Promise}
   */
  createClass: function(data) {
    const adapter = this;
    const url = adapter.get('namespace');
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
   * Updates an existing class
   *
   * @param data class data to be sent in the request body
   * @returns {Promise}
   */
  updateClass: function(data) {
    const adapter = this;
    const classId = data.classId;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${classId}`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify(data.class)
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Deletes a class by id
   *
   * @param classId class id to be sent
   * @returns {Promise}
   */
  deleteClass: function(classId) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${classId}`;
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
   * Remove Student from a specific class
   *
   * @param classId class id to be sent
   * @param userId user id to be deleted
   * @returns {Promise}
   */
  removeStudentFromClass: function(classId, userId) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${classId}/members/${userId}`;
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
   * Join class
   *
   * @param {string} code class code
   * @returns {Promise}
   */
  joinClass: function(code) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${code}/members`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({}) //empty body is required by the BE
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the list of classes for a user
   * @returns {Promise}
   */
  getMyClasses: function() {
    const adapter = this;
    const url = adapter.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the class information of a given class id
   * @param classId the class ID to be read
   * @returns {Promise}
   */
  readClassInfo: function(classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${classId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Get the list of members, invitees, collaborators and owner of the class
   * @param classId the class ID to be read
   * @returns {Promise}
   */
  readClassMembers: function(classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${classId}/members`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the class content visibility
   * @param classId the class ID to be read
   * @returns {Promise}
   */
  readClassContentVisibility: function(classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${classId}/courses`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },
  /**
   * Update content visibility
   * @param []
   * @returns {Promise}
   */
  updateContentVisibility: function(classId, content) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${classId}/courses`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({
        assessments: content.assessments
      })
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Associates a Course with a Class
   *
   * @param classId the class id
   * @param courseId the course id
   * @returns {Promise}
   */
  associateCourseToClass: function(courseId, classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${classId}/courses/${courseId}`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({})
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the class report status for an archived class
   * @param {string} classId the class id
   * @param {string} courseId the course id
   * @param {string} userId the user id
   * @returns {Promise.<string>} available|queued|in-progress
   */
  readClassReportStatus: function(classId, courseId, userId) {
    const adapter = this;
    const namespace = adapter.get('reportNamespace');
    const sessionToken = encodeURIComponent(this.get('session.token-api3'));
    const url = `${namespace}/class/${classId}/course/${courseId}/download/request?sessionToken=${sessionToken}&userId=${userId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Creates the headers required by API 3.0
   * @returns {{Authorization: string}}
   */
  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
