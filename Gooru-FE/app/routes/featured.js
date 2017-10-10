import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';

export default Ember.Route.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {ProfileService} Search service object
   */
  searchService: Ember.inject.service('api-sdk/search'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Remix course action, when clicking remix at the course card
     * @param {Content/Course}
     */
    remixCourse: function(course) {
      var remixModel = {
        content: course
      };
      this.send('showModal', 'content.modals.gru-course-remix', remixModel);
    }
  },
  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    let route = this;
    return route
      .get('searchService')
      .searchFeaturedCourses('*')
      .then(function(result) {
        return Ember.RSVP.hash({
          courses: result
        });
      });
  },

  setupController: function(controller, model) {
    controller.set('courses', model.courses);
  }
});
