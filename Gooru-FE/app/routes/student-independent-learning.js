import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';
import ConfigurationMixin from 'gooru-web/mixins/configuration';
import { DEFAULT_BOOKMARK_PAGE_SIZE } from 'gooru-web/config/config';

/**
 * Student independent learning route
 *
 * @module
 * @augments Ember.Route
 */
export default Ember.Route.extend(PrivateRouteMixin, ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {CourseService} Service to retrieve course information
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @type {BookmarkService} Service to retrieve bookmark information
   */
  bookmarkService: Ember.inject.service('api-sdk/bookmark'),

  // -------------------------------------------------------------------------
  // Actions

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

        if (item === 'courses') {
          route.transitionTo('student-independent-learning.courses');
        } else if (item === 'assessments') {
          route.transitionTo('student-independent-learning.assessments');
        } else {
          route.transitionTo('student-independent-learning.collections');
        }
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    let route = this;
    const configuration = this.get('configurationService.configuration');

    let myClasses =
      route.modelFor('application').myClasses || //when refreshing the page the variable is accessible at the route
      route.controllerFor('application').get('myClasses'); //after login the variable is refreshed at the controller
    const myId = route.get('session.userId');
    let firstCoursePromise = Ember.RSVP.resolve(Ember.Object.create({}));
    let secondCoursePromise = Ember.RSVP.resolve(Ember.Object.create({}));
    const firstCourseId = configuration.get(
      'exploreFeaturedCourses.firstCourseId'
    );
    const secondCourseId = configuration.get(
      'exploreFeaturedCourses.secondCourseId'
    );
    var featuredCourses = Ember.A([]);
    const pagination = {
      offset: 0,
      pageSize: DEFAULT_BOOKMARK_PAGE_SIZE
    };

    const activeClasses = myClasses.getStudentActiveClasses(myId);
    const bookmarksPromise = route
      .get('bookmarkService')
      .fetchBookmarks(pagination, true);

    if (firstCourseId) {
      firstCoursePromise = route.get('courseService').fetchById(firstCourseId);
    }
    if (secondCourseId) {
      secondCoursePromise = route
        .get('courseService')
        .fetchById(secondCourseId);
    }
    return Ember.RSVP
      .hash({
        firstCourse: firstCoursePromise,
        secondCourse: secondCoursePromise,
        bookmarks: bookmarksPromise,
        pagination
      })
      .then(function(hash) {
        const firstFeaturedCourse = hash.firstCourse;
        const secondFeaturedCourse = hash.secondCourse;
        const bookmarks = hash.bookmarks;
        const pagination = hash.pagination;

        featuredCourses.push(firstFeaturedCourse);
        featuredCourses.push(secondFeaturedCourse);

        return {
          activeClasses,
          featuredCourses,
          bookmarks,
          pagination
        };
      });
  },

  setupController: function(controller, model) {
    controller.set('featuredCourses', model.featuredCourses);
    controller.set('bookmarks', model.bookmarks);
    controller.set('pagination', model.pagination);
    controller.set('toggleState', false);
  }
});
