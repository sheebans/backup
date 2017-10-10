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
   * @property {Session} current session
   */
  session: Ember.inject.service('session'),

  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @type {ClassService} Service to retrieve class information
   */
  classService: Ember.inject.service('api-sdk/class'),

  /**
   * @type {CourseService} Service to retrieve course information
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @type {UnitService} Service to retrieve unit information
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    const route = this;
    const classId = params.classId;
    const classPromise = route.get('classService').readClassInfo(classId);
    const membersPromise = route.get('classService').readClassMembers(classId);

    var channels = [];
    var messages = [];
    const userInfo = this.get('profileService').findByCurrentUser();

    return Ember.RSVP
      .hash({
        class: classPromise,
        members: membersPromise
      })
      .then(function(hash) {
        const aClass = hash.class;
        const members = hash.members;
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
            return Ember.RSVP.hash({
              class: aClass,
              course: course,
              members: members,
              units: course.get('children') || [],
              contentVisibility: contentVisibility,
              channels: channels,
              messages: messages,
              userInfo: userInfo
            });
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
    controller.set('units', model.units);
    controller.set('contentVisibility', model.contentVisibility);
    controller.set('channels', model.channels);
    controller.set('messages', model.messages);
    controller.set('userInfo', model.userInfo);
  },

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
        const aClass = controller.get('class');
        const isTeacher = aClass.isTeacher(this.get('session.userId'));
        controller.selectMenuItem(item);
        const queryParams = {
          queryParams: {
            filterBy: 'assessment'
          }
        };

        if (item === 'analytics.performance' && isTeacher) {
          route.transitionTo(
            'class.analytics.performance.teacher.course',
            queryParams
          );
        } else if (item === 'analytics.performance' && !isTeacher) {
          route.transitionTo(
            'class.analytics.performance.student',
            queryParams
          );
        } else {
          route.transitionTo(`class.${item}`);
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
  // Events
  /**
   * This event handlers reset some class properties when leaving the route
   */
  handleDeactivate: function() {
    this.get('controller').exitFullScreen();
  }.on('deactivate')
});
