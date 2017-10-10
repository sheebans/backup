import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';

export default Ember.Route.extend(PrivateRouteMixin, {
  queryParams: {
    collectionId: {},
    isCollection: {},
    editing: {}
  },
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:api-sdk/question
   */
  questionService: Ember.inject.service('api-sdk/question'),

  /**
  * @requires service:api-sdk/assessment
  */
  assessmentService: Ember.inject.service('api-sdk/assessment'),

  /**
   * @requires service:api-sdk/collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Events
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('collectionId', undefined);
      controller.set('isCollection', undefined);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  model: function(params) {
    const route = this;
    const questionId = params.questionId;
    const collectionId = params.collectionId;
    const isCollection = params.isCollection === 'true';
    const isEditing = params.editing;

    var question = null;
    var collection = null;

    if (questionId) {
      question = route.get('questionService').readQuestion(questionId);
    }

    if (collectionId) {
      if (isCollection) {
        collection = route
          .get('collectionService')
          .readCollection(collectionId);
      } else {
        collection = route
          .get('assessmentService')
          .readAssessment(collectionId);
      }
    }

    return Ember.RSVP.hash({
      question: question,
      collection: collection,
      isCollection: isCollection,
      isEditing: !!isEditing
    });
  },

  setupController(controller, model) {
    controller.set('question', model.question);
    controller.set('collection', model.collection);
    controller.set('isCollection', model.isCollection);
    controller.set('isEditing', model.isEditing);
  }
});
