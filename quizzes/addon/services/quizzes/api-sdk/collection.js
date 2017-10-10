import Ember from 'ember';
import CollectionSerializer from 'quizzes-addon/serializers/collection/collection';
import CollectionAdapter from 'quizzes-addon/adapters/collection/collection';

/**
 * @typedef {Object} CollectionService
 */
export default Ember.Service.extend({
  /**
   * @property {CollectionSerializer} collectionSerializer
   */
  collectionSerializer: null,

  /**
   * @property {CollectionAdapter} collectionAdapter
   */
  collectionAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'collectionSerializer',
      CollectionSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'collectionAdapter',
      CollectionAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Gets a Collection by id
   * @param {string} collectionId
   * @param {string} type collection|assessment
   * @param {boolean} refresh
   * @returns {Promise.<Collection>}
   */
  readCollection: function(collectionId, type, refresh = false) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('collectionAdapter')
        .readCollection(collectionId, type, refresh)
        .then(function(responseData) {
          resolve(
            service
              .get('collectionSerializer')
              .normalizeReadCollection(responseData)
          );
        }, reject);
    });
  },

  /**
   * Notifies a collection change
   * @param {string} collectionId
   * @param {string} type collection|assessment
   * @returns {Promise.<boolean>}
   */
  notifyCollectionChange: function(collectionId, type) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve) {
      service.readCollection(collectionId, type, true).then(
        function() {
          resolve();
        },
        function() {
          resolve();
        }
      );
    });
  }
});
