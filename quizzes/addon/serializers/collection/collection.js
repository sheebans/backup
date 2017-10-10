import Ember from 'ember';
import ResourceSerializer from 'quizzes-addon/serializers/resource/resource';
import CollectionModel from 'quizzes-addon/models/collection/collection';
import { ASSESSMENT_SHOW_VALUES } from 'quizzes-addon/config/quizzes-config';

/**
 * Serializer for Collection
 *
 * @typedef {Object} CollectionSerializer
 */
export default Ember.Object.extend({
  /**
   * @property {ResourceSerializer} resourceSerializer
   */
  resourceSerializer: null,

  session: Ember.inject.service('session'),

  init: function() {
    this._super(...arguments);
    this.set(
      'resourceSerializer',
      ResourceSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Normalize the Collection data into a Collection object
   * @param payload
   * @returns {Collection}
   */
  normalizeReadCollection: function(payload) {
    const serializer = this;
    return CollectionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.id,
      ownerId: payload.ownerId,
      isCollection: payload.isCollection,
      resources: serializer.normalizeResources(payload.resources),
      settings:
        !payload.isCollection && payload.metadata
          ? serializer.normalizeSettings(payload.metadata.setting || {})
          : null,
      title: payload.metadata ? payload.metadata.title : ''
    });
  },

  /**
   * Normalize the resources from a collection
   * @param payload
   * @returns {Resource}
   */
  normalizeResources: function(payload) {
    let resources = [];
    if (Ember.isArray(payload)) {
      resources = payload.map(resource =>
        this.get('resourceSerializer').normalizeReadResource(resource)
      );
      // Fix sequence value
      resources
        .sort((a, b) => a.get('sequence') - b.get('sequence'))
        .forEach((resource, i) => resource.set('sequence', i + 1));
    }
    return resources;
  },
  /**
   * Normalize the settings from a collection
   * @param setting
   * @returns {Object}
   */
  normalizeSettings: function(setting) {
    return {
      attempts: setting.attempts_allowed || -1,
      bidirectional: setting.bidirectional_play || false,
      showFeedback: setting.show_feedback || ASSESSMENT_SHOW_VALUES.SUMMARY,
      showKey: setting.show_key === ASSESSMENT_SHOW_VALUES.SUMMARY
    };
  }
});
