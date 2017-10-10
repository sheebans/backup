import Ember from 'ember';
import ContentEditMixin from 'gooru-web/mixins/content/edit';
import ModalMixin from 'gooru-web/mixins/modal';
import { CONTENT_TYPES } from 'gooru-web/config/config';

export default Ember.Component.extend(ContentEditMixin, ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:api-sdk/course
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @property {MediaService} Media service API SDK
   */
  mediaService: Ember.inject.service('api-sdk/media'),

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service('session'),

  /**
   * @requires service:taxonomy
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'courses', 'gru-course-edit'],

  tagName: 'article',

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Course Edit page back button logic for send to previous page state
     */
    courseEditBackButton: function() {
      let component = this;
      if (component.get('classId')) {
        component
          .get('router')
          .transitionTo('teacher.class.course-map', component.get('classId'));
      } else if (component.get('userId')) {
        component
          .get('router')
          .transitionTo('profile.content.courses', component.get('userId'));
      }
    },

    /**
     * Edit Content
     */
    editContent: function() {
      var courseForEditing = this.get('course').copy();
      this.set('tempCourse', courseForEditing);
      this.set('isEditing', true);
    },

    /**
     * Cancel edit content
     */
    cancelEdit: function() {
      this.set('isEditing', false);
      this.set('tempCourse', null);
    },

    /**
     * Delete course
     */
    deleteCourse: function() {
      const myId = this.get('session.userId');
      var model = {
        content: this.get('course'),
        deleteMethod: function() {
          return this.get('courseService').deleteCourse(this.get('course.id'));
        }.bind(this),
        type: CONTENT_TYPES.COURSE,
        redirect: {
          route: 'profile.content.courses',
          params: {
            id: myId
          }
        }
      };

      this.actions.showModal.call(
        this,
        'content.modals.gru-delete-content',
        model,
        null,
        null,
        null,
        false
      );
    },

    /**
     * Save Content
     */
    updateContent: function() {
      let component = this;
      var editedCourse = component.get('tempCourse');
      let course = component.get('course');
      editedCourse.validate().then(function({ validations }) {
        if (validations.get('isValid')) {
          let imageIdPromise = new Ember.RSVP.resolve(
            editedCourse.get('thumbnailUrl')
          );
          if (
            editedCourse.get('thumbnailUrl') &&
            editedCourse.get('thumbnailUrl') !== course.get('thumbnailUrl')
          ) {
            imageIdPromise = component
              .get('mediaService')
              .uploadContentFile(editedCourse.get('thumbnailUrl'));
          }
          imageIdPromise.then(function(imageId) {
            editedCourse.set('thumbnailUrl', imageId);
            component
              .get('courseService')
              .updateCourse(editedCourse)
              .then(function() {
                course.merge(editedCourse, [
                  'title',
                  'isVisibleOnProfile',
                  'thumbnailUrl',
                  'description',
                  'taxonomy',
                  'subject',
                  'mainSubject',
                  'audience',
                  'useCase'
                ]);
                component.set('isEditing', false);
              })
              .catch(function(error) {
                var message = component
                  .get('i18n')
                  .t('common.errors.course-not-updated').string;
                component.get('notifications').error(message);
                Ember.Logger.error(error);
              });
          });
          component.set('didValidate', true);
        }
      });
    },

    /**
     * Save setting for visibility of collection in profile
     */
    publishToProfile: function() {
      var courseForEditing = this.get('course').copy();
      this.set('tempCourse', courseForEditing);
      this.actions.updateContent.call(this);
    },

    /**
     *
     * @param {TaxonomyRoot} subject
     */
    selectSubject: function(subject) {
      this.set('tempCourse.mainSubject', subject);
    },

    /**
     *
     * @param {TaxonomyTagData[]} taxonomy
     */
    selectTaxonomy: function(taxonomy) {
      this.set('tempCourse.taxonomy', taxonomy);
    },

    /**
     * Sets the current course builder location
     * @param unitId
     * @param lessonId
     */
    setLocation: function(unitId, lessonId = undefined) {
      this.sendAction('onLocationChange', unitId, lessonId);
    }
  },

  // -------------------------------------------------------------------------
  // Events
  init() {
    this._super(...arguments);
    this.setMainSubject();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Course model as instantiated by the route. This is the model used when not editing
   * or after any course changes have been saved.
   * @property {Course}
   */
  course: null,

  /**
   * Copy of the course model used for editing.
   * @property {Course}
   */
  tempCourse: null,

  /**
   * @property {string} action name when the location is changed
   */
  onLocationChange: null,

  /**
   * @property {string} selected lesson id
   */
  selectedLessonId: null,

  // -------------------------------------------------------------------------
  // Methods

  setMainSubject: function() {
    var component = this;
    var subjectId = component.get('course.subject');
    if (subjectId) {
      component
        .get('taxonomyService')
        .findSubjectById(subjectId)
        .then(function(subject) {
          component.get('course').set('mainSubject', subject);
        });
    } else {
      component.get('course').set('mainSubject', null);
    }
  }
});
