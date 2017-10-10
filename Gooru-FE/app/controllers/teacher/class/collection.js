import Ember from 'ember';

/**
 * Teacher Analytics Collection Report
 *
 * @module
 * @see routes/analytics/performance/teacher/collection.js
 * @augments ember/Controller
 */
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type classController
   */
  classController: Ember.inject.controller('teacher.class'),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * A link to the parent class controller
   * @see controllers/class.js
   * @property {Class}
   */
  class: Ember.computed.reads('classController.class'),

  /**
   * @property {User[]} class students
   */
  students: Ember.computed.reads('classController.members'),

  /**
   * @property {Collection} the selected collection
   */
  collection: null,

  /**
   * @property {ReportData} the selected collection report data
   */
  reportData: null,

  /**
   * Indicates if the report should be visible in anonymous
   * @property {boolean} anonymous
   */
  anonymous: false
});
