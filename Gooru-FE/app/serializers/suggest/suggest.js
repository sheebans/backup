import Ember from 'ember';
import SearchSerializer from 'gooru-web/serializers/search/search';

/**
 * Serializer to support Suggest functionality
 *
 * @typedef {Object} SuggestSerializer
 */
export default SearchSerializer.extend({
  /**
   * Normalize the suggest resources response
   *
   * @param payload is the endpoint response in JSON format
   * @returns {Resource[]}
   */
  normalizeSuggestResources: function(payload) {
    const serializer = this;
    if (Ember.isArray(payload.suggestResults)) {
      return payload.suggestResults.map(function(result) {
        return serializer.normalizeResource(result);
      });
    }
  }
});
