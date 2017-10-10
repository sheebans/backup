import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';

export default Ember.Route.extend(PrivateRouteMixin, {
  queryParams: {
    refresh: {
      refreshModel: true
    }
  },

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {CourseService} Service to retrieve course information
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @type {i18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

  /**
   * @type {LearnerService} Service to retrieve learner information
   */
  learnerService: Ember.inject.service('api-sdk/learner'),

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Triggered when a class menu item is selected
     * @param {string} item
     */
    selectMenuItem: function(item) {
      const route = this;
      const controller = route.get('controller');
      const currentItem = controller.get('menuItem');

      if (item !== currentItem) {
        controller.selectMenuItem(item);
        const queryParams = {
          queryParams: {
            filterBy: 'assessment'
          }
        };

        if (item === 'performance') {
          route.transitionTo('student.independent.performance', queryParams);
        } else if (item === 'course-map') {
          route.transitionTo('student.independent.course-map');
        } else {
          route.transitionTo('student.independent');
        }
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    const route = this;
    const courseId = params.courseId;
    const userId = this.get('session.userId');
    let coursePromise = route.get('courseService').fetchById(courseId);
    let performancePromise = route
      .get('learnerService')
      .fetchCoursesPerformance(userId, [courseId]);

    return Ember.RSVP
      .hash({
        course: coursePromise,
        performance: performancePromise
      })
      .then(function(hash) {
        const course = hash.course;
        const performance = hash.performance;
        return Ember.RSVP.hash({
          course,
          performance
        });
      });
  },
  /**
   * Run after model is set
   */
  afterModel: function(user, transition) {
    if (transition.targetName === `${this.routeName}.index`) {
      this.transitionTo('student.independent.course-map');
    }
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('performance', model.performance[0]);
    controller.set('course', model.course);
    controller.set('units', model.course.get('children') || []);
  }
});
