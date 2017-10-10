import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} session
   */
  session: Ember.inject.service('session'),
  /**
   * @property {Service} i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @property {Service} profileService
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  actions: {
    setupTour: function(step) {
      if (this.currentModel.tourSteps.indexOf(step) === 0) {
        $('.gru-class-navigation .class-info h4').addClass('active-for-tour');
      } else {
        $('.gru-class-navigation .class-info h4').removeClass(
          'active-for-tour'
        );
      }
    },
    closeTour: function() {
      if (
        $('.gru-class-navigation .class-info h4').hasClass('active-for-tour')
      ) {
        $('.gru-class-navigation .class-info h4').removeClass(
          'active-for-tour'
        );
      }
    }
  },

  model: function() {
    const route = this;
    const currentClass = this.modelFor('teacher.class').class;
    const coursesPromise = route
      .get('profileService')
      .readUserProfile(route.get('session.userId'))
      .then(function(profile) {
        return route.get('profileService').getCourses(profile);
      });
    const tourSteps = Ember.A([
      {
        elementSelector: '.menu-navbar .profile.dropdown-toggle',
        title: route.get('i18n').t('gru-tour.quick-start.stepOne.title'),
        description: route
          .get('i18n')
          .t('gru-tour.quick-start.stepOne.description')
      },
      {
        elementSelector: '.quick-start-options .new-assessment.btn',
        title: route.get('i18n').t('gru-tour.quick-start.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-tour.quick-start.stepTwo.description')
      }
    ]);
    return Ember.RSVP.hash({
      courses: coursesPromise,
      class: currentClass,
      tourSteps: tourSteps
    });
  },
  setupController: function(controller, model) {
    controller.set('class', {
      class: model.class,
      isQuickstart: true
    });
    controller.set('courses', model.courses);
    controller.set('tourSteps', model.tourSteps);
    controller.get('classController').selectMenuItem('course-map');
  }
});
