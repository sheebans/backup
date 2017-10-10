import Ember from 'ember';
import PublicRouteMixin from 'gooru-web/mixins/public-route-mixin';
import ContextMixin from 'gooru-web/mixins/quizzes/context';
import QuizzesReport from 'quizzes-addon/routes/reports/student-context';
import { ROLES } from 'gooru-web/config/config';

/**
 *
 * Analytics data for a student related to a collection of resources
 * Gathers and passes the necessary information to the controller
 *
 * @module
 * @augments ember/Route
 */
export default QuizzesReport.extend(PublicRouteMixin, ContextMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  /**
   * @property {AssessmentService} Service to retrieve an assessment
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),

  /**
   * @property {CollectionService} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    goBack: function() {
      const route = this;
      const controller = route.get('controller');
      let toRoute = controller.get('backUrl');
      toRoute = toRoute || 'index'; //index when refreshing the page, TODO fix
      route.transitionTo(toRoute);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ assessmentId: string, resourceId: string }} params
   */
  model(params) {
    return this.studentCollectionModel(params);
  },

  /**
   * @param {{ assessmentId: string, resourceId: string }} params
   */
  studentCollectionModel: function(params) {
    const route = this;
    const collectionId = params.collectionId;
    const contextId = params.contextId;
    const type = params.type;
    const role = params.role || ROLES.TEACHER;

    const isCollection = type === 'collection';
    const isAssessment = type === 'assessment';

    const loadAssessment = !type || isAssessment;
    const loadCollection = !type || isCollection;

    let collection;

    return Ember.RSVP
      .hashSettled({
        assessment: loadAssessment
          ? route.get('assessmentService').readAssessment(collectionId)
          : false,
        collection: loadCollection
          ? route.get('collectionService').readCollection(collectionId)
          : false
      })
      .then(function(hash) {
        let collectionFound =
          hash.assessment.state === 'rejected' ||
          hash.assessment.value === false;
        collection = collectionFound
          ? hash.collection.value
          : hash.assessment.value;
        return contextId
          ? { id: contextId }
          : route.createContext(
            params,
            collection,
            params.role === ROLES.STUDENT
          );
      })
      .then(function({ id }) {
        params.profileId = route.get('session.userData.gooruUId');
        params.type = collection.get('collectionType');
        params.contextId = id;
        params.role = role;
        return route.quizzesModel(params);
      });
  },

  setupController(controller, model) {
    this._super(...arguments);
    if (model && model.collection) {
      controller.set('collection', model.collection);
    }
  }
});
