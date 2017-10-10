import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

/**
 * Teacher route
 *
 * @module
 * @augments Ember.Route
 */
export default Ember.Route.extend(PrivateRouteMixin, ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  performanceService: Ember.inject.service('api-sdk/performance'),

  /**
   * @requires service:api-sdk/course
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @type {I18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function() {
    let route = this;
    const configuration = this.get('configurationService.configuration');

    //Steps for Take a Tour functionality
    let tourSteps = Ember.A([
      {
        elementSelector: '.gru-take-tour',
        title: route.get('i18n').t('gru-take-tour.teacher-home.stepOne.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepOne.description')
      },
      {
        elementSelector: '.gru-header .home-link',
        title: route.get('i18n').t('gru-take-tour.teacher-home.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepTwo.description')
      },
      {
        elementSelector: '.gru-header .search-navbar-form',
        title: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepThree.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepThree.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .classrooms-link',
        title: route.get('i18n').t('gru-take-tour.teacher-home.stepFour.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepFour.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .tools-link',
        title: route.get('i18n').t('gru-take-tour.teacher-home.stepFive.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepFive.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .library-link',
        title: route.get('i18n').t('gru-take-tour.teacher-home.stepSix.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepSix.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .profile-link',
        title: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepSeven.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepSeven.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .dropdown .profile-more',
        title: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepEight.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepEight.description')
      },
      {
        elementSelector: '.teacher-navigator .active-classes a',
        title: route.get('i18n').t('gru-take-tour.teacher-home.stepNine.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepNine.description')
      },
      {
        elementSelector: '.teacher-navigator .archived-classes a',
        title: route.get('i18n').t('gru-take-tour.teacher-home.stepTen.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepTen.description')
      },
      {
        elementSelector: '.teacher-navigator .actions .create-class-cta',
        title: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepEleven.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-home.stepEleven.description')
      }
    ]);

    let myClasses =
      route.modelFor('application').myClasses || //when refreshing the page the variable is accessible at the route
      route.controllerFor('application').get('myClasses'); //after login the variable is refreshed at the controller
    let firstCoursePromise = Ember.RSVP.resolve(Ember.Object.create({}));
    let secondCoursePromise = Ember.RSVP.resolve(Ember.Object.create({}));
    const myId = route.get('session.userId');
    const activeClasses = myClasses.getTeacherActiveClasses(myId);
    const firstCourseId = configuration.get(
      'exploreFeaturedCourses.firstCourseId'
    );
    const secondCourseId = configuration.get(
      'exploreFeaturedCourses.secondCourseId'
    );
    var featuredCourses = Ember.A([]);

    if (firstCourseId) {
      firstCoursePromise = route
        .get('courseService')
        .fetchByIdWithOutProfile(firstCourseId);
    }
    if (secondCourseId) {
      secondCoursePromise = route
        .get('courseService')
        .fetchByIdWithOutProfile(secondCourseId);
    }

    return Ember.RSVP
      .hash({
        firstCourse: firstCoursePromise,
        secondCourse: secondCoursePromise
      })
      .then(function(hash) {
        const firstFeaturedCourse = hash.firstCourse;
        const secondFeaturedCourse = hash.secondCourse;

        featuredCourses.push(firstFeaturedCourse);
        featuredCourses.push(secondFeaturedCourse);

        return {
          activeClasses,
          featuredCourses,
          tourSteps
        };
      });
  },

  afterModel(resolvedModel) {
    let route = this;
    let activeClasses = resolvedModel.activeClasses;
    let classIds = activeClasses.mapBy('id');

    route
      .get('performanceService')
      .findClassPerformanceSummaryByClassIds(classIds)
      .then(function(classPerformanceSummaryItems) {
        activeClasses.forEach(function(activeClass) {
          let classId = activeClass.get('id');
          let courseId = activeClass.get('courseId');
          if (courseId) {
            route
              .get('courseService')
              .fetchByIdWithOutProfile(courseId)
              .then(course => {
                activeClass.set('course', course);
                activeClass.set('unitsCount', course.get('unitCount'));
              });
          }
          activeClass.set(
            'performanceSummary',
            classPerformanceSummaryItems.findBy('classId', classId)
          );
        });
      });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('steps', model.tourSteps);
    controller.set('featuredCourses', model.featuredCourses);
  },

  /**
   * Reset controller properties
   */
  deactivate: function() {
    this.get('controller').resetValues();
  }
});
