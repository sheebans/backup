import Ember from 'ember';
import { formatDate } from 'gooru-web/utils/utils';
/**
 * Class activities controller
 *
 * Controller responsible of the logic for the student class activities tab
 */

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  classController: Ember.inject.controller('student.class'),

  /**
   * @requires service:api-sdk/class-activity
   */
  classActivityService: Ember.inject.service('api-sdk/class-activity'),

  // -------------------------------------------------------------------------
  // Attributes

  // -------------------------------------------------------------------------
  // Actions
  actions: {},

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Contains classActivity objects
   * @property {classActivity[]} classActivities
   */
  classActivities: null,

  date: formatDate(new Date(), 'MMM. Do. YYYY'),

  /**
   * @property {Class}
   */
  class: Ember.computed.alias('classController.class')

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
