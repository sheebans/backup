import Ember from 'ember';
import ResourceComponent from 'quizzes-addon/components/player/resources/qz-resource';

/**
 * Youtube resource component
 *
 * Component responsible for controlling the logic and appearance of the youtube resource type
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-viewer.js
 * @augments Ember/Component
 **/

export default ResourceComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-youtube-resource'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  aspectRatio: {
    width: 16,
    height: 9
  },

  /**
   * @property {string}Begin playing the video at the given number of seconds from the start of the video
   */
  start: Ember.computed('resource.displayGuide.start_time', function() {
    const component = this;
    return component.get('resource.displayGuide.start_time')
      ? component.convertToSeconds(this.get('resource.displayGuide.start_time'))
      : null;
  }),

  /**
   * @property {string}The time, measured in seconds from the start of the video, when the player should stop playing the video
   */
  stop: Ember.computed('resource.displayGuide.end_time', function() {
    const component = this;
    return component.get('resource.displayGuide.end_time')
      ? component.convertToSeconds(this.get('resource.displayGuide.end_time'))
      : 0;
  }),

  /**
   * @property {string} full resource youtube url
   */
  youtubeUrl: Ember.computed('resource.body', function() {
    const Env = Ember.getOwner(this).resolveRegistration('config:environment');
    const url = this.get('resource.body');
    const youtubeId = this.getYoutubeIdFromUrl(url);
    const player = Env.player.youtubePlayerUrl;
    const start = this.get('start');
    const stop = this.get('stop');
    return `${player}${youtubeId}?start=${start}&end=${stop}&rel=0`;
  }),

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Convert the time in this format 00:00:00 to seconds
   */
  convertToSeconds: function(time) {
    var sections = time.split(':');
    return (
      parseInt(sections[0] * 3600) +
      parseInt(sections[1] * 60) +
      parseInt(sections[2])
    );
  },

  /**
   * Retrieves the youtube id from a url
   * @param url
   * @returns {*}
   */
  getYoutubeIdFromUrl: function(url) {
    const regexp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regexp);
    if (match && match[2].length === 11) {
      return match[2];
    }
  }
});
