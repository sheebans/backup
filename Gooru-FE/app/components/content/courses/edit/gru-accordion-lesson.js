import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import PlayerAccordionLesson from 'gooru-web/components/content/courses/play/gru-accordion-lesson';
import { CONTENT_TYPES } from 'gooru-web/config/config';

/**
 * Content Builder: Accordion Lesson
 *
 * Component responsible for behaving as an accordion and listing a set of collections/assessments.
 * It is meant to be used inside of an {@link ./gru-accordion-unit|Accordion Unit}
 *
 * @module
 * @augments content/courses/play/gru-accordion-lesson
 * @mixes mixins/modal
 */
export default PlayerAccordionLesson.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @requires service:api-sdk/lesson
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),

  /**
   * @property {Service} session
   */
  session: Ember.inject.service('session'),

  /**
   * @property {Service} profile service
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    cancelEdit: function() {
      if (this.get('model.isNew')) {
        this.get('onCancelAddLesson')(this.get('model'));
      } else {
        this.set('model.isEditing', false);
      }
    },

    edit: function() {
      var lessonForEditing = this.get('lesson').copy();
      this.set('tempLesson', lessonForEditing);
      this.set('model.isEditing', true);
    },

    saveLesson: function() {
      var courseId = this.get('course.id');
      var unitId = this.get('unitId');
      var editedLesson = this.get('tempLesson');
      var lessonService = this.get('lessonService');

      editedLesson.validate().then(
        function({ validations }) {
          if (validations.get('isValid')) {
            // Saving an existing lesson or a new lesson (falsey id)?
            let savePromise = editedLesson.get('id')
              ? lessonService.updateLesson(courseId, unitId, editedLesson)
              : lessonService.createLesson(courseId, unitId, editedLesson);

            savePromise
              .then(
                function() {
                  this.get('lesson').merge(editedLesson, ['id', 'title']);
                  this.set(
                    'newCollectionModel.lessonId',
                    this.get('lesson.id')
                  );
                  this.set('model.isEditing', false);
                }.bind(this)
              )
              .catch(
                function(error) {
                  var message = this.get('i18n').t(
                    'common.errors.lesson-not-created'
                  ).string;
                  this.get('notifications').error(message);
                  Ember.Logger.error(error);
                }.bind(this)
              );
          }
          this.set('didValidate', true);
        }.bind(this)
      );
    },
    /**
     * Remove lesson item
     */
    removeLessonItem: function(builderItem) {
      this.get('items').removeObject(builderItem);
      this.refreshOrderList();
    },
    remixLessonItem: function(builderItem) {
      this.get('items').addObject(builderItem);
      this.refreshOrderList();
    },
    /**
     * Delete selected lesson
     *
     */
    deleteItem: function(builderItem) {
      let component = this;
      var model = {
        content: this.get('lesson'),
        index: this.get('index'),
        parentName: this.get('course.title'),
        deleteMethod: function() {
          return this.get('lessonService').deleteLesson(
            this.get('course.id'),
            this.get('unitId'),
            this.get('lesson.id')
          );
        }.bind(this),
        type: CONTENT_TYPES.LESSON,
        callback: {
          success: function() {
            component.get('onDeleteLesson')(builderItem);
          }
        }
      };
      this.actions.showModal.call(
        this,
        'content.modals.gru-delete-content',
        model
      );
    },

    copy: function() {
      var model = {
        content: this.get('lesson'),
        courseId: this.get('course.id'),
        unitId: this.get('unitId'),
        onRemixSuccess: this.get('onRemixLesson')
      };
      this.send('showModal', 'content.modals.gru-lesson-remix', model);
    },

    /**
     * Add from my collections
     */
    fromMyCollections: function() {
      var component = this;
      component
        .get('profileService')
        .readCollections(component.get('session.userId'), {
          filterBy: 'notInCourse'
        })
        .then(function(collections) {
          component.send(
            'showModal',
            'content.modals.gru-add-to-lesson',
            {
              collections,
              content: component.get('lesson'),
              courseId: component.get('course.id'),
              unitId: component.get('unitId'),
              isCollection: true,
              onAdd: component.get('onAddItem').bind(component)
            },
            null,
            'add-to'
          );
        });
    },

    /**
     * Add from my assessments
     */
    fromMyAssessments: function() {
      var component = this;
      component
        .get('profileService')
        .readAssessments(component.get('session.userId'), {
          filterBy: 'notInCourse'
        })
        .then(function(assessments) {
          component.send(
            'showModal',
            'content.modals.gru-add-to-lesson',
            {
              collections: assessments,
              content: component.get('lesson'),
              courseId: component.get('course.id'),
              unitId: component.get('unitId'),
              isCollection: false,
              onAdd: component.get('onAddItem').bind(component)
            },
            null,
            'add-to'
          );
        });
    },

    sortLessonItems: function() {
      this.loadData();
      this.actions.sortItems.call(this);
    },

    saveLessonItemsOrder: function() {
      var courseId = this.get('course.id');
      var unitId = this.get('unitId');
      var lessonId = this.get('lesson.id');
      var orderList = this.get('orderList');

      if (orderList && orderList.length > 1) {
        this.get('lessonService')
          .reorderLesson(courseId, unitId, lessonId, orderList)
          .then(
            function() {
              this.actions.finishSort.call(this);
            }.bind(this)
          );
      } else {
        this.actions.finishSort.call(this);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Attributes

  attributeBindings: ['data-id'],

  'data-id': Ember.computed.alias('lesson.id'),

  // -------------------------------------------------------------------------
  // Events
  init() {
    this._super(...arguments);

    let courseId = this.get('course.id');
    let unitId = this.get('unitId');
    let lessonId = this.get('lesson.id');
    this.set('newCollectionModel', {
      courseId,
      unitId,
      lessonId,
      associateLesson: true
    });

    if (this.get('lesson') && !this.get('lesson.id')) {
      // If this a new lesson, set the tempLesson value so things don't break in edit mode
      let lessonForEditing = this.get('lesson').copy();
      this.set('tempLesson', lessonForEditing);
    }
  },

  didRender() {
    $('[data-toggle="tooltip"]').tooltip();
  },

  /**
   * After adding a collection/assessment
   */
  onAddItem: function(builderItem) {
    this.get('items').addObject(builderItem);
    this.refreshOrderList();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop {Object} newCollectionModel - model for the new collection/assessment modals
   */
  newCollectionModel: null,

  /**
   * @prop {Content/Lesson} tempLesson - Temporary lesson model used for editing
   */
  tempLesson: null
});
