import Ember from 'ember';
import CourseMapSerializer from 'gooru-web/serializers/map/course-map';
import CourseMapAdapter from 'gooru-web/adapters/map/course-map';

/**
 * @typedef {Object} CourseMapService
 */
export default Ember.Service.extend({
  /**
   * @property {CourseMapSerializer} courseMapSerializer
   */
  courseMapSerializer: null,

  /**
   * @property {CourseMapAdapter} courseMapAdapter
   */
  courseMapAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'courseMapSerializer',
      CourseMapSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'courseMapAdapter',
      CourseMapAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Gets the lesson infor for course map
   * @param {string} courseId - course the lesson belongs to
   * @param {string} unitId - unit the lesson belongs to
   * @param {string} lessonId - lesson ID to search for
   * @returns {Promise}
   */
  getLessonInfo: function(classId, courseId, unitId, lessonId) {
    const service = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      service
        .get('courseMapAdapter')
        .getLessonInfo(classId, courseId, unitId, lessonId)
        .then(
          response =>
            resolve(
              service.get('courseMapSerializer').normalizeLessonInfo(response)
            ),
          reject
        );
    });
  },

  /**
   * Creates a New Path based on the Context data.
   * @param {MapContext} context - is the context where the suggestion was presented
   * @param {MapSuggestion} suggestion - the suggestion. The suggested path
   * @returns {Ember.RSVP.Promise}
   */
  createNewPath: function(context, suggestion) {
    return this.get('courseMapAdapter').createNewPath(context, suggestion);
  }
});
