import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import Bookmark from 'gooru-web/models/content/bookmark';
import { DEFAULT_PAGE_SIZE, CONTENT_TYPES } from 'gooru-web/config/config';

export default Ember.Route.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {libraryService} Library service object
   */
  libraryService: Ember.inject.service('api-sdk/library'),

  /**
   * @requires service:api-sdk/bookmark
   */
  bookmarkService: Ember.inject.service('api-sdk/bookmark'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Edit course action, when clicking Play at the course card
     * @param {Course}
     */
    playIndependentContent: function({ title, id }) {
      let bookmark = Bookmark.create(Ember.getOwner(this).ownerInjection(), {
        title,
        contentId: id,
        contentType: CONTENT_TYPES.COURSE
      });
      return this.createBookmark(bookmark).then(() => {
        this.transitionTo('student.independent', id);
      });
    },

    /**
     * Remix course action, when clicking remix at the course card
     * @param {Content/Course}
     */
    remixCourse: function(course) {
      var remixModel = {
        content: course
      };
      this.send('showModal', 'content.modals.gru-course-remix', remixModel);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Create a bookmark
   * @param bookmark
   */
  createBookmark: function(bookmark) {
    return this.get('bookmarkService').createBookmark(bookmark);
  },

  model: function() {
    const libraryId = this.paramsFor('partner-library').id;
    const pagination = {
      pageSize: DEFAULT_PAGE_SIZE
    };
    return this.get('libraryService')
      .fetchLibraryContent(libraryId, 'course', pagination)
      .then(function(courses) {
        return Ember.RSVP.hash({
          libraryId,
          courses: courses.libraryContent.courses,
          owners: courses.libraryContent.ownerDetails
        });
      });
  },

  setupController: function(controller, model) {
    controller.set('libraryId', model.libraryId);
    controller.set(
      'courses',
      controller.mapOwners(model.courses, model.owners)
    );
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
