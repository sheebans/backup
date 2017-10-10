import Ember from 'ember';
import { DEFAULT_PAGE_SIZE } from 'gooru-web/config/config';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {libraryService} Library service object
   */
  libraryService: Ember.inject.service('api-sdk/library'),

  /**
   * @type {Controller} Application controller
   */
  appController: Ember.inject.controller('application'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    openContentPlayer: function(collection) {
      this.transitionToRoute('player', collection.id, {
        queryParams: { type: collection.get('collectionType') }
      });
    },

    showMoreResults: function() {
      this.showMoreResults();
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {number} library id
   */
  libraryId: null,

  /**
   * @property {Collection[]} collections
   */
  collections: null,

  /**
   * @property {Profile} Session Profile
   */
  sessionProfile: Ember.computed.alias('appController.profile'),

  /**
   * @property {*}
   */
  pagination: {
    page: 0,
    offset: 0,
    pageSize: DEFAULT_PAGE_SIZE
  },

  /**
   * @property {boolean}
   */
  showMoreResultsButton: Ember.computed('collections.[]', function() {
    return (
      this.get('collections.length') &&
      this.get('collections.length') % this.get('pagination.pageSize') === 0
    );
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Fetch more results from library content
   */
  showMoreResults: function() {
    const controller = this;
    const libraryId = this.get('libraryId');
    const pagination = this.get('pagination');
    pagination.page = pagination.page + 1;
    pagination.offset = pagination.page * pagination.pageSize;

    controller
      .get('libraryService')
      .fetchLibraryContent(libraryId, 'collection', pagination)
      .then(collections =>
        controller.set(
          'collections',
          controller
            .get('collections')
            .concat(
              controller.mapOwners(
                collections.libraryContent.collections,
                collections.libraryContent.ownerDetails
              )
            )
        )
      );
  },

  resetValues: function() {
    this.set('pagination', {
      page: 0,
      offset: 0,
      pageSize: DEFAULT_PAGE_SIZE
    });
  },

  /**
   * Map each collection to their corresponding owner
   * @param {Collection[]} collection list
   * @param {Owner[]} owner list
   */
  mapOwners: function(collections, owners) {
    let ownerMap = {};
    owners.forEach(function(owner) {
      ownerMap[owner.id] = owner;
    });
    let mappedCollections = collections.map(function(collection) {
      collection.owner = ownerMap[collection.ownerId];
      return collection;
    });
    return mappedCollections;
  }
});
