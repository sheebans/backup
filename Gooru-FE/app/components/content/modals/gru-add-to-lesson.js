import Ember from 'ember';
import AddToModal from 'gooru-web/components/content/modals/gru-add-to';
import CollectionSearch from 'gooru-web/models/search/content-search';
import { DEFAULT_PAGE_SIZE } from 'gooru-web/config/config';

export default AddToModal.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:api-sdk/lesson
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @property {Service} session
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'modals', 'gru-add-to-lesson'],

  classNameBindings: ['component-class'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Show more collection/Assessments results
     */
    showMoreResults: function() {
      this.showMoreResults();
    },
    updateContent: function(keyword) {
      this.findResults(keyword);
    },
    clearContent: function() {
      this.findResults('');
    }
  },
  copyContent: function() {
    return Ember.RSVP.resolve();
  },
  init() {
    this._super(...arguments);
    this.set(
      'searchObject',
      CollectionSearch.create(Ember.getOwner(this).ownerInjection(), {
        term: ''
      })
    );
  },
  addContent: function() {
    var collectionId = this.get('selectedCollection.id');
    var courseId = this.get('model.courseId');
    var unitId = this.get('model.unitId');
    var lessonId = this.get('content.id');
    var isCollection = this.get('isCollection');
    return this.get('lessonService').associateAssessmentOrCollectionToLesson(
      courseId,
      unitId,
      lessonId,
      collectionId,
      isCollection
    );
  },

  successMessage: function() {
    this.triggerAction({ action: 'closeModal' });
    this.get('notifications').setOptions({
      positionClass: 'toast-top-full-width',
      toastClass: 'gooru-toast',
      timeOut: 10000
    });
    var editRoute = this.get('isCollection')
      ? 'content.collections.edit'
      : 'content.assessments.edit';
    var contentEditUrl = this.get('router').generate(
      editRoute,
      this.get('selectedCollection.id')
    );
    var successMsg = this.get('i18n').t('common.add-to-lesson-success', {
      collectionTitle: this.get('selectedCollection.title'),
      collectionType: this.get('i18n').t(
        `common.${this.get('collectionType').toLowerCase()}`
      ),
      lessonTitle: this.get('content.title')
    });
    var edit = this.get('i18n').t('common.edit');
    this.get('notifications').success(
      `${successMsg} <a class="btn btn-success" href="${contentEditUrl}">${edit}</a>`
    );
    this.$('.modal-footer button.add-to').prop('disabled', false);
    if (this.get('onAdd')) {
      this.get('onAdd')(this.get('selectedCollection'));
    }
  },

  errorMessage: function(error) {
    var message = this.get('isCollection')
      ? 'common.errors.collection-not-added-to'
      : 'common.errors.assessment-not-added-to';
    var collectionType = this.get('i18n').t(
      `common.${this.get('collectionType').toLowerCase()}`
    );
    this.get('notifications').error(
      this.get('i18n').t(message, { collectionType }).string
    );
    Ember.Logger.error(error);
    this.$('.modal-footer button.add-to').prop('disabled', false);
  },

  showMoreResults: function() {
    const component = this;
    if (component.get('isCollection')) {
      const pagination = component.get('pagination');
      pagination.page = pagination.page + 1;

      component
        .get('profileService')
        .readCollections(component.get('session.userId'), pagination)
        .then(function(collections) {
          component.get('collections').pushObjects(collections.toArray());
        });
    } else {
      const pagination = this.get('pagination');
      pagination.page = pagination.page + 1;

      component
        .get('profileService')
        .readAssessments(component.get('session.userId'), pagination)
        .then(function(assessments) {
          component.get('collections').pushObjects(assessments.toArray());
        });
    }
  },
  findResults: function(keyword) {
    const component = this;
    const pagination = component.get('pagination');
    pagination.page = 0;
    pagination.searchText = keyword;
    if (component.get('isCollection')) {
      component
        .get('profileService')
        .readCollections(component.get('session.userId'), pagination)
        .then(function(collections) {
          component.set('collections', collections.toArray());
        });
    } else {
      component
        .get('profileService')
        .readAssessments(component.get('session.userId'), pagination)
        .then(function(assessments) {
          component.set('collections', assessments.toArray());
        });
    }
  },
  // -------------------------------------------------------------------------
  // Properties
  searchObject: '',
  /**
   * @type {Boolean} if it is showing collections
   */
  isCollection: Ember.computed.alias('model.isCollection'),

  /**
   * @type {Function} callback when the add is finished
   */
  onAdd: Ember.computed.alias('model.onAdd'),

  /**
   * @property {boolean} showMoreResultsButton
   */
  showMoreResultsButton: Ember.computed('collections.[]', function() {
    return (
      this.get('collections.length') &&
      this.get('collections.length') % this.get('pagination.pageSize') === 0
    );
  }),

  /**
   * @property {*}
   */
  pagination: {
    page: 1,
    filterBy: 'notInCourse',
    pageSize: DEFAULT_PAGE_SIZE
  }
});
