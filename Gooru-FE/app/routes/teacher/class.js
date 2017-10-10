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
   * @type {ClassService} Service to retrieve class information
   */
  classService: Ember.inject.service('api-sdk/class'),

  /**
   * @type {PerformanceService} Service to retrieve class performance summary
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  /**
   * @type {CourseService} Service to retrieve course information
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @type {UnitService} Service to retrieve unit information
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  /**
   * @type {i18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

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
        if (item === 'class-management') {
          route.transitionTo('teacher.class.class-management');
        } else if (item === 'course-map') {
          route.transitionTo('teacher.class.course-map');
        } else if (item === 'performance') {
          route.transitionTo('teacher.class.performance');
        } else if (item === 'class-activities') {
          route.transitionTo('teacher.class.class-activities');
        }
      }
    },

    /**
     * Gets a refreshed list of content visible
     */
    updateContentVisible: function(contentId, visible) {
      const route = this;
      const controller = route.get('controller');
      let contentVisibility = controller.get('contentVisibility');
      contentVisibility.setAssessmentVisibility(
        contentId,
        visible ? 'on' : 'off'
      );
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    const route = this;

    //Steps for Take a Tour functionality
    let tourSteps = Ember.A([
      {
        title: route.get('i18n').t('gru-take-tour.teacher-class.stepOne.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-class.stepOne.description')
      },
      {
        elementSelector: '.gru-class-navigation .nav-tabs .class-activities',
        title: route.get('i18n').t('gru-take-tour.teacher-class.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-class.stepTwo.description')
      },
      {
        elementSelector: '.gru-class-navigation .nav-tabs .course-map',
        title: route
          .get('i18n')
          .t('gru-take-tour.teacher-class.stepThree.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-class.stepThree.description')
      },
      {
        elementSelector: '.gru-class-navigation .nav-tabs .performance',
        title: route
          .get('i18n')
          .t('gru-take-tour.teacher-class.stepFour.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-class.stepFour.description')
      },
      {
        title: route
          .get('i18n')
          .t('gru-take-tour.teacher-class.stepFive.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.teacher-class.stepFive.description')
      }
    ]);

    const classId = params.classId;
    const classPromise = route.get('classService').readClassInfo(classId);
    const membersPromise = route.get('classService').readClassMembers(classId);
    const performanceSummaryPromise = route
      .get('performanceService')
      .findClassPerformanceSummaryByClassIds([classId]);
    return Ember.RSVP
      .hash({
        class: classPromise,
        members: membersPromise,
        classPerformanceSummaryItems: performanceSummaryPromise
      })
      .then(function(hash) {
        const aClass = hash.class;
        const members = hash.members;
        const classPerformanceSummaryItems = hash.classPerformanceSummaryItems;
        aClass.set(
          'performanceSummary',
          classPerformanceSummaryItems.findBy('classId', classId)
        );

        const courseId = aClass.get('courseId');
        let visibilityPromise = Ember.RSVP.resolve([]);
        let coursePromise = Ember.RSVP.resolve(Ember.Object.create({}));

        if (courseId) {
          visibilityPromise = route
            .get('classService')
            .readClassContentVisibility(classId);
          coursePromise = route.get('courseService').fetchById(courseId);
        }
        return Ember.RSVP
          .hash({
            contentVisibility: visibilityPromise,
            course: coursePromise
          })
          .then(function(hash) {
            const contentVisibility = hash.contentVisibility;
            const course = hash.course;
            aClass.set('owner', members.get('owner'));
            aClass.set('collaborators', members.get('collaborators'));
            aClass.set('members', members.get('members'));
            return {
              class: aClass,
              course,
              members,
              contentVisibility,
              tourSteps
            };
          });
      });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('class', model.class);
    controller.set('course', model.course);
    controller.set('members', model.members);
    controller.set('contentVisibility', model.contentVisibility);
    controller.set('steps', model.tourSteps);
  }
});
