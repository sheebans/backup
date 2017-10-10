import Ember from 'ember';
import ReportData from 'gooru-web/models/result/report-data';
/**
 * Teacher Analytics Collection Report
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type CollectionService
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @type AssessmentService
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),

  /**
   * @type LessonService
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),
  /**
   * @type UnitService
   */
  unitService: Ember.inject.service('api-sdk/unit'),
  /**
   * @type AnalyticsService
   */
  analyticsService: Ember.inject.service('api-sdk/analytics'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  model: function(params) {
    const route = this;
    const unitId = params.unitId;
    const lessonId = params.lessonId;
    const collectionId = params.collectionId;
    const classModel = route.modelFor('teacher.class').class;
    const classId = classModel.get('id');
    const courseId = classModel.get('courseId');
    const members = classModel.get('members');
    const unit = this.get('unitService').fetchById(courseId, unitId);
    const lesson = this.get('lessonService').fetchById(
      courseId,
      unitId,
      lessonId
    );

    return Ember.RSVP
      .hashSettled({
        collection: route.get('collectionService').readCollection(collectionId),
        assessment: route.get('assessmentService').readAssessment(collectionId)
      })
      .then(function(hash) {
        const collectionFound = hash.assessment.state === 'rejected';
        const collection = collectionFound
          ? hash.collection.value
          : hash.assessment.value;
        const collectionType = collection.get('collectionType');

        return route
          .get('analyticsService')
          .findResourcesByCollection(
            classId,
            courseId,
            unitId,
            lessonId,
            collectionId,
            collectionType
          )
          .then(function(userResourcesResults) {
            return Ember.RSVP.hash({
              unit: unit,
              lesson: lesson,
              collection: collection.toPlayerCollection(),
              members: members,
              userResults: userResourcesResults
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
    const collection = model.collection;
    const reportData = ReportData.create({
      students: model.members,
      resources: collection.get('resources')
    });
    reportData.merge(model.userResults);

    controller.set('collection', collection);
    controller.set('reportData', reportData);
    controller.set('showFilters', false);

    controller.set('students', model.members);
    controller.set('resources', collection.get('children'));

    controller.get('classController').selectMenuItem('performance');
  }
});
