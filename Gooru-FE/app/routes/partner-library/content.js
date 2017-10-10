import Ember from 'ember';
import Bookmark from 'gooru-web/models/content/bookmark';
import {
  CONTENT_TYPES,
  ROLES,
  PLAYER_EVENT_SOURCE
} from 'gooru-web/config/config';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:api-sdk/bookmark
   */
  bookmarkService: Ember.inject.service('api-sdk/bookmark'),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Create a bookmark
   * @param bookmark
   */
  createBookmark: function(bookmark) {
    return this.get('bookmarkService').createBookmark(bookmark);
  },

  /**
   * Show notification on bookmark success
   * @param bookmark
   * @param showType
   */
  notifyBookmarkSuccess: function(bookmark, showType) {
    this.get('notifications').setOptions({
      positionClass: 'toast-top-full-width',
      toastClass: 'gooru-toast',
      timeOut: 10000
    });
    const successMsg = showType
      ? this.get('i18n').t('common.bookmarked-content-success', {
        contentType: bookmark.get('contentType')
      })
      : this.get('i18n').t('common.bookmarked-success');
    const independentLearningURL = this.get('router').generate(
      'student-independent-learning'
    );
    const buttonText = this.get('i18n').t('common.take-me-there');
    this.get('notifications').success(
      `${successMsg} <a class="btn btn-success" href="${independentLearningURL}">${buttonText}</a>`
    );
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Edit course action, when clicking Play at the course card
     * @param {Content/Course}
     */
    playIndependentContent: function({ title, id, collectionType }) {
      let isCourse = !collectionType;
      let bookmark = Bookmark.create(Ember.getOwner(this).ownerInjection(), {
        title,
        contentId: id,
        contentType: isCourse ? CONTENT_TYPES.COURSE : collectionType
      });
      return this.createBookmark(bookmark).then(() => {
        if (isCourse) {
          this.transitionTo('student.independent', id);
        } else {
          let queryParams = {
            role: ROLES.STUDENT,
            source: PLAYER_EVENT_SOURCE.INDEPENDENT_ACTIVITY
          };
          this.transitionTo('player', id, { queryParams });
        }
      });
    },

    /**
     * Action triggered to bookmark a collection or assessment
     * @param {Collection/Assessment} content
     */
    onBookmarkContent: function({ title, id, collectionType }, showType) {
      let bookmark = Bookmark.create(Ember.getOwner(this).ownerInjection(), {
        title,
        contentId: id,
        contentType: collectionType
      });
      this.createBookmark(bookmark).then(() =>
        this.notifyBookmarkSuccess(bookmark, showType)
      );
    },

    /**
     * Action triggered to bookmark a course
     * @param {Course} course
     */
    onBookmarkCourse: function({ title, id }, showType) {
      let bookmark = Bookmark.create(Ember.getOwner(this).ownerInjection(), {
        title,
        contentId: id,
        contentType: CONTENT_TYPES.COURSE
      });
      this.createBookmark(bookmark).then(() =>
        this.notifyBookmarkSuccess(bookmark, showType)
      );
    }
  }
});
