import Ember from 'ember';
import { formatDate } from 'gooru-web/utils/utils';
import ModalMixin from 'gooru-web/mixins/modal';
import SessionMixin from 'gooru-web/mixins/session';

/**
 * Class activities controller
 *
 * Controller responsible of the logic for the teacher class activities tab
 */
export default Ember.Controller.extend(SessionMixin, ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * Class controller
   */
  classController: Ember.inject.controller('teacher.class'),

  /**
   * @requires service:api-sdk/class-activity
   */
  classActivityService: Ember.inject.service('api-sdk/class-activity'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     *
     * @function actions:changeVisibility
     */
    changeVisibility: function(classActivityId) {
      const controller = this;
      const currentClass = controller.get('classController.class');
      const classId = currentClass.get('id');
      const date = new Date();
      controller
        .get('classActivityService')
        .enableClassActivity(classId, classActivityId, date)
        .then(function() {
          const classActivity = controller
            .get('classActivities')[0]
            .classActivities.findBy('id', classActivityId);
          classActivity.set('date', date);
        });
    },

    /**
     *
     * @function actions:viewMore
     */
    viewMore: function() {
      const controller = this;
      const currentClass = controller.get('classController.class');
      const year = controller.get('year');
      const month = controller.get('month');
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      if (!this.get('loadingMore')) {
        this.set('loadingMore', true);
        controller
          .get('classActivityService')
          .findClassActivities(
            currentClass.get('id'),
            undefined,
            startDate,
            endDate
          )
          .then(function(classActivities) {
            controller.get('classActivities').pushObject(
              Ember.Object.create({
                classActivities: classActivities,
                date: formatDate(startDate, 'MMMM, YYYY')
              })
            );
            if (month - 1 >= 0) {
              controller.set('month', month - 1);
            } else {
              controller.set('month', 11);
              controller.set('year', year - 1);
            }
            controller.set('loadingMore', false);
          });
      }
    },

    /**
     *
     * @function actions:removeClassActivity
     */
    removeClassActivity: function(classActivity) {
      let controller = this;
      let currentClassId = controller.get('classController.class.id');
      let classActivityId = classActivity.get('id');
      let classActivityType = classActivity.get('collection.collectionType');
      var model = {
        type: classActivityType,
        deleteMethod: function() {
          return controller
            .get('classActivityService')
            .removeClassActivity(currentClassId, classActivityId);
        },
        callback: {
          success: function() {
            controller.removeClassActivity(classActivity);
          }
        }
      };
      this.actions.showModal.call(
        this,
        'content.modals.gru-remove-class-activity',
        model
      );
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Contains classActivity objects
   * @property {classActivity[]} classActivities
   */
  classActivities: null,

  /**
   * If loading more is currently running
   * @property {Boolean} loadingMore
   */
  loadingMore: false,

  /**
   * Contains current month
   * @property {int} month
   */
  month: null,

  /**
   * Contains current year
   * @property {int} year
   */
  year: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Removes a class activity from a list of classActivities
   * @param {classActivity} classActivity
   */
  removeClassActivity: function(classActivity) {
    let allClassActivities = this.get('classActivities');
    allClassActivities.forEach(classActivities => {
      let activityToDelete = classActivities.classActivities.findBy(
        'id',
        classActivity.get('id')
      );
      classActivities.classActivities.removeObject(activityToDelete);
    });
  }
});
