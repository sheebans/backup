import Ember from 'ember';
import MapContext from 'gooru-web/models/map/map-context';
import MapContent from 'gooru-web/models/map/content';
import MapSuggestion from 'gooru-web/models/map/map-suggestion';
import ResourceModel from 'gooru-web/models/content/resource';
import ConfigurationMixin from 'gooru-web/mixins/configuration';
import {
  ASSESSMENT_SUB_TYPES,
  CONTENT_TYPES,
  DEFAULT_IMAGES
} from 'gooru-web/config/config';

/**
 * Serializer to support the navigate map operations
 *
 * @typedef {Object} NavigateMapSerializer
 */
export default Ember.Object.extend(ConfigurationMixin, {
  /**
   * @property {Service} session
   */
  session: Ember.inject.service('session'),

  /**
   * Serialize a MapContext object into a JSON representation
   *
   * @param {MapContext} model The model to be serialized
   * @returns {Object} JSON Object representation of the model
   */
  serializeMapContext: function(model) {
    return {
      course_id: model.get('courseId'),
      class_id: model.get('classId'),
      unit_id: model.get('unitId'),
      lesson_id: model.get('lessonId'),
      collection_id: model.get('collectionId'),
      collection_type: model.get('collectionType'),
      collection_subtype: model.get('collectionSubType'),
      current_item_id: model.get('itemId'),
      current_item_type: model.get('itemType'),
      current_item_subtype: model.get('itemSubType'),
      state: model.get('status'),
      path_id: model.get('pathId') || 0,
      score_percent: model.get('score')
    };
  },

  /**
   * Normalize an array of goals
   *
   * @param payload endpoint response format in JSON format
   * @returns {Goal[]}
   */
  normalizeMapSuggestions: function(payload = []) {
    const serializer = this;
    let suggestions = [];
    if (payload && Ember.isArray(payload)) {
      suggestions = payload.map(suggestion =>
        serializer.normalizeMapSuggestion(suggestion)
      );
    }

    return suggestions;
  },

  /**
   * Normalize a map context
   * @param {*} data
   * @return {MapContext}
   */
  normalizeMapContext: function(data) {
    return MapContext.create(Ember.getOwner(this).ownerInjection(), {
      courseId: data.course_id,
      classId: data.class_id,
      unitId: data.unit_id,
      lessonId: data.lesson_id,
      collectionId: data.collection_id,
      collectionType: data.collection_type,
      collectionSubType: data.collection_subtype,
      itemId: data.current_item_id,
      itemType: data.current_item_type,
      itemSubType: data.current_item_subtype,
      status: data.state,
      pathId: data.path_id,
      score: data.score_percent
    });
  },

  /**
   * Normalize a map content
   * @param {*} data
   * @return {MapContext}
   */
  normalizeMapContent: function(data) {
    const basePath = this.get('session.cdnUrls.content');
    const appRootPath = this.get('appRootPath'); //configuration appRootPath
    const thumbnailUrl = data.thumbnail
      ? basePath + data.thumbnail
      : appRootPath + DEFAULT_IMAGES.ASSESSMENT;
    return MapContent.create(Ember.getOwner(this).ownerInjection(), {
      id: data.id,
      title: data.title,
      description: data.learning_objective,
      url: data.url,
      thumbnail: thumbnailUrl
    });
  },

  /**
   * Normalize a map suggestion
   * @param {*} data
   * @return {MapSuggestion}
   */
  normalizeMapSuggestion: function(data) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const appRootPath = this.get('appRootPath'); //configuration appRootPath
    let subType =
      data.format === CONTENT_TYPES.RESOURCE
        ? ASSESSMENT_SUB_TYPES.RESOURCE
        : data.subformat || ASSESSMENT_SUB_TYPES.BACKFILL;
    return MapSuggestion.create(Ember.getOwner(this).ownerInjection(), {
      id: data.id,
      title: data.title,
      type: data.format,
      questionCount: data.questionCount,
      resourceCount: data.resourceCount,
      thumbnail: data.thumbnail
        ? basePath + data.thumbnail
        : appRootPath + DEFAULT_IMAGES.COLLECTION,
      resourceFormat: ResourceModel.normalizeResourceFormat(data.subformat),
      subType
    });
  }
});
