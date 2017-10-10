import Ember from 'ember';
import BaseController from 'gooru-web/controllers/search/base-controller';

/**
 * Assessments Controller
 *
 */
export default BaseController.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  assessmentResults: Ember.computed.alias('searchResults'),

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
      .searchAssessments(term, params, resetPagination)
      .then(callback);
  }
});
