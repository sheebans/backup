import Ember from 'ember';
import Serializable from 'quizzes-addon/mixins/serializable';

/**
 * Model for the status of a resource after it has been viewed by a user.
 *
 * @typedef {Object} ResourceResult
 *
 */
export default Ember.Object.extend(Serializable, {
  /**
   * Values: started / skipped
   *
   * @property {String}
   */
  attemptStatus: Ember.computed('correct', 'skipped', function() {
    const skipped = this.get('skipped');
    return skipped ? 'skipped' : 'started';
  }),

  /**
   * @property {boolean} isCorrect
   */
  isCorrect: Ember.computed('score', function() {
    return this.get('score') === 100;
  }),

  /**
   * @property {boolean} isQuestion
   */
  isQuestion: Ember.computed.not('isResource'),

  /**
   * @property {boolean} isQuestion
   */
  isResource: Ember.computed.bool('resource.isResource'),

  /**
   * @property {number} reaction - user reaction to the resource
   */
  reaction: 0,

  /**
   * @property {number} resource - the resource
   */
  resource: null,

  /**
   * @property {number} resourceId - ID of the resource
   */
  resourceId: null,

  /**
   * @property {number} savedTime - Current loaded time for the resource
   */
  savedTime: 0,

  /**
   * @property {number} skipped - if the resource was skipped
   */
  skipped: true,

  /**
   * @property {number} started - if the resource was started
   */
  started: Ember.computed.not('skipped'),

  /**
   * @property {number} startTime - Current start time for the resource
   */
  startTime: 0,

  /**
   * @property {number} stopTime - Current stop time for the resource
   */
  stopTime: 0,

  /**
   * @property {number} timeSpent - Time spent in this resource
   */
  timeSpentToSave: Ember.computed(
    'startTime',
    'stopTime',
    'savedTime',
    function() {
      const startTime = this.get('startTime') || 0;
      const stopTime = this.get('stopTime') || startTime;
      return this.roundMilliseconds(stopTime - startTime);
    }
  ),

  /**
   * @property {number} timeSpent - Time spent in this resource
   */
  timeSpent: Ember.computed('startTime', 'stopTime', 'savedTime', function() {
    const savedTime = this.get('savedTime') || 0;
    const startTime = this.get('startTime') || 0;
    const stopTime = this.get('stopTime') || startTime;
    return this.roundMilliseconds(savedTime + (stopTime - startTime));
  }),

  /**
   * @property {Number} updated keep track of updated to redraw realtime dashboard
   */
  updated: 0,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Clear properties
   */
  clear: function() {
    this.set('reaction', 0);
    this.set('savedTime', 0);
    this.set('startTime', 0);
    this.set('stopTime', 0);
  },

  /**
   * Round milliseconds
   */
  roundMilliseconds: function(milliseconds) {
    return milliseconds - milliseconds % 1000;
  }
});
