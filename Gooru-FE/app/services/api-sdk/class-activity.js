import Ember from 'ember';
import ClassActivityAdapter from 'gooru-web/adapters/content/class-activity';
import ClassActivitySerializer from 'gooru-web/serializers/content/class-activity';

/**
 * @typedef {Object} ClassActivityService
 */
export default Ember.Service.extend({
  /**
   * @property {PerformanceService} performanceService
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  /**
   * @property {ClassActivityAdapter} classActivityAdapter
   */
  classActivityAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'classActivitySerializer',
      ClassActivitySerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'classActivityAdapter',
      ClassActivityAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Adds a new content to class
   *
   * @param {string} classId
   * @param {string} contentId
   * @param {string} contentType
   * @param {Date} addedDate
   * @param { { courseId: string, unitId: string, lessonId: string } } context
   * @returns {boolean}
   */
  addActivityToClass: function(
    classId,
    contentId,
    contentType,
    addedDate = new Date(),
    context = {}
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('classActivityAdapter')
        .addActivityToClass(classId, contentId, contentType, addedDate, context)
        .then(function() {
          resolve(true);
        }, reject);
    });
  },

  /**
   * Enables the class content
   *
   * @param {string} classId
   * @param {string} classActivityId
   * @param {Date} activationDate
   * @returns {boolean}
   */
  enableClassActivity: function(
    classId,
    classActivityId,
    activationDate = new Date()
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('classActivityAdapter')
        .enableClassActivity(classId, classActivityId, activationDate)
        .then(function() {
          resolve(true);
        }, reject);
    });
  },

  /**
   * Gets all class activity for the authorized user (student|teacher)
   *
   * @param {string} classId
   * @param {string} contentType collection|assessment|resource|question
   * @param {Date} startDate optional start date, default is now
   * @param {Date} endDate optional end date, default is now
   * @returns {Promise.<ClassActivity[]>}
   */
  findClassActivities: function(
    classId,
    contentType = undefined,
    startDate = new Date(),
    endDate = new Date()
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('classActivityAdapter')
        .findClassActivities(classId, contentType, startDate, endDate)
        .then(function(payload) {
          const classActivities = service
            .get('classActivitySerializer')
            .normalizeFindClassActivities(payload);
          service
            .findClassActivitiesPerformanceSummary(
              classId,
              classActivities,
              startDate,
              endDate
            )
            .then(resolve, reject);
        });
    });
  },

  /**
   * Gets all class activity for the authorized user (student|teacher)
   *
   * @param {string} userId
   * @param {string} classId
   * @param {string} contentType collection|assessment|resource|question
   * @param {Date} startDate optional start date, default is now
   * @param {Date} endDate optional end date, default is now
   * @returns {Promise.<ClassActivity[]>}
   */
  findStudentClassActivities: function(
    userId,
    classId,
    contentType = undefined,
    startDate = new Date(),
    endDate = new Date()
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('classActivityAdapter')
        .findClassActivities(classId, contentType, startDate, endDate)
        .then(function(payload) {
          const classActivities = service
            .get('classActivitySerializer')
            .normalizeFindClassActivities(payload);
          service
            .findStudentActivitiesPerformanceSummary(
              userId,
              classId,
              classActivities,
              startDate,
              endDate
            )
            .then(resolve, reject);
        });
    });
  },

  /**
   * Gets all class activity for the authorized user (student|teacher)
   * @param {string} userId
   * @param {string} classId
   * @param {ClassActivity[]} classActivities
   * @param {Date} startDate optional start date, default is now
   * @param {Date} endDate optional end date, default is now
   * @returns {Promise.<ClassActivity[]>}
   */
  findStudentActivitiesPerformanceSummary: function(
    userId,
    classId,
    classActivities,
    startDate = new Date(),
    endDate = new Date()
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const assessmentIds = classActivities
        .filterBy('collection.isAssessment')
        .mapBy('collection.id');
      const collectionIds = classActivities
        .filterBy('collection.isCollection')
        .mapBy('collection.id');
      const performanceService = service.get('performanceService');
      Ember.RSVP
        .hash({
          activityCollectionPerformanceSummaryItems: collectionIds.length
            ? performanceService.findStudentActivityPerformanceSummaryByIds(
              userId,
              classId,
              collectionIds,
              'collection',
              startDate,
              endDate
            )
            : [],
          activityAssessmentPerformanceSummaryItems: assessmentIds.length
            ? performanceService.findStudentActivityPerformanceSummaryByIds(
              userId,
              classId,
              assessmentIds,
              'assessment',
              startDate,
              endDate
            )
            : []
        })
        .then(function(hash) {
          const activityCollectionPerformanceSummaryItems =
            hash.activityCollectionPerformanceSummaryItems;
          const activityAssessmentPerformanceSummaryItems =
            hash.activityAssessmentPerformanceSummaryItems;

          classActivities.forEach(function(classActivity) {
            const collection = classActivity.get('collection');
            const activityPerformanceSummary = collection.get('isAssessment')
              ? activityAssessmentPerformanceSummaryItems.findBy(
                'collectionPerformanceSummary.collectionId',
                collection.get('id')
              )
              : activityCollectionPerformanceSummaryItems.findBy(
                'collectionPerformanceSummary.collectionId',
                collection.get('id')
              );
            classActivity.set(
              'activityPerformanceSummary',
              activityPerformanceSummary
            );
          });

          resolve(classActivities);
        }, reject);
    });
  },

  /**
   * Gets all class activity for the authorized user (student|teacher)
   * @param {string} classId
   * @param {ClassActivity[]} classActivities
   * @param {Date} startDate optional start date, default is now
   * @param {Date} endDate optional end date, default is now
   * @returns {Promise.<ClassActivity[]>}
   */
  findClassActivitiesPerformanceSummary: function(
    classId,
    classActivities,
    startDate = new Date(),
    endDate = new Date()
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const assessmentIds = classActivities
        .filterBy('collection.isAssessment')
        .mapBy('collection.id');
      const collectionIds = classActivities
        .filterBy('collection.isCollection')
        .mapBy('collection.id');
      const performanceService = service.get('performanceService');
      Ember.RSVP
        .hash({
          activityCollectionPerformanceSummaryItems: collectionIds.length
            ? performanceService.findClassActivityPerformanceSummaryByIds(
              classId,
              collectionIds,
              'collection',
              startDate,
              endDate
            )
            : [],
          activityAssessmentPerformanceSummaryItems: assessmentIds.length
            ? performanceService.findClassActivityPerformanceSummaryByIds(
              classId,
              assessmentIds,
              'assessment',
              startDate,
              endDate
            )
            : []
        })
        .then(function(hash) {
          const activityCollectionPerformanceSummaryItems =
            hash.activityCollectionPerformanceSummaryItems;
          const activityAssessmentPerformanceSummaryItems =
            hash.activityAssessmentPerformanceSummaryItems;

          classActivities.forEach(function(classActivity) {
            const collection = classActivity.get('collection');
            const activityPerformanceSummary = collection.get('isAssessment')
              ? activityAssessmentPerformanceSummaryItems.findBy(
                'collectionPerformanceSummary.collectionId',
                collection.get('id')
              )
              : activityCollectionPerformanceSummaryItems.findBy(
                'collectionPerformanceSummary.collectionId',
                collection.get('id')
              );
            classActivity.set(
              'activityPerformanceSummary',
              activityPerformanceSummary
            );
          });

          resolve(classActivities);
        }, reject);
    });
  },

  /**
   * Remove class activity from class which is added
   * @param {string} classId The class id to delete
   * @param {string} contentId The content id to delete
   * @returns {Promise}
   */
  removeClassActivity: function(classId, contentId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('classActivityAdapter')
        .removeClassActivity(classId, contentId)
        .then(resolve, reject);
    });
  }
});
