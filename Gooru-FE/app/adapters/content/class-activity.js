import Ember from 'ember';
import { formatDate } from 'gooru-web/utils/utils';

/**
 * Adapter to support the class activity CRUD operations
 *
 * @typedef {Object} ClassActivityAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v2/classes',

  /**
   * Adds a new content to class
   *
   * @param {string} classId
   * @param {string} contentId
   * @param {string} contentType
   * @param {Date} addedDate
   * @param { { courseId: string, unitId: string, lessonId: string } } context
   * @returns {Promise}
   */
  addActivityToClass: function(
    classId,
    contentId,
    contentType,
    addedDate = new Date(),
    context = {}
  ) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${classId}/contents`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({
        class_id: classId,
        content_id: contentId,
        content_type: contentType,
        dca_added_date: formatDate(addedDate, 'YYYY-MM-DD'),
        ctx_course_id: context ? context.courseId : null,
        ctx_unit_id: context ? context.unitId : null,
        ctx_lesson_id: context ? context.lessonId : null,
        ctx_collection_id: context ? context.collectionId : null
      })
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Enables the class content
   *
   * @param {string} classId
   * @param {string} classActivityId
   * @returns {Promise}
   */
  enableClassActivity: function(
    classId,
    classActivityId,
    activationDate = new Date()
  ) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${classId}/contents/${classActivityId}`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({
        activation_date: formatDate(activationDate, 'YYYY-MM-DD')
      })
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets all class activity for the authorized user (student|teacher)
   *
   * @param {string} classId
   * @param {string} contentType collection|assessment|resource|question
   * @param {Date} startDate optional, default is now
   * @param {Date} endDate optional, default is now
   * @returns {Promise}
   */
  findClassActivities: function(
    classId,
    contentType = undefined,
    startDate = new Date(),
    endDate = new Date()
  ) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${classId}/contents`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {
        content_type: contentType,
        date_from: formatDate(startDate, 'YYYY-MM-DD'),
        date_to: formatDate(endDate, 'YYYY-MM-DD')
      }
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Removes a class activity from class
   *
   * @param classId class id to be sent
   * @param contentId content id to be sent
   * @returns {Promise}
   */
  removeClassActivity: function(classId, contentId) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/${classId}/contents/${contentId}`;
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

  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
