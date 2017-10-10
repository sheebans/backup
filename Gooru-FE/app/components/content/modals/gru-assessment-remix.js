import Ember from 'ember';
import RemixBaseModal from 'gooru-web/components/content/modals/gru-base-remix';

export default RemixBaseModal.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} Assessment service API SDK
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),
  lessonService: Ember.inject.service('api-sdk/lesson'),
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'modals', 'gru-assessment-remix'],

  // -------------------------------------------------------------------------
  // Actions

  copyContent: function(assessment) {
    return this.get('assessmentService').copyAssessment(assessment.get('id'));
  },

  updateContent: function(assessment) {
    const component = this;
    return component
      .get('assessmentService')
      .updateAssessmentTitle(assessment.get('id'), assessment.get('title'))
      .then(function() {
        let courseId = component.get('courseId');
        let unitId = component.get('unitId');
        let lessonId = component.get('lessonId');
        let assessmentId = component.get('contentModel.id');
        let isCollection = component.get('isCollection');
        return lessonId
          ? component
            .get('lessonService')
            .associateAssessmentOrCollectionToLesson(
              courseId,
              unitId,
              lessonId,
              assessmentId,
              isCollection
            )
          : Ember.RSVP.resolve();
      });
  },

  showSuccessNotification: function(assessment) {
    var component = this;
    var successMsg = component
      .get('i18n')
      .t('common.remix-assessment-success', {
        assessmentTitle: assessment.get('title')
      });
    var assessmentEditUrl = component
      .get('router')
      .generate('content.assessments.edit', assessment.get('id'));
    var edit = component.get('i18n').t('common.edit');
    component
      .get('notifications')
      .success(
        `${successMsg} <a class="btn btn-success" href="${assessmentEditUrl}">${edit}</a>`
      );
  },

  showFailureNotification: function() {
    const message = this.get('i18n').t('common.errors.assessment-not-copied')
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
