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
  // Properties

  /**
   * @property {number} library id
   */
  libraryId: null,

  /**
   * @property {Content/Course[]} courses
   */
  courses: null,

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
  showMoreResultsButton: Ember.computed('courses.[]', function() {
    return (
      this.get('courses.length') &&
      this.get('courses.length') % this.get('pagination.pageSize') === 0
    );
  }),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    showMoreResults: function() {
      this.showMoreResults();
    }
  },

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
      .fetchLibraryContent(libraryId, 'course', pagination)
      .then(courses =>
        controller.set(
          'courses',
          controller
            .get('courses')
            .concat(
              controller.mapOwners(
                courses.libraryContent.courses,
                courses.libraryContent.ownerDetails
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
   * Map each course to their corresponding owner
   * @param {Course[]} course list
   * @param {Owner[]} owner list
   */
  mapOwners: function(courses, owners) {
    let ownerMap = {};
    owners.forEach(function(owner) {
      ownerMap[owner.id] = owner;
    });
    let mappedCourses = courses.map(function(course) {
      course.owner = ownerMap[course.ownerId];
      return course;
    });
    return mappedCourses;
  }
});
