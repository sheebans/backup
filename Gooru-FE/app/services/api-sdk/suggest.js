import Ember from 'ember';
import SuggestAdapter from 'gooru-web/adapters/suggest/suggest';
import SuggestSerializer from 'gooru-web/serializers/suggest/suggest';
import SuggestContext from 'gooru-web/models/suggest/suggest-context';

/**
 * Service to support the suggest functionality
 *
 * Country, State, District
 *
 * @typedef {Object} SuggestService
 */
export default Ember.Service.extend({
  suggestSerializer: null,

  suggestAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'suggestAdapter',
      SuggestAdapter.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'suggestSerializer',
      SuggestSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Gets resource suggestions for an specific collection/assessment in a course
   * @param {string} userId
   * @param {string} courseId
   * @param {string} unitId
   * @param {string} lessonId
   * @param {string} collectionId
   * @param {number} score
   * @param {number} timeSpent
   * @returns {Promise.<Resource[]>}
   */
  suggestResourcesForCollectionInCourse: function(
    userId,
    courseId,
    unitId,
    lessonId,
    collectionId,
    score = undefined,
    timeSpent = undefined
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const context = SuggestContext.create({
        collectionId: collectionId,
        userId: userId,
        courseId: courseId,
        unitId: unitId,
        lessonId: lessonId,
        score: score,
        timeSpent: timeSpent
      });
      service
        .get('suggestAdapter')
        .suggestResourcesForCollection(context)
        .then(function(response) {
          resolve(
            service.get('suggestSerializer').normalizeSuggestResources(response)
          );
        }, reject);
    });
  },

  /**
   * Gets resource suggestions for an specific collection/assessment
   * @param {string} userId
   * @param {string} collectionId
   * @param {number} score
   * @param {number} timeSpent
   * @returns {Promise.<Resource[]>}
   */
  suggestResourcesForCollection: function(
    userId,
    collectionId,
    score = undefined,
    timeSpent = undefined
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const context = SuggestContext.create({
        collectionId: collectionId,
        userId: userId,
        score: score,
        timeSpent: timeSpent
      });
      service
        .get('suggestAdapter')
        .suggestResourcesForCollection(context)
        .then(function(response) {
          resolve(
            service.get('suggestSerializer').normalizeSuggestResources(response)
          );
        }, reject);
    });
  },

  /**
   * Gets resource suggestions for an specific resource in a course
   * @param {string} userId
   * @param {string} courseId
   * @param {string} unitId
   * @param {string} lessonId
   * @param {string} collectionId
   * @param {string} resourceId
   * @returns {Promise.<Resource[]>}
   */
  suggestResourcesForResourceInCourse: function(
    userId,
    courseId,
    unitId,
    lessonId,
    collectionId,
    resourceId
  ) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const context = SuggestContext.create({
        containerId: collectionId,
        userId: userId,
        courseId: courseId,
        unitId: unitId,
        lessonId: lessonId
      });
      service
        .get('suggestAdapter')
        .suggestResourcesForResource(resourceId, context)
        .then(function(response) {
          resolve(
            service.get('suggestSerializer').normalizeSuggestResources(response)
          );
        }, reject);
    });
  },

  /**
   * Gets resource suggestions for an specific resource
   * @param {string} userId
   * @param {string} resourceId
   * @returns {Promise.<Resource[]>}
   */
  suggestResourcesForResource: function(userId, resourceId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const context = SuggestContext.create({
        userId: userId
      });
      service
        .get('suggestAdapter')
        .suggestResourcesForResource(resourceId, context)
        .then(function(response) {
          resolve(
            service.get('suggestSerializer').normalizeSuggestResources(response)
          );
        }, reject);
    });
  }
});
