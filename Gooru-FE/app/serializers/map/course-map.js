import Ember from 'ember';
import LessonSerializer from 'gooru-web/serializers/content/lesson';
import CollectionSerializer from 'gooru-web/serializers/content/collection';
import AssessmentSerializer from 'gooru-web/serializers/content/assessment';
import AlternatePathSerializer from 'gooru-web/serializers/content/alternate-path';
import { ASSESSMENT_SUB_TYPES } from 'gooru-web/config/config';

/**
 * Serializer to support the Course Map operations
 *
 * @typedef {Object} CourseMapSerializer
 */
export default Ember.Object.extend({
  /**
   * @property {LessonSerializer} lessonSerializer
   */
  lessonSerializer: null,

  /**
   * @property {AssessmentSerializer} assessmentSerializer
   */
  assessmentSerializer: null,

  /**
   * @property {CollectionSerializer} collectionSerializer
   */
  collectionSerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'lessonSerializer',
      LessonSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'assessmentSerializer',
      AssessmentSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'collectionSerializer',
      CollectionSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'alternatePathSerializer',
      AlternatePathSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Normalize a lesson info response
   * @param data - The endpoint response in JSON format
   * @returns {Object} lesson and alternate paths
   */
  normalizeLessonInfo: function(data) {
    var serializer = this;
    let alternatePaths = this.normalizeAlternatePaths(data.alternate_paths);
    let lesson = this.get('lessonSerializer').normalizeLesson(data.course_path);
    let alternatePathsMap = alternatePaths.reduce(
      (mapping, path) => {
        var subType =
          path.get('collectionSubType') || path.get('targetContentType');
        if (subType) {
          mapping[subType].push(path);
        }
        return mapping;
      },
      {
        [ASSESSMENT_SUB_TYPES.BACKFILL]: [],
        [ASSESSMENT_SUB_TYPES.BENCHMARK]: [],
        [ASSESSMENT_SUB_TYPES.PRE_TEST]: [],
        [ASSESSMENT_SUB_TYPES.POST_TEST]: [],
        [ASSESSMENT_SUB_TYPES.RESOURCE]: []
      }
    );

    alternatePathsMap[ASSESSMENT_SUB_TYPES.RESOURCE].forEach(function(
      resourceData
    ) {
      var assessmentId = resourceData.contextCollectionId;
      var lessonChildren = lesson.get('children');
      if (assessmentId) {
        var assessmentIndex = lessonChildren.findIndex(
          child => child.id === assessmentId
        );
        var resource = serializer
          .get('alternatePathSerializer')
          .normalizeReadResource(resourceData);
        lessonChildren.splice(assessmentIndex + 1, 0, resource);
      }
    });

    lesson
      .get('children')
      .unshift(...alternatePathsMap[ASSESSMENT_SUB_TYPES.BACKFILL]);
    lesson
      .get('children')
      .unshift(...alternatePathsMap[ASSESSMENT_SUB_TYPES.PRE_TEST]);
    lesson
      .get('children')
      .push(...alternatePathsMap[ASSESSMENT_SUB_TYPES.POST_TEST]);
    lesson
      .get('children')
      .push(...alternatePathsMap[ASSESSMENT_SUB_TYPES.BENCHMARK]);
    return lesson;
  },

  /**
   * Normalize the alternate paths for a lesson
   * @param data - The alternate paths in JSON format
   * @returns {Collection[]} alternate paths list
   */
  normalizeAlternatePaths: function(data) {
    return Ember.isArray(data)
      ? data.map(path => {
        if (path.target_content_type === 'resource') {
          return this.get('alternatePathSerializer').normalizeAlternatePath(
            path
          );
        } else {
          let normalizedPath =
              path.target_content_type === 'collection'
                ? this.get('collectionSerializer').normalizeReadCollection(path)
                : this.get('assessmentSerializer').normalizeReadAssessment(
                  path
                );
          if (!normalizedPath.get('collectionSubType')) {
            normalizedPath.set(
              'collectionSubType',
              ASSESSMENT_SUB_TYPES.BACKFILL
            );
          }
          return normalizedPath;
        }
      })
      : [];
  }
});
