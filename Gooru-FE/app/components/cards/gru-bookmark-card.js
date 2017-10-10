import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import {
  CONTENT_TYPES,
  PLAYER_EVENT_SOURCE,
  ROLES
} from 'gooru-web/config/config';

export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {BookmarkService} Service to retrieve bookmark information
   */
  bookmarkService: Ember.inject.service('api-sdk/bookmark'),

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
    * When a bookmark title is clicked
    */
    click: function() {
      let bookmark = this.get('bookmark');
      if (bookmark.get('contentType') === CONTENT_TYPES.COURSE) {
        this.get('router').transitionTo(
          'student.independent',
          bookmark.get('contentId')
        );
      } else {
        let queryParams = {
          role: ROLES.STUDENT,
          source: PLAYER_EVENT_SOURCE.INDEPENDENT_ACTIVITY
        };
        this.get('router').transitionTo('player', bookmark.get('contentId'), {
          queryParams
        });
      }
    },

    /**
     * Remove bookmark
     */
    removeBookmark: function() {
      let component = this;
      var model = {
        content: component.get('bookmark'),
        deleteMethod: function() {
          return component
            .get('bookmarkService')
            .deleteBookmark(component.get('bookmark.id'));
        },
        type: component.get('bookmark.contentType'),
        callback: {
          success: function() {
            component.get('onDeleteBookmark')(component.get('bookmark'));
          }
        }
      };
      this.actions.showModal.call(
        this,
        'content.modals.gru-delete-bookmark',
        model
      );
    }
  },

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['cards gru-bookmark-card'],

  // Events
  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Bookmark} bookmark information
   */
  bookmark: null
});
