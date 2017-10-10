import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  i18n: Ember.inject.service(),

  profileService: Ember.inject.service('api-sdk/profile'),
  /**
   * @requires service:api-sdk/analytics
   */
  analyticsService: Ember.inject.service('api-sdk/analytics'),

  // -------------------------------------------------------------------------
  // Attributes

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Launch an assessment on-air
     *
     * @function actions:launchOnAir
     */
    launchOnAir: function(collectionId) {
      const currentClass = this.modelFor('class').class;
      const classId = currentClass.get('id');
      this.transitionTo('reports.collection', classId, collectionId);
    },

    /**
     * Open the player with the specific collection/assessment
     *
     * @function actions:playItem
     * @param {string} unitId - Identifier for a unit
     * @param {string} lessonId - Identifier for lesson
     * @param {string} collection - collection or assessment
     */
    playResource: function(unitId, lessonId, collection) {
      if (collection.get('isExternalAssessment')) {
        window.open(collection.get('url'));
      } else {
        const currentClass = this.modelFor('class').class;
        const classId = currentClass.get('id');
        const courseId = currentClass.get('courseId');
        const role = this.get('controller.isStudent') ? 'student' : 'teacher';
        this.transitionTo(
          'context-player',
          classId,
          courseId,
          unitId,
          lessonId,
          collection.get('id'),
          {
            queryParams: { role: role, type: collection.get('collectionType') }
          }
        );
      }
    },

    /**
     * Edit content action, when clicking Edit content on Class Overview
     * @param {Content/Course}
     */
    editContent: function(id) {
      this.transitionTo('content.courses.edit', id);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
    const currentClass = this.modelFor('class').class;
    const userId = this.get('session.userId');
    if (currentClass.isTeacher(userId) && !currentClass.get('courseId')) {
      this.transitionTo('class.quick-start');
    }
  },

  model: function() {
    const route = this;
    const currentClass = route.modelFor('class').class;
    const course = route.modelFor('class').course;
    const units = route.modelFor('class').units;
    const userId = route.get('session.userId');
    const isTeacher = currentClass.isTeacher(userId);
    const classMembers = currentClass.get('members');
    let userLocation = null;
    if (!isTeacher) {
      userLocation = route
        .get('analyticsService')
        .getUserCurrentLocation(currentClass.get('id'), userId);
    }

    const tourSteps = Ember.A([
      {
        elementSelector: '.overview .overview-header .title h3',
        title: route.get('i18n').t('gru-tour.overview.stepOne.title'),
        description: route
          .get('i18n')
          .t('gru-tour.overview.stepOne.description')
      },
      {
        elementSelector: '.gru-class-navigation .class-info .code',
        title: route.get('i18n').t('gru-tour.overview.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-tour.overview.stepTwo.description')
      },
      {
        elementSelector:
          '.gru-class-navigation .class-menu .analytics.performance',
        title: route.get('i18n').t('gru-tour.overview.stepThree.title'),
        description: route
          .get('i18n')
          .t('gru-tour.overview.stepThree.description')
      },
      {
        elementSelector: '.gru-class-navigation .class-menu .info',
        title: route.get('i18n').t('gru-tour.overview.stepFour.title'),
        description: route
          .get('i18n')
          .t('gru-tour.overview.stepFour.description')
      },
      {
        elementSelector: '.overview .overview-header .edit-content',
        title: route.get('i18n').t('gru-tour.overview.stepFive.title'),
        description: route
          .get('i18n')
          .t('gru-tour.overview.stepFive.description')
      },
      {
        title: route.get('i18n').t('gru-tour.overview.stepSix.title'),
        description: route
          .get('i18n')
          .t('gru-tour.overview.stepSix.description'),
        image: 'overview-tour-image'
      }
    ]);
    route
      .get('profileService')
      .readUserProfile(route.get('session.userId'))
      .then(function(profile) {
        return route.get('profileService').getCourses(profile);
      });

    return Ember.RSVP.hash({
      userLocation: userLocation,
      course: course,
      units: units,
      isTeacher: isTeacher,
      currentClass: currentClass,
      classMembers: classMembers,
      tourSteps: tourSteps
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    let userLocation = model.userLocation
      ? `${model.userLocation.get('unitId')}+${model.userLocation.get(
        'lessonId'
      )}+${model.userLocation.get('collectionId')}`
      : '';

    controller.set('userLocation', userLocation);
    controller.set('units', model.units);
    controller.set('course', model.course);
    controller.set('classMembers', model.classMembers);
    controller.set('tourSteps', model.tourSteps);
    controller.get('classController').selectMenuItem('overview');
  }
});
