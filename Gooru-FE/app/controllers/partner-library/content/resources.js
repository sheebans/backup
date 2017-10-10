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
   * @property {Resource[]} resources
   */
  resources: null,

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
  showMoreResultsButton: Ember.computed('resources.[]', function() {
    return (
      this.get('resources.length') &&
      this.get('resources.length') % this.get('pagination.pageSize') === 0
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
      .fetchLibraryContent(libraryId, 'resource', pagination)
      .then(resources =>
        controller.set(
          'resources',
          controller
            .get('resources')
            .concat(
              controller.mapOwners(
                resources.libraryContent.resources,
                resources.libraryContent.ownerDetails
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
   * Map each resource to their corresponding owner
   * @param {Resource[]} resource list
   * @param {Owner[]} owner list
   */
  mapOwners: function(resources, owners) {
    let ownerMap = {};
    owners.forEach(function(owner) {
      ownerMap[owner.id] = owner;
    });
    let mappedResources = resources.map(function(resource) {
      resource.owner = ownerMap[resource.owner];
      return resource;
    });
    return mappedResources;
  }
});
