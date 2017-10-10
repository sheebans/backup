import Ember from 'ember';
import ClassActivity from 'gooru-web/models/content/class-activity';
import Collection from 'gooru-web/models/content/collection';
import Assessment from 'gooru-web/models/content/assessment';
import { parseDate } from 'gooru-web/utils/utils';

/**
 * Serializer to support the Class Activity operations
 *
 * @typedef {Object} ClassActivitySerializer
 */
export default Ember.Object.extend({
  /**
   * Normalizes class activities/contents
   *
   * @param payload endpoint response format in JSON format
   * @returns {Goal[]}
   */
  normalizeFindClassActivities: function(payload) {
    const serializer = this;
    if (
      payload &&
      payload.class_contents &&
      Ember.isArray(payload.class_contents)
    ) {
      return payload.class_contents.map(function(classActivity) {
        return serializer.normalizeClassActivity(classActivity);
      });
    } else {
      return [];
    }
  },

  /**
   * Normalize a class activity
   * @param {*} data
   * @return {Goal}
   */
  normalizeClassActivity: function(data) {
    const serializer = this;
    const content = serializer.normalizeClassActivityContent(data);
    return ClassActivity.create(Ember.getOwner(this).ownerInjection(), {
      id: data.id,
      date: data.activation_date
        ? parseDate(data.activation_date, 'YYYY-MM-DD')
        : null,
      context: {
        courseId: data.ctx_course_id,
        unitId: data.ctx_unit_id,
        lessonId: data.ctx_lesson_id,
        collectionId: data.ctx_collection_id
      },
      collection: content
    });
  },

  /**
   * Normalize a class activity content
   * @param {*} data
   * @return {Goal}
   */
  normalizeClassActivityContent: function(data) {
    const contentType = data.content_type;
    let content = null;
    if (contentType === 'assessment') {
      content = Assessment.create({
        id: data.content_id,
        title: data.title,
        resourceCount: data.resource_count,
        questionCount: data.question_count
      });
    }

    if (contentType === 'collection') {
      content = Collection.create({
        id: data.content_id,
        title: data.title,
        resourceCount: data.resource_count,
        questionCount: data.question_count
      });
    }

    //TODO normalize resources and questions
    return content;
  }
});
