import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import { DEFAULT_PAGE_SIZE } from 'gooru-web/config/config';

export default Ember.Route.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {ProfileService} Profile service object
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Edit course action, when clicking Edit at the course card
     * @param {Content/Course}
     */
    editCourse: function(course) {
      let queryParams = { userId: course.get('ownerId') };
      this.transitionTo('content.courses.edit', course.get('id'), {
        queryParams
      });
    },

    /**
     * Edit course action, when clicking Play at the course card
     * @param {Content/Course}
     */
    playCourse: function(course) {
      this.transitionTo('content.courses.play', course.get('id'));
    },

    /**
     * Remix course action, when clicking remix at the course card
     * @param {Content/Course}
     */
    remixCourse: function(course) {
      var remixModel = {
        content: course
      };
      this.send('showModal', 'content.modals.gru-course-remix', remixModel);
    },

    /**
     * Triggers the refresh of user classes
     */
    updateClass: function() {
      this.send('updateUserClasses');
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    let profile = this.modelFor('profile').profile;
    const params = {
      pageSize: DEFAULT_PAGE_SIZE,
      searchText: this.paramsFor('profile.content').term
    };
    let courses = this.get('profileService').getCourses(profile, params);
    return Ember.RSVP.hash({
      courses
    });
  },

  setupController: function(controller, model) {
    controller.get('profileController').selectMenuItem('content');
    controller.set('courses', model.courses);
    controller.set('disableSearch', true);
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
