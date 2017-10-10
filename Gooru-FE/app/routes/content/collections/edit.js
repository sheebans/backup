import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';

export default Ember.Route.extend(PrivateRouteMixin, {
  queryParams: {
    editing: {},
    editingContent: {
      refreshModel: true
    }
  },

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Session} current session
   */
  session: Ember.inject.service('session'),

  collectionService: Ember.inject.service('api-sdk/collection'),

  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @requires service:api-sdk/question
   */
  questionService: Ember.inject.service('api-sdk/question'),

  /**
   * @requires service:century-skill/century-skill
   */
  centurySkillService: Ember.inject.service('century-skill'),

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Methods

  model: function(params) {
    const route = this;

    return route
      .get('collectionService')
      .readCollection(params.collectionId)
      .then(function(collection) {
        const courseId = collection.get('courseId');
        const isEditing = params.editing;
        var editingContent =
          params.editingContent && params.editingContent !== 'null'
            ? params.editingContent
            : undefined;
        var course = null;

        params.editingContent = editingContent;

        if (courseId) {
          course = route.get('courseService').fetchById(courseId);
        }

        let resourcePromiseList = collection
          .get('children')
          .map(
            resource =>
              resource.get('format') === 'question'
                ? route.get('questionService').readQuestion(resource.get('id'))
                : resource
          );

        return Ember.RSVP.hash({
          resources: Ember.RSVP.all(resourcePromiseList),
          collection: collection,
          course: course,
          isEditing: !!isEditing,
          editingContent: params.editingContent
        });
      });
  },

  setupController(controller, model) {
    const route = this;
    model.collection.set('children', model.resources);
    controller.set('collection', model.collection);
    controller.set('course', model.course);
    controller.set('isEditing', model.isEditing);
    controller.set('editingContent', model.editingContent);

    route
      .get('centurySkillService')
      .findCenturySkills()
      .then(function(centurySkillsArray) {
        controller.set('centurySkills', centurySkillsArray.toArray());
      });

    if (model.isEditing || model.editingContent) {
      controller.set('tempCollection', model.collection.copy());
    }
  }
});
