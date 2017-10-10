import Ember from 'ember';
import Bookmark from 'gooru-web/models/content/bookmark';
import { CONTENT_TYPES } from 'gooru-web/config/config';

export default Ember.Controller.extend({
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

  /**
   * @property {Controller} Application controller
   */
  appController: Ember.inject.controller('application'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
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
    },

    /**
     * Edit course action, when clicking Play at the course card
     * @param {Content/Course}
     */
    playIndependentContent: function({ title, id }) {
      let bookmark = Bookmark.create(Ember.getOwner(this).ownerInjection(), {
        title,
        contentId: id,
        contentType: CONTENT_TYPES.COURSE
      });
      return this.createBookmark(bookmark).then(() =>
        this.transitionToRoute('student.independent', id)
      );
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Profile information
   * @property {Profile} profile
   */
  profile: Ember.computed.alias('appController.profile'),

  /**
   * @property {Object[]} Filtered steps for take a tour
   */
  filteredSteps: Ember.computed('steps', function() {
    const role = this.get('profile.role');
    return this.get('steps').filter(step => !step.role || step.role === role);
  }),

  /**
   * @property {Object[]} options List of tab options to show
   */
  options: Ember.computed(function() {
    return [
      {
        name: 'featured-courses',
        text: this.get('i18n').t('library.featured-courses')
      },
      {
        name: 'partner-libraries',
        text: this.get('i18n').t('library.partner-libraries')
      }
    ];
  }),

  /**
   * @property {String} selected Current option selected
   */
  selected: 'featured-courses',

  /**
   * Send bookmark info to BE for creation
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
    const independentLearningURL = this.get('target.router').generate(
      'student-independent-learning'
    );
    const buttonText = this.get('i18n').t('common.take-me-there');
    this.get('notifications').success(
      `${successMsg} <a class="btn btn-success" href="${independentLearningURL}">${buttonText}</a>`
    );
  }
});
