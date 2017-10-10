import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import Bookmark from 'gooru-web/models/content/bookmark';
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  PLAYER_EVENT_SOURCE,
  CONTENT_TYPES
} from 'gooru-web/config/config';

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
     * Edit course action, when clicking Play at the assessment card
     * @param {Content}
     */
    playIndependentContent: function({ title, id }) {
      let bookmark = Bookmark.create(Ember.getOwner(this).ownerInjection(), {
        title,
        contentId: id,
        contentType: CONTENT_TYPES.ASSESSMENT
      });
      return this.createBookmark(bookmark).then(() => {
        let queryParams = {
          role: ROLES.STUDENT,
          source: PLAYER_EVENT_SOURCE.INDEPENDENT_ACTIVITY
        };
        this.transitionTo('player', id, { queryParams });
      });
    },

    /**
     * On card remix assessment button click
     * @param {Assessment} assessment
     */
    remixAssessment: function(assessment) {
      var remixModel = {
        content: assessment
      };
      this.send('showModal', 'content.modals.gru-assessment-remix', remixModel);
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
      .fetchLibraryContent(libraryId, 'assessment', pagination)
      .then(function(assessments) {
        return Ember.RSVP.hash({
          libraryId,
          assessments: assessments.libraryContent.assessments,
          owners: assessments.libraryContent.ownerDetails
        });
      });
  },

  setupController: function(controller, model) {
    controller.set('libraryId', model.libraryId);
    controller.set(
      'assessments',
      controller.mapOwners(model.assessments, model.owners)
    );
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
