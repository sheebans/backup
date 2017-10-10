import Ember from 'ember';
import Lesson from 'gooru-web/models/content/lesson';
import LessonItem from 'gooru-web/models/content/lessonItem';
import { DEFAULT_IMAGES } from 'gooru-web/config/config';
import ConfigurationMixin from 'gooru-web/mixins/configuration';
import TaxonomySerializer from 'gooru-web/serializers/taxonomy/taxonomy';

/**
 * Serializer to support the Lesson CRUD operations
 *
 * @typedef {Object} LessonSerializer
 */
export default Ember.Object.extend(ConfigurationMixin, {
  session: Ember.inject.service('session'),

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'taxonomySerializer',
      TaxonomySerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Serialize a Content/Lesson object into a JSON representation required by the Create Lesson endpoint
   *
   * @param lessonModel - The lesson model to be serialized
   * @returns {Object} JSON Object representation of the lesson model
   */
  serializeCreateLesson: function(lessonModel) {
    var lessonData = this.get('serializeUpdateLesson')(lessonModel);
    return lessonData;
  },

  /**
   * Serialize a Content/Lesson object into a JSON representation required by the Update Lesson endpoint
   *
   * @param lessonModel - The lesson model to be serialized
   * @returns {Object} JSON Object representation of the lesson model
   */
  serializeUpdateLesson: function(lessonModel) {
    return {
      title: lessonModel.get('title'),
      taxonomy: null // TODO: pending
    };
  },

  /**
   * Normalize a lesson response
   * @param lessonData - The endpoint response in JSON format
   * @returns {Content/Lesson} lesson model
   */
  normalizeLesson: function(lessonData) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const appRootPath = this.get('appRootPath'); //configuration appRootPath
    return Lesson.create(Ember.getOwner(this).ownerInjection(), {
      children: (function() {
        var lessonItems = [];

        if (lessonData.collection_summary) {
          lessonItems = lessonData.collection_summary.map(function(
            lessonItemData
          ) {
            const lessonItem = LessonItem.create({
              id: lessonItemData.id,
              format: lessonItemData.format,
              url: lessonItemData.url,
              questionCount: lessonItemData.question_count || 0,
              resourceCount: lessonItemData.resource_count || 0,
              openEndedQuestionCount: lessonItemData.oe_question_count || 0,
              sequence: lessonItemData.sequence_id,
              title: lessonItemData.title
            });

            const defaultImage = lessonItem.get('isCollection')
              ? appRootPath + DEFAULT_IMAGES.COLLECTION
              : appRootPath + DEFAULT_IMAGES.ASSESSMENT;
            const thumbnailUrl = lessonItemData.thumbnail
              ? basePath + lessonItemData.thumbnail
              : defaultImage;
            lessonItem.set('thumbnailUrl', thumbnailUrl);

            return lessonItem;
          });
        }
        return Ember.A(lessonItems);
      })(),
      id: lessonData.lesson_id,
      sequence: lessonData.sequence_id,
      title: lessonData.title,
      taxonomy: serializer
        .get('taxonomySerializer')
        .normalizeTaxonomyObject(lessonData.taxonomy)
    });
  },

  /**
   * Serialize reorder lesson
   * @param {string[]} collectionIds
   */
  serializeReorderLesson: function(collectionIds) {
    const values = collectionIds.map((id, index) => ({
      id,
      sequence_id: index + 1
    }));
    return {
      order: values
    };
  }
});
