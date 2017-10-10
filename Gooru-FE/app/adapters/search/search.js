import Ember from 'ember';
import ResourceModel from 'gooru-web/models/content/resource';
import QuestionModel from 'gooru-web/models/content/question';
import { DEFAULT_SEARCH_PAGE_SIZE } from 'gooru-web/config/config';

/**
 * Adapter to support the Search for Collections, Assessments, Resources and Questions
 *
 * @typedef {Object} SearchAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/gooru-search/rest/v2/search',

  /**
   * Fetches the collections that match with the term
   *
   * @param term the term to search
   * @param resetPagination indicates if the pagination needs a reset
   * @returns {Promise.<Collection[]>}
   */
  searchCollections: function(term, params = {}, resetPagination = false) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/scollection`;
    const page = !params.page || resetPagination ? 0 : params.page;
    const pageSize = params.pageSize || DEFAULT_SEARCH_PAGE_SIZE;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: adapter.defineHeaders(),
      data: {
        q: term || '*',
        'flt.collectionType': 'collection',
        'flt.publishStatus': 'published',
        start: page + 1,
        length: pageSize
      }
    };
    const taxonomies = params.taxonomies;
    if (Ember.isArray(taxonomies) && taxonomies.length > 0) {
      options.data['flt.standard'] = taxonomies.join(',');
    }

    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches the assessments that match with the term
   *
   * @param term the term to search
   * @param params
   * @param resetPagination indicates if the pagination needs a reset
   * @returns {Promise.<Assessment[]>}
   */
  searchAssessments: function(term, params = {}, resetPagination = false) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/scollection`;
    const page = !params.page || resetPagination ? 0 : params.page;
    const pageSize = params.pageSize || DEFAULT_SEARCH_PAGE_SIZE;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: adapter.defineHeaders(),
      data: {
        q: term || '*',
        'flt.collectionType': 'assessment',
        'flt.publishStatus': 'published',
        start: page + 1, //page starts at one
        length: pageSize
      }
    };
    const taxonomies = params.taxonomies;
    if (Ember.isArray(taxonomies) && taxonomies.length > 0) {
      options.data['flt.standard'] = taxonomies.join(',');
    }

    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches the resources that match with the term
   *
   * @param term the term to search
   * @param resetPagination indicates if the pagination needs a reset
   * @returns {Promise.<Resource[]>}
   */
  searchResources: function(term, params = {}, resetPagination = false) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/resource`;
    const page = !params.page || resetPagination ? 0 : params.page;
    const pageSize = params.pageSize || DEFAULT_SEARCH_PAGE_SIZE;
    let options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: adapter.defineHeaders(),
      data: {
        q: term || '*',
        start: page + 1,
        length: pageSize,
        'flt.contentFormat': 'resource',
        'flt.publishStatus': 'published'
      }
    };
    const formats = params.formats;
    if (Ember.isArray(formats) && formats.length > 0) {
      const filters = ResourceModel.serializeAllResourceFormat(formats);
      options.data['flt.resourceFormat'] = filters.join(',');
    }
    const taxonomies = params.taxonomies;
    if (Ember.isArray(taxonomies) && taxonomies.length > 0) {
      options.data['flt.standard'] = taxonomies.join(',');
    }
    const courseId = params.courseId;
    if (courseId) {
      options.data['flt.courseId'] = courseId;
    }
    const publishStatus = params.publishStatus;
    if (publishStatus) {
      options.data['flt.publishStatus'] = publishStatus;
    }
    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches the questions that match with the term
   *
   * @param term the term to search
   * @param {*}
   * @param resetPagination indicates if the pagination needs a reset
   * @returns {Promise.<Question[]>}
   */
  searchQuestions: function(term, params = {}, resetPagination = false) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/resource`;
    const page = !params.page || resetPagination ? 0 : params.page;
    const pageSize = params.pageSize || DEFAULT_SEARCH_PAGE_SIZE;
    let options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: adapter.defineHeaders(),
      data: {
        q: term || '*',
        start: page + 1,
        length: pageSize,
        'flt.resourceFormat': 'question',
        'flt.publishStatus': 'published'
      }
    };
    const types = params.formats;
    if (Ember.isArray(types) && types.length > 0) {
      const formatFilters = QuestionModel.serializeAllQuestionType(types);
      options.data['flt.questionType'] = formatFilters.join(',');
    }
    const taxonomies = params.taxonomies;
    if (Ember.isArray(taxonomies) && taxonomies.length > 0) {
      options.data['flt.standard'] = taxonomies.join(',');
    }

    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches featured courses that match with the term
   *
   * @param term the term to search
   * @returns {Promise.<Course[]>}
   */
  searchFeaturedCourses: function(term) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/course`;
    let options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: adapter.defineHeaders(),
      data: {
        q: term || '*',
        start: 1,
        length: 50,
        'flt.courseType': 'featured'
      }
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Fetches courses that match with the term
   *
   * @param term the term to search
   * @returns {Promise.<Course[]>}
   */
  searchCourses: function(term) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/course`;
    let options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: adapter.defineHeaders(),
      data: {
        q: term || '*',
        start: 1,
        length: 20
      }
    };
    return Ember.$.ajax(url, options);
  },

  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
