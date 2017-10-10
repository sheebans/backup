import Ember from 'ember';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

/**
 *
 * Controls the access to the analytics data for a
 * student related to a collection of resources
 *
 */

export default Ember.Controller.extend(ConfigurationMixin, {
  queryParams: [
    'classId',
    'courseId',
    'unitId',
    'lessonId',
    'collectionId',
    'userId',
    'type',
    'role',
    'contextId',
    'source'
  ],
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:api-sdk/taxonomy
   */
  taxonomyService: Ember.inject.service('api-sdk/taxonomy'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} indicates if it is collection or assessment
   */
  type: null,

  /**
   * @property {string} indicates if it is a student or teacher view
   */
  role: null,

  /**
   * Indicates the component of the application that is originating the events
   * @property {String} source
   */
  source: null,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Fill standards info when the report data changes
   */
  quizzesAttemptDataObserver: Ember.observer('attemptData', function() {
    let learningTargets = this.get('attemptData.mastery')
      ? this.get('attemptData.mastery')
      : [];
    if (learningTargets.length) {
      let taxonomyIds = learningTargets.mapBy('id');
      let taxonomyService = this.get('taxonomyService');
      taxonomyService
        .fetchCodesByIds(taxonomyIds)
        .then(function(taxonomyStandards) {
          learningTargets.forEach(function(learningTarget) {
            let learningTargetInfo = taxonomyStandards.findBy(
              'id',
              learningTarget.id
            );
            learningTarget.setProperties({
              displayCode: learningTargetInfo.code,
              description: learningTargetInfo.title
            });
          });
        });
    }
  })
});
