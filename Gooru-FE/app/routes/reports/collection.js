import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';
import ContextMixin from 'gooru-web/mixins/quizzes/context';
import QuizzesReport from 'quizzes-addon/routes/reports/context';

/**
 * Route for collection/assessment report
 *
 * Gathers and passes initialization data for class performance
 * from analytics to the controller
 *
 * @module
 * @augments ember/Route
 */
export default QuizzesReport.extend(PrivateRouteMixin, ContextMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  tourService: Ember.inject.service('tours'),

  collectionService: Ember.inject.service('api-sdk/collection'),

  assessmentService: Ember.inject.service('api-sdk/assessment'),

  classService: Ember.inject.service('api-sdk/class'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    navigateBack: function() {
      var route = !this.get('history.lastRoute.name')
        ? 'index'
        : this.get('history.lastRoute.url');
      this.transitionTo(route);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  model: function(params) {
    const route = this;
    const collectionId = params.collectionId;
    const classId = params.classId;
    const anonymous = params.anonymous;
    let collection;

    // Get initialization data from analytics
    return route
      .get('assessmentService')
      .readAssessment(collectionId)
      .then(function(assessment) {
        collection = assessment;
        return route.createContext(params, collection, true);
      })
      .then(function({ id }) {
        params.type = collection.get('collectionType');
        params.contextId = id;
        params.anonymous = anonymous;
        return route.get('classService').readClassMembers(classId);
      })
      .then(classMembers => {
        params.students = classMembers.members;
        return route
          .quizzesModel(params)
          .then(model => Object.assign(model, { classId }));
      });
  },

  setupController: function(controller, model) {
    this._super(...arguments);
    controller.set('classId', model.classId);
  }
});
