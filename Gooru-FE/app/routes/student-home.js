import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';
import ConfigurationMixin from 'gooru-web/mixins/configuration';
import { NU_COURSE_VERSION } from 'gooru-web/config/config';

/**
 * Student home route
 *
 * @module
 * @augments Ember.Route
 */
export default Ember.Route.extend(PrivateRouteMixin, ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  analyticsService: Ember.inject.service('api-sdk/analytics'),

  performanceService: Ember.inject.service('api-sdk/performance'),

  /**
   * @type {CourseService} Service to retrieve course information
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @dependency {i18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods
  model: function() {
    let route = this;
    const configuration = this.get('configurationService.configuration');

    //Steps for Take a Tour functionality
    const tourSteps = Ember.A([
      {
        elementSelector: '.gru-take-tour',
        title: route.get('i18n').t('gru-take-tour.student-home.stepOne.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepOne.description')
      },
      {
        elementSelector: '.gru-header .home-link',
        title: route.get('i18n').t('gru-take-tour.student-home.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepTwo.description')
      },
      {
        elementSelector: '.gru-header .search-navbar-form',
        title: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepThree.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepThree.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .study-link',
        title: route.get('i18n').t('gru-take-tour.student-home.stepFour.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepFour.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .library-link',
        title: route.get('i18n').t('gru-take-tour.student-home.stepFive.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepFive.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .profile-link',
        title: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepSeven.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepSeven.description')
      },
      {
        elementSelector: '.gru-header .menu-navbar .dropdown .profile-more',
        title: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepEight.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepEight.description')
      },
      {
        elementSelector: '.student-navigator .active-classes a',
        title: route.get('i18n').t('gru-take-tour.student-home.stepTen.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepTen.description')
      },
      {
        elementSelector: '.student-navigator .independent-learning a',
        title: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepEleven.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepEleven.description')
      },
      {
        elementSelector: '.student-navigator .actions .join-class-cta',
        title: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepTwelve.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepTwelve.description')
      },
      {
        title: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepThirteen.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.student-home.stepThirteen.description')
      }
    ]);

    let myClasses =
      route.modelFor('application').myClasses || //when refreshing the page the variable is accessible at the route
      route.controllerFor('application').get('myClasses'); //after login the variable is refreshed at the controller
    let firstCoursePromise = Ember.RSVP.resolve(Ember.Object.create({}));
    let secondCoursePromise = Ember.RSVP.resolve(Ember.Object.create({}));
    let thirdCoursePromise = Ember.RSVP.resolve(Ember.Object.create({}));
    let fourthCoursePromise = Ember.RSVP.resolve(Ember.Object.create({}));
    const myId = route.get('session.userId');
    const firstCourseId = configuration.get(
      'exploreFeaturedCourses.firstCourseId'
    );
    const secondCourseId = configuration.get(
      'exploreFeaturedCourses.secondCourseId'
    );
    const thirdCourseId = configuration.get(
      'exploreFeaturedCourses.thirdCourseId'
    );
    const fourthCourseId = configuration.get(
      'exploreFeaturedCourses.fourthCourseId'
    );
    const activeClasses = myClasses.getStudentActiveClasses(myId);
    var featuredCourses = Ember.A([]);

    if (firstCourseId) {
      firstCoursePromise = route.get('courseService').fetchById(firstCourseId);
    }
    if (secondCourseId) {
      secondCoursePromise = route
        .get('courseService')
        .fetchById(secondCourseId);
    }
    if (thirdCourseId) {
      thirdCoursePromise = route.get('courseService').fetchById(thirdCourseId);
    }
    if (fourthCourseId) {
      fourthCoursePromise = route
        .get('courseService')
        .fetchById(fourthCourseId);
    }
    return Ember.RSVP
      .hash({
        firstCourse: firstCoursePromise,
        secondCourse: secondCoursePromise,
        thirdCourse: thirdCoursePromise,
        fourthCourse: fourthCoursePromise
      })
      .then(function(hash) {
        const firstFeaturedCourse = hash.firstCourse;
        const secondFeaturedCourse = hash.secondCourse;
        const thirdFeaturedCourse = hash.thirdCourse;
        const fourthFeaturedCourse = hash.fourthCourse;

        featuredCourses.push(firstFeaturedCourse);
        featuredCourses.push(secondFeaturedCourse);
        featuredCourses.push(thirdFeaturedCourse);
        featuredCourses.push(fourthFeaturedCourse);

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
    let myId = route.get('session.userId');

    Ember.RSVP
      .hash({
        classPerformanceSummaryItems: route
          .get('performanceService')
          .findClassPerformanceSummaryByStudentAndClassIds(myId, classIds),
        classesLocation: route
          .get('analyticsService')
          .getUserCurrentLocationByClassIds(classIds, myId, true)
      })
      .then(function(hash) {
        const classPerformanceSummaryItems = hash.classPerformanceSummaryItems;
        const classesLocation = hash.classesLocation;
        const nuCourseIds = Ember.A();
        activeClasses.forEach(function(activeClass) {
          const classId = activeClass.get('id');
          const courseVersion = activeClass.get('courseVersion');
          const courseId = activeClass.get('courseId');
          activeClass.set(
            'currentLocation',
            classesLocation.findBy('classId', classId)
          );
          activeClass.set(
            'performanceSummary',
            classPerformanceSummaryItems.findBy('classId', classId)
          );
          if (courseId != null && courseVersion === NU_COURSE_VERSION) {
            nuCourseIds.addObject(courseId);
            activeClass.set('isNUCourse', true);
          } else {
            activeClass.set('isNUCourse', false);
          }
        });
        if (nuCourseIds.length > 0) {
          Ember.RSVP
            .hash({
              coursesCompetencyCompletion: route
                .get('performanceService')
                .findCourseCompetencyCompletionByCourseIds(myId, nuCourseIds)
            })
            .then(({ coursesCompetencyCompletion }) => {
              activeClasses.forEach(function(activeClass) {
                const courseId = activeClass.get('courseId');
                const courseCompetencyCompletion = coursesCompetencyCompletion.findBy(
                  'courseId',
                  courseId
                );
                if (courseCompetencyCompletion) {
                  activeClass.set(
                    'courseCompetencyCompletion',
                    courseCompetencyCompletion
                  );
                }
              });
            });
        }
      });
  },

  setupController: function(controller, model) {
    controller.set('steps', model.tourSteps);
    controller.set('featuredCourses', model.featuredCourses);
  }
});
