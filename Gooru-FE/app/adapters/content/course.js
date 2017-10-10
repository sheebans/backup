import Ember from 'ember';

/**
 * Adapter to support the Course CRUD operations in the API 3.0
 *
 * @typedef {Object} CourseAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v1/courses',

  copierNamespace: '/api/nucleus/v1/copier/courses',

  /**
   * Posts a new course
   *
   * @param data - course data to be sent in the request body
   * @returns {Promise|String} ID of the newly created course
   */
  createCourse: function(data) {
    const url = this.get('namespace');
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: this.defineHeaders(),
      data: JSON.stringify(data.body)
    };

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax(url, options).then(
        function(responseData, textStatus, request) {
          var courseId = request.getResponseHeader('location');
          resolve(courseId);
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Update existing course
   *
   * @param data - course data to be sent in the request body
   * @returns {Promise|String} ID of the newly created course
   */
  updateCourse: function(data) {
    const courseId = data.courseId;
    const url = `${this.get('namespace')}/${courseId}`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: this.defineHeaders(),
      data: JSON.stringify(data.course)
    };

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax(url, options).then(
        function() {
          resolve('');
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Get course data for the corresponding course ID
   *
   * @param courseId - course ID to search for
   * @returns {Promise|Object}
   */
  getCourseById: function(courseId) {
    const url = `${this.get('namespace')}/${courseId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.defineHeaders()
    };

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax(url, options).then(
        function(responseData) {
          resolve(responseData);
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Gets the course structure by collection type
   *
   * @param {string} courseId
   * @param {string} collectionType assessment|collection
   * @returns {Promise|Object}
   */
  getCourseStructure: function(courseId, collectionType) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${courseId}/${collectionType}s`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.defineHeaders()
    };

    return Ember.$.ajax(url, options);
  },

  /**
   * Deletes a course by id
   *
   * @param courseId course id to be sent
   * @returns {Promise}
   */
  deleteCourse: function(courseId) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${courseId}`;
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
  * Copies a course by id
  *
  * @param data course data to be sent in the request body
  * @returns {Promise}
  */
  copyCourse: function(courseId) {
    const adapter = this;
    const namespace = this.get('copierNamespace');
    const url = `${namespace}/${courseId}`;
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
   * Reorder course units
   *
   * @param courseId the id of the Course to be updated
   * @param data Course data to be sent in the request body
   * @returns {Promise}
   */
  reorderCourse: function(courseId, data) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${courseId}/order`;
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
