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
    openContentPlayer: function(assessment) {
      if (assessment.get('isExternalAssessment')) {
        window.open(assessment.get('url')); //TODO url?
      } else {
        this.transitionToRoute('player', assessment.get('id'), {
          queryParams: { type: assessment.get('collectionType') }
        });
      }
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
   * @property {Assessment[]} assessments
   */
  assessments: null,

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
  showMoreResultsButton: Ember.computed('assessments.[]', function() {
    return (
      this.get('assessments.length') &&
      this.get('assessments.length') % this.get('pagination.pageSize') === 0
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
      .fetchLibraryContent(libraryId, 'assessment', pagination)
      .then(assessments =>
        controller.set(
          'assessments',
          controller
            .get('assessments')
            .concat(
              controller.mapOwners(
                assessments.libraryContent.assessments,
                assessments.libraryContent.ownerDetails
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
   * Map each assessment to their corresponding owner
   * @param {Assessment[]} assessment list
   * @param {Owner[]} owner list
   */
  mapOwners: function(assessments, owners) {
    let ownerMap = {};
    owners.forEach(function(owner) {
      ownerMap[owner.id] = owner;
    });
    let mappedAssessments = assessments.map(function(assessment) {
      assessment.owner = ownerMap[assessment.ownerId];
      return assessment;
    });
    return mappedAssessments;
  }
});
