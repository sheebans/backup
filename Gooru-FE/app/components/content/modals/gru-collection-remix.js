import Ember from 'ember';
import RemixBaseModal from 'gooru-web/components/content/modals/gru-base-remix';

export default RemixBaseModal.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} Collection service API SDK
   */
  collectionService: Ember.inject.service('api-sdk/collection'),
  lessonService: Ember.inject.service('api-sdk/lesson'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'modals', 'gru-collection-remix'],

  // -------------------------------------------------------------------------
  // Actions

  copyContent: function(collection) {
    return this.get('collectionService').copyCollection(collection.get('id'));
  },

  updateContent: function(collection) {
    const component = this;
    return component
      .get('collectionService')
      .updateCollectionTitle(collection.get('id'), collection.get('title'))
      .then(function() {
        let courseId = component.get('courseId');
        let unitId = component.get('unitId');
        let lessonId = component.get('lessonId');
        let collectionId = component.get('contentModel.id');
        let isCollection = component.get('isCollection');
        return lessonId
          ? component
            .get('lessonService')
            .associateAssessmentOrCollectionToLesson(
              courseId,
              unitId,
              lessonId,
              collectionId,
              isCollection
            )
          : Ember.RSVP.resolve();
      });
  },

  showSuccessNotification: function(collection) {
    var component = this;
    var successMsg = component
      .get('i18n')
      .t('common.remix-collection-success', {
        collectionTitle: collection.get('title')
      });
    var collectionEditUrl = component
      .get('router')
      .generate('content.collections.edit', collection.get('id'));
    var edit = component.get('i18n').t('common.edit');
    component
      .get('notifications')
      .success(
        `${successMsg} <a class="btn btn-success" href="${collectionEditUrl}">${edit}</a>`
      );
  },

  showFailureNotification: function() {
    const message = this.get('i18n').t('common.errors.collection-not-copied')
      .string;
    this.get('notifications').error(message);
  },

  init: function() {
    this._super(...arguments);
    this.set('courseId', this.get('model.courseId'));
    this.set('unitId', this.get('model.unitId'));
    this.set('lessonId', this.get('model.lessonId'));
    this.set('isCollection', this.get('model.isCollection'));
  }
});
