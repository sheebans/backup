import Ember from 'ember';

/**
 * Content Builder: Accordion Lesson Item
 *
 * Component responsible for presenting a collection/assessment within a lesson.
 * It is meant to be used inside of an {@link ./gru-accordion-unit|Accordion Lesson}
 *
 * @module
 * @augments Ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'courses', 'gru-accordion-lesson-item', 'view'],

  tagName: 'li',

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop {String} courseId -  ID of the course this collection/assessment belongs to
   */
  courseId: null,

  /**
   * @prop {String} unitId - ID of the unit this collection/assessment belongs to
   */
  unitId: null,

  /**
   * @prop {String} lessonId - ID of the lesson this collection/assessment belongs to
   */
  lessonId: null,

  /**
   * @prop {Content/Collection-Assessment} model
   */
  model: null
});
