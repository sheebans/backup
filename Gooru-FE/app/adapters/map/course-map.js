import Ember from 'ember';
import ApplicationAdapter from 'gooru-web/adapters/application';

/**
 * Adapter to support the course map operations
 *
 * @typedef {Object} CourseMapAdapter
 */
export default ApplicationAdapter.extend({
  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service('session'),

  /**
   * @type {String}} base url for course map API endpoints
   */
  namespace: '/api/nucleus/v2/course-map',

  /**
   * Gets the lesson infor for course map
   * @param {string} courseId - course the lesson belongs to
   * @param {string} unitId - unit the lesson belongs to
   * @param {string} lessonId - lesson ID to search for
   * @returns {Promise}
   */
  getLessonInfo: function(classId, courseId, unitId, lessonId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${courseId}/units/${unitId}/lessons/${lessonId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.get('headers'),
      data: { classId }
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Creates a New Path based on the Context data.
   * @param {MapContext} context - is the context where the suggestion was presented
   * @param {MapSuggestion} suggestion - the suggestion. The suggested path
   * @returns {Ember.RSVP.Promise}
   */
  createNewPath: function(context, suggestion) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/paths`;
    let isBackfillOrResource =
      suggestion.get('isBackFill') || suggestion.get('isResource');
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.get('headers'),
      data: JSON.stringify({
        ctx_course_id: context.get('courseId'),
        ctx_class_id: context.get('classId'),
        ctx_unit_id: context.get('unitId'),
        ctx_lesson_id: context.get('lessonId'),
        ctx_collection_id: context.get('collectionId'),
        parent_path_id: context.get('pathId') || undefined,
        //same as the current context
        //TODO: we need more clarification about when to use these values, for now are not needed
        //      'target_course_id': context.get('courseId'),
        //      'target_unit_id': context.get('unitId'),
        //      'target_lesson_id': context.get('lessonId'),
        //suggestion information
        target_content_type: suggestion.get('type'),
        target_content_subtype: isBackfillOrResource
          ? null
          : suggestion.get('subType'),
        target_collection_id: suggestion.get('isResource')
          ? null
          : suggestion.get('id'),
        target_resource_id: suggestion.get('isResource')
          ? suggestion.get('id')
          : null
      })
    };
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$
        .ajax(url, options)
        .then(function(responseData, textStatus, request) {
          resolve(request.getResponseHeader('location'));
        }, reject);
    });
  }
});
