import Ember from 'ember';
import SearchSerializer from 'gooru-web/serializers/search/search';
import SearchAdapter from 'gooru-web/adapters/search/search';

/**
 * Service to support the Search of Collections and Resources
 *
 * @typedef {Object} SearchService
 */
export default Ember.Service.extend({
  searchSerializer: null,

  searchAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'searchSerializer',
      SearchSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'searchAdapter',
      SearchAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Search for collections
   *
   * @param term the term to search
   * @param params
   * @param resetPagination indicates if the pagination needs a reset
   * @returns {Promise}
   */
  searchCollections: function(term, params, resetPagination = false) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchCollections(term, params, resetPagination)
        .then(function(response) {
          resolve(
            service.get('searchSerializer').normalizeSearchCollections(response)
          );
        }, reject);
    });
  },

  /**
   * Search for assessments
   *
   * @param term the term to search
   * @param params
   * @param resetPagination indicates if the pagination needs a reset
   * @returns {Promise}
   */
  searchAssessments: function(term, params, resetPagination = false) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchAssessments(term, params, resetPagination)
        .then(function(response) {
          resolve(
            service.get('searchSerializer').normalizeSearchAssessments(response)
          );
        }, reject);
    });
  },

  /**
   * Search for resources
   *
   * @param term the term to search
   * @param params
   * @param resetPagination indicates if the pagination needs a reset
   * @returns {Promise.<Resource[]>}
   */
  searchResources: function(term, params, resetPagination = false) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchResources(term, params, resetPagination)
        .then(
          function(response) {
            resolve(
              service.get('searchSerializer').normalizeSearchResources(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search for questions
   *
   * @param term the term to search
   * @param params
   * @param resetPagination indicates if the pagination needs a reset
   * @returns {Promise.<Question[]>}
   */
  searchQuestions: function(term, params, resetPagination = false) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchQuestions(term, params, resetPagination)
        .then(
          function(response) {
            resolve(
              service.get('searchSerializer').normalizeSearchQuestions(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search for featured courses
   *
   * @param term the term to search
   * @returns {Promise.<Question[]>}
   */
  searchFeaturedCourses: function(term) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('searchAdapter').searchFeaturedCourses(term).then(
        function(response) {
          resolve(
            service.get('searchSerializer').normalizeSearchCourses(response)
          );
        },
        function(error) {
          reject(error);
        }
      );
    });
  },

  /**
   * Search for courses
   *
   * @param term the term to search
   * @returns {Promise.<Question[]>}
   */
  searchCourses: function(term) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('searchAdapter').searchCourses(term).then(
        function(response) {
          resolve(
            service.get('searchSerializer').normalizeSearchCourses(response)
          );
        },
        function(error) {
          reject(error);
        }
      );
    });
  }
});
