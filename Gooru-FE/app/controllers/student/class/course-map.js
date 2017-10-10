import Ember from 'ember';
/**
 * Content map controller
 *
 * Controller responsible of the logic for the course map page
 */
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  studentClassController: Ember.inject.controller('student.class'),

  // -------------------------------------------------------------------------
  // Attributes

  queryParams: ['location'],

  /**
   * Combination of unit, lesson and resource (collection or assessment)
   * separated by a plus sign
   * @example
   * location='uId001+lId002+cId003'
   */
  location: null,

  isFirstLoad: true,

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Update 'location' (bound query param)
     *
     * @function
     * @param {String} newLocation - String of the form 'unitId[+lessonId[+resourceId]]'
     * @returns {undefined}
     */
    updateLocation: function(newLocation) {
      this.set('location', newLocation);
    },
    /**
     * Locate the user in is actual location
     *
     * @function
     * @param {String} location'
     * @returns {undefined}
     */
    locateMe: function(location) {
      this.set('location', location);
      this.set('showLocation', true);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop {String} userLocation - Location of a user in a course
   * String of the form 'unitId[+lessonId[+resourceId]]'
   */
  userLocation: null,

  /**
   * A link to the parent class controller
   * @see controllers/class.js
   * @property {Class}
   */
  class: Ember.computed.alias('studentClassController.class'),

  /**
   *Show the current location
   */
  showLocation: true,

  /**
   * A link to the content visibility from class controller
   * @see controllers/class.js
   * @property {ClassContentVisibility}
   */
  contentVisibility: Ember.computed.alias(
    'studentClassController.contentVisibility'
  ),

  openingLocation: Ember.computed('location', function() {
    if (this.get('isFirstLoad')) {
      this.set('isFirstLoad', false);
      var location = this.get('location') || this.get('userLocation');
      this.set('location', location);
      return location;
    } else {
      return this.get('location') || '';
    }
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
