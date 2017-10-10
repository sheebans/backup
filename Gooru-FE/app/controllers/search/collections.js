import Ember from 'ember';
import BaseController from 'gooru-web/controllers/search/base-controller';

/**
 * Collection search controller
 *
 */
export default BaseController.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  collectionResults: Ember.computed.alias('searchResults'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Services

  // -------------------------------------------------------------------------
  // Properties

  // -------------------------------------------------------------------------
  // Methods

  doSearch: function(term, params, callback, resetPagination) {
    this.get('searchService')
      .searchCollections(term, params, resetPagination)
      .then(callback);
  }
});
