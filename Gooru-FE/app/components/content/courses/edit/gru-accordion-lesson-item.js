import PlayerAccordionLessonItem from 'gooru-web/components/content/courses/play/gru-accordion-lesson-item';
import { CONTENT_TYPES } from 'gooru-web/config/config';
import ModalMixin from 'gooru-web/mixins/modal';
import Ember from 'ember';

/**
 * Course content viewer: Accordion Lesson Item
 *
 * Component responsible for presenting a collection/assessment within a lesson.
 * It is meant to be used inside of an {@link ./gru-accordion-unit|Accordion Lesson}
 *
 * @module
 * @augments Ember/Component
 */
export default PlayerAccordionLessonItem.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @requires service:api-sdk/collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @requires service:api-sdk/assessment
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),

  /**
   * @requires service:api-sdk/lesson
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    edit: function(item) {
      const component = this;
      var route = item.get('isCollection')
        ? 'content.collections.edit'
        : 'content.assessments.edit';
      component.get('router').transitionTo(route, item.get('id'));
    },

    /**
     * Remove selected item
     *
     */
    removeItem: function(builderItem) {
      let component = this;
      var model = {
        content: this.get('model'),
        index: this.get('index'),
        parentName: this.get('lessonTitle'),
        callback: {
          success: function() {
            component.get('onRemoveLessonItem')(builderItem);
          }
        }
      };
      var lessonItem = null;
      lessonItem = {
        removeMethod: function() {
          return this.get(
            'lessonService'
          ).disassociateAssessmentOrCollectionToLesson(
            this.get('courseId'),
            this.get('unitId'),
            this.get('lessonId'),
            this.get('model.id'),
            builderItem.get('isCollection')
          );
        }.bind(this),
        type: builderItem.get('isCollection')
          ? CONTENT_TYPES.COLLECTION
          : CONTENT_TYPES.ASSESSMENT
      };

      this.actions.showModal.call(
        this,
        'content.modals.gru-remove-content',
        $.extend(model, lessonItem)
      );
    },

    /**
     * Delete selected unit
     *
     */
    deleteItem: function(builderItem) {
      let component = this;
      var model = {
        content: this.get('model'),
        index: this.get('index'),
        parentName: this.get('course.title'),
        callback: {
          success: function() {
            component.get('onDeleteLessonItem')(builderItem);
          }
        }
      };
      var lessonItem = null;
      if (builderItem.get('isCollection')) {
        lessonItem = {
          deleteMethod: function() {
            return this.get('collectionService').deleteCollection(
              this.get('model.id')
            );
          }.bind(this),
          type: CONTENT_TYPES.COLLECTION
        };
      } else {
        lessonItem = {
          deleteMethod: function() {
            return this.get('assessmentService').deleteAssessment(
              this.get('model')
            );
          }.bind(this),
          type: CONTENT_TYPES.ASSESSMENT
        };
      }
      this.actions.showModal.call(
        this,
        'content.modals.gru-delete-content',
        $.extend(model, lessonItem)
      );
    },

    copy: function() {
      const component = this;
      const isCollection = component.get('model.isCollection');
      if (isCollection) {
        component
          .get('collectionService')
          .readCollection(component.get('model.id'))
          .then(function(result) {
            let model = {
              content: result,
              lessonId: component.get('lessonId'),
              unitId: component.get('unitId'),
              courseId: component.get('courseId'),
              isCollection: isCollection,
              onRemixSuccess: component.get('onRemixLessonItem')
            };
            component.send(
              'showModal',
              'content.modals.gru-collection-remix',
              model
            );
          });
      } else {
        component
          .get('assessmentService')
          .readAssessment(component.get('model.id'))
          .then(function(result) {
            let model = {
              content: result,
              lessonId: component.get('lessonId'),
              unitId: component.get('unitId'),
              courseId: component.get('courseId'),
              isCollection: isCollection,
              onRemixSuccess: component.get('onRemixLessonItem')
            };
            component.send(
              'showModal',
              'content.modals.gru-assessment-remix',
              model
            );
          });
      }
    }
  },

  didRender() {
    $('[data-toggle="tooltip"]').tooltip();
  },

  // -------------------------------------------------------------------------
  // Attributes

  attributeBindings: ['data-id'],

  'data-id': Ember.computed.alias('model.id'),

  // -------------------------------------------------------------------------
  // Properties

  isCollectionOrAssessment: Ember.computed('model.collectionType', function() {
    return (
      this.get('model.collectionType') === 'collection' ||
      this.get('model.collectionType') === 'assessment'
    );
  }),
  /**
   * @prop {String} course - Course this lesson item belongs to
   */
  course: null
});
