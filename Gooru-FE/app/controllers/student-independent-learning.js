import Ember from 'ember';
import { DEFAULT_SEARCH_PAGE_SIZE } from 'gooru-web/config/config';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  applicationController: Ember.inject.controller('application'),

  /**
   * @property {Service} Session service
   */
  session: Ember.inject.service('session'),

  /**
   * @type {BookmarkService} Service to retrieve bookmark information
   */
  bookmarkService: Ember.inject.service('api-sdk/bookmark'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * show more bookmark results
     */
    showMoreResults: function() {
      this.showMoreResults();
    },

    /**
     * Remove a bookmark from a list of bookmarks
     */
    removeBookmark: function(bookmark) {
      this.get('bookmarks').removeObject(bookmark);
    },

    /**
     * Triggered when the expand/collapse arrows are selected.
     */
    togglePanel: function() {
      this.set('toggleState', !this.get('toggleState'));
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    let localStorage = this.get('applicationController').getLocalStorage();
    const userId = this.get('session.userId');
    const localStorageLogins = `${userId}_logins`;
    let loginCount = localStorage.getItem(localStorageLogins);
    if (loginCount) {
      this.set('loginCount', +loginCount);
    }
  },

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    var item = this.get('menuItem');
    this.selectItem(item);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Class[]}
   */
  activeClasses: Ember.computed(
    'applicationController.myClasses.classes.[]',
    function() {
      return this.get(
        'applicationController.myClasses'
      ).getStudentActiveClasses(this.get('profile.id'));
    }
  ),

  /**
   * @property {Profile}
   */
  profile: Ember.computed.alias('applicationController.profile'),

  /**
   * @property {Number} Total of joined classes
   */
  totalJoinedClasses: Ember.computed.alias('activeClasses.length'),

  /*
   * @property {Array[]} - featuredCourses
   */
  featuredCourses: null,

  /**
   * @property {Number} - Amount of logins by the user
   */
  loginCount: null,

  /*
   * @property {Array[]} - bookmarks
   */
  bookmarks: null,

  /**
   * @property {Number} firstRowLimit of bookmarks in the planel
   */
  firstRowLimit: 9,

  /**
   * @property {boolean}
   */
  showExpandIcon: Ember.computed('bookmarks.[]', function() {
    return (
      this.get('bookmarks.length') &&
      this.get('bookmarks.length') > this.get('firstRowLimit')
    );
  }),

  /**
   * @property {*}
   */
  pagination: null,

  /**
   * Shows the rest of bookmarks
   * @property {Boolean} toggleState
   */
  toggleState: true,

  /**
   * The menuItem selected
   * @property {String}
   */
  menuItem: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Selected the menu item
   * @param {string} item
   */
  selectMenuItem: function(item) {
    this.set('menuItem', item);
  },

  /**
   * show more bookmark results
   */
  showMoreResults: function() {
    const controller = this;
    const pagination = this.get('pagination');

    pagination.offset = pagination.offset + pagination.pageSize;
    pagination.pageSize = DEFAULT_SEARCH_PAGE_SIZE;
    this.set('pagination', pagination);
    controller
      .get('bookmarkService')
      .fetchBookmarks(pagination, false)
      .then(function(bookmarkResults) {
        controller.get('bookmarks').pushObjects(bookmarkResults);
      });
  }
});
