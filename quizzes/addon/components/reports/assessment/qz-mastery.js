import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Handle event triggered by gru-learning-target
     */
    bubbleSelect: function(bubbleOption) {
      this.sendAction('onBubbleSelect', bubbleOption);
    }
  },
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-mastery'],
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {AssessmentResult} assessment
   */
  assessmentResult: null,

  /**
   * List of learning targets to be displayed by the component
   *
   * @constant {Array}
   */
  learningTargets: null
});
