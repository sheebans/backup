import Ember from 'ember';
import AlternatePathModel from 'gooru-web/models/content/alternate-path';
import ResourceModel from 'gooru-web/models/content/resource';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

/**
 * Serializer for Alternate Path data
 *
 * @typedef {Object} AlternatePathSerializer
 */
export default Ember.Object.extend(ConfigurationMixin, {
  /**
   * Normalize the Alternate Path data
   * @param payload
   * @returns {AlternatePathModel}
   */
  normalizeAlternatePath: function(payload) {
    const serializer = this;
    return AlternatePathModel.create(
      Ember.getOwner(serializer).ownerInjection(),
      {
        pathId: payload.id,
        title: payload.title,
        thumbnail: payload.thumbnail,
        contextClassId: payload.ctx_class_id,
        contextCourseId: payload.ctx_course_id,
        contextUnitId: payload.ctx_unit_id,
        contextLessonId: payload.ctx_lesson_id,
        contextCollectionId: payload.ctx_collection_id,
        targetCourseId: payload.target_course_id,
        targetUnitId: payload.target_unit_id,
        targetLessonId: payload.target_lesson_id,
        targetCollectionId: payload.target_collection_id,
        targetResourceId: payload.target_resource_id,
        targetContentType: payload.target_content_type,
        targetContentSubtype: payload.target_content_subtype,
        questionCount: payload.question_count,
        openEndedQuestionCount: payload.oe_question_count,
        resourceCount: payload.resource_count
      }
    );
  },

  /**
   * Normalize the resource data from alternate path into a Resource object
   * @param resourceData
   * @returns {Resource}
   */
  normalizeReadResource: function(resourceData) {
    const serializer = this;
    const format = ResourceModel.normalizeResourceFormat(
      resourceData.targetContentSubtype
    );
    const resource = ResourceModel.create(
      Ember.getOwner(serializer).ownerInjection(),
      {
        id: resourceData.targetResourceId,
        title: resourceData.title,
        format,
        assessmentId: resourceData.contextCollectionId,
        classId: resourceData.contextClassId,
        courseId: resourceData.contextCourseId,
        unitId: resourceData.contextUnitId,
        lessonId: resourceData.contextLessonId,
        pathId: resourceData.pathId
      }
    );
    return resource;
  }
});
