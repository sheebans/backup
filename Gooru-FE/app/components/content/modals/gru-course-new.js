import Ember from 'ember';
import CourseModel from 'gooru-web/models/content/course';
import { TAXONOMY_CATEGORIES } from 'gooru-web/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} User service API SDK
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * @property {Service} Notifications service
   */
  notifications: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'modals', 'gru-course-new'],

  classNameBindings: ['component-class'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    selectCategory: function(categoryValue) {
      this.set('course.category', categoryValue);
    },

    createCourse: function() {
      const component = this;

      const course = this.get('course');
      course.validate().then(
        function({ validations }) {
          if (validations.get('isValid')) {
            component.set('isLoading', true);
            this.get('courseService').createCourse(course).then(
              function(course) {
                component.set('isLoading', false);

                component.triggerAction({
                  action: 'closeModal'
                });
                component
                  .get('router')
                  .transitionTo('content.courses.edit', course.get('id'), {
                    queryParams: { editing: true }
                  });
              },
              function() {
                const message = component
                  .get('i18n')
                  .t('common.errors.course-not-created').string;
                component.get('notifications').error(message);
                component.set('isLoading', false);
              }
            );
          }
          this.set('didValidate', true);
        }.bind(this)
      );
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    var course = CourseModel.create(Ember.getOwner(this).ownerInjection(), {
      title: null
    });
    this.set('course', course);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @type {Ember.A} categories - List of course categories
   */
  categories: TAXONOMY_CATEGORIES,

  /**
   * @type {?String} specific class
   */
  'component-class': null,

  /**
   * @type {Course} course
   */
  course: null,

  /**
   * Indicate if it's waiting for createCourse callback
   */
  isLoading: false
});
