import Ember from 'ember';
import BaseController from 'gooru-web/controllers/search/base-controller';

/**
 * Resources search controller
 *
 */
export default BaseController.extend({
  // -------------------------------------------------------------------------
  // Attributes

  resourceResults: Ember.computed.alias('searchResults'),

  // -------------------------------------------------------------------------
  // Methods

  doSearch: function(term, params, callback, resetPagination) {
    this.get('searchService')
      .searchResources(term, params, resetPagination)
      .then(callback);
  }
});
