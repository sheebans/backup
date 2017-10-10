import Ember from 'ember';
import { DEFAULT_SEARCH_PAGE_SIZE } from 'gooru-web/config/config';

/**
 * Search Base Controller
 *
 */
export default Ember.Controller.extend({
  queryParams: ['selectedOptionTypes'],

  // -------------------------------------------------------------------------
  // Dependencies

  searchController: Ember.inject.controller('search'),

  appController: Ember.inject.controller('application'),

  searchService: Ember.inject.service('api-sdk/search'),

  // -------------------------------------------------------------------------
  // Attributes

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    showMoreResults: function() {
      this.showMoreResults();
    },

    /**
     * Remove a tag from the selected tag list
     * the browse selector.
     * @function actions:removeTag
     * @param {TaxonomyTag} taxonomyTag
     */
    removeTag: function(taxonomyTag) {
      var selectedTags = this.get('selectedTags');
      selectedTags.removeObject(taxonomyTag);
      var taxonomyMap = selectedTags.map(function(taxonomyTagData) {
        return taxonomyTagData.get('data.id');
      });
      this.set('taxonomies', taxonomyMap);
    },

    /**
     * Action triggered to selectMenuOption
     */
    selectMenuOption: function(option) {
      const controller = this;
      const term = controller.get('term');

      var selectedOptionTypes = controller.get('selectedOptionTypes');
      if (selectedOptionTypes.includes(option)) {
        selectedOptionTypes.removeObject(option);
      } else {
        selectedOptionTypes.pushObject(option);
      }

      const params = controller.getSearchParams();
      controller.resetPagination();
      controller.doSearch(
        term,
        params,
        function(searchResults) {
          controller.set('searchResults', searchResults);
        },
        true
      );
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Services

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Profile information
   * @property {Profile} profile
   */
  profile: Ember.computed.alias('appController.profile'),

  /**
   * Types of question selected
   *  @property {array} selectedOptionTypes
   *
   */
  selectedOptionTypes: Ember.A([]),

  /**
   * @property {string} term filter
   */
  term: Ember.computed.alias('searchController.term'),

  /**
   * These are the search results
   * @property {[]}
   */
  searchResults: null,

  /**
   * @property {boolean}
   */
  showMoreResultsButton: Ember.computed('searchResults.[]', function() {
    return (
      this.get('searchResults.length') &&
      this.get('searchResults.length') % this.get('pagination.pageSize') === 0
    );
  }),

  /**
   * @property {*}
   */
  pagination: {
    page: 1,
    pageSize: DEFAULT_SEARCH_PAGE_SIZE
  },

  /**
   * @property {selectedTags[]} selected tags
   */
  selectedTags: Ember.computed.alias('searchController.selectedTags'),

  /**
   * @property {string[]} standards
   */
  taxonomies: Ember.computed.alias('searchController.taxonomies'),

  // -------------------------------------------------------------------------
  // Methods

  showMoreResults: function() {
    const controller = this;
    const pagination = this.get('pagination');
    const params = controller.getSearchParams();

    pagination.page = pagination.page + 1;
    controller.doSearch(
      controller.get('term'),
      params,
      function(searchResults) {
        controller.get('searchResults').pushObjects(searchResults);
      },
      false
    );
  },

  getSearchParams: function() {
    const controller = this;
    const pagination = controller.get('pagination');
    return {
      formats: controller.get('selectedOptionTypes'),
      page: pagination.page,
      pageSize: pagination.pageSize,
      taxonomies: controller.get('taxonomies')
    };
  },

  resetValues: function() {
    this.resetPagination();
  },

  /**
   * Resets the pagination values
   */
  resetPagination: function() {
    this.set('pagination', {
      page: 1,
      pageSize: DEFAULT_SEARCH_PAGE_SIZE
    });
  },

  setInvalidSearchTerm: function(value) {
    this.get('appController').setInvalidSearchTerm(value);
  },

  /**
   * This method must be overriden to execute the correct search.
   * The required parameter are term, params and callback function
   *
   * @returns {[]}
   */
  doSearch: function() {
    return Ember.A([]);
  }
});
