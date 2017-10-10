import Ember from 'ember';
import CollectionPerformanceSummary from 'gooru-web/models/performance/collection-performance-summary';

/**
 * Serializer to support the CollectionPerformanceSummary CRUD operations
 *
 * @typedef {Object} CollectionPerformanceSummary
 */
export default Ember.Object.extend({
  /**
   * Normalize an array of CollectionPerformanceSummary
   *
   * @param payload endpoint response format in JSON format
   * @returns {CollectionPerformanceSummary[]}
   */
  normalizeAllCollectionPerformanceSummary: function(payload) {
    const serializer = this;
    if (payload && Ember.isArray(payload.usageData)) {
      return payload.usageData.map(function(collectionPerformanceSummary) {
        return serializer.normalizeCollectionPerformanceSummary(
          collectionPerformanceSummary
        );
      });
    } else {
      return [];
    }
  },

  /**
   * Normalize a CollectionPerformanceSummary
   * @param {*} data
   * @return {CollectionPerformanceSummary}
   */
  normalizeCollectionPerformanceSummary: function(data) {
    return CollectionPerformanceSummary.create({
      id: data.collectionId || data.collection_id,
      collectionId: data.collectionId || data.collection_id,
      timeSpent: data.timeSpent,
      attempts: data.attempts,
      views: data.views,
      score: data.scoreInPercentage,
      status: data.status
    });
  }
});
