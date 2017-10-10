import Ember from 'ember';

import { createDataMatrix } from 'gooru-web/utils/performance-data';

/**
 * Teacher Analytics Performance Route - Course/Unit Level
 *
 * Route responsible of the transitions and loading the model/data for the teacher class performance at course/unit level
 *
 * @module
 * @augments ember/Controller
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type CollectionService
   */
  collectionService: Ember.inject.service('api-sdk/collection'),
  /**
   * @type PerformanceService
   */
  performanceService: Ember.inject.service('api-sdk/performance'),
  /**
   * @type LessonService
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),
  /**
   * @type UnitService
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * navigateToAssessments
     */
    navigateToCollection: function(collectionId) {
      const unitId = this.get('controller.unit.id');
      const lessonId = this.get('controller.lesson.id');
      this.transitionTo(
        'class.analytics.performance.teacher.collection',
        unitId,
        lessonId,
        collectionId
      );
    },

    /**
     * Navigates to the assessment report
     */
    navigateToReport: function(performance, userPerformance) {
      if (!performance.get('isAverage')) {
        const route = this;

        const queryParams = {
          collectionId: performance.get('id'),
          userId: userPerformance.get('userId'),
          type: performance.get('collectionType'),
          role: 'teacher',
          classId: route.get('controller.class.id'),
          unitId: route.get('controller.unit.id'),
          lessonId: route.get('controller.lesson.id'),
          courseId: route.get('controller.course.id')
        };

        const reportController = route.controllerFor(
          'reports.student-collection'
        );

        //this doesn't work when refreshing the page, TODO
        var currentUrl = route.router.get('url');
        reportController.set('backUrl', currentUrl);
        route.transitionTo('reports.student-collection', {
          queryParams: queryParams
        });
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  model: function(params) {
    const route = this;
    const filterBy = route.paramsFor('class.analytics.performance.teacher')
      .filterBy;
    const unitId = params.unitId;
    const lessonId = params.lessonId;
    const classModel = route.modelFor('class').class;
    const classId = classModel.get('id');
    const courseId = classModel.get('courseId');
    const members = classModel.get('members');

    return route
      .get('unitService')
      .fetchById(courseId, unitId)
      .then(function(unit) {
        return route
          .get('lessonService')
          .fetchById(courseId, unitId, lessonId)
          .then(function(lesson) {
            const filteredCollections = lesson
              .get('children')
              .filter(function(collection) {
                return (
                  filterBy === 'both' || collection.get('format') === filterBy
                );
              });
            const classPerformanceData = route
              .get('performanceService')
              .findClassPerformanceByUnitAndLesson(
                classId,
                courseId,
                unitId,
                lessonId,
                members,
                { collectionType: filterBy }
              );
            return Ember.RSVP.hash({
              unit: unit,
              lesson: lesson,
              collections: filteredCollections,
              classPerformanceData: classPerformanceData
            });
          });
      });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('active', true);
    this.setupDataPickerOptions(controller);

    const performanceData = createDataMatrix(
      model.collections,
      model.classPerformanceData,
      'lesson'
    );
    controller.set('performanceDataMatrix', performanceData);
    controller.set('collections', model.collections);
    controller.set('unit', model.unit);
    controller.set('lesson', model.lesson);

    //updating the breadcrumb with the unit, useful when refreshing the page
    controller.get('teacherController').updateBreadcrumb(model.unit, 'unit');
    //updating the breadcrumb with the lesson
    controller
      .get('teacherController')
      .updateBreadcrumb(model.lesson, 'lesson');
    //updating the unit in the teacher controller
    controller.set('teacherController.unit', model.unit);
    //updating the lesson in the teacher controller
    controller.set('teacherController.lesson', model.lesson);
    //updating the collectionLevel to show or not the launch anonymous button
    controller.set('teacherController.collectionLevel', false);
    //updating the lessonLevel to show or not filters
    controller.set('teacherController.lessonLevel', true);
    //updating the performanceDataHeaders and performanceDataMatrix to download implementation
    controller.set(
      'teacherController.performanceDataHeaders',
      model.collections
    );
    controller.set('teacherController.performanceDataMatrix', performanceData);
  },
  /**
   * Setups data picker options for lesson
   * @param controller
   */
  setupDataPickerOptions: function(controller) {
    controller.set(
      'optionsCollectionsTeacher',
      Ember.A([
        Ember.Object.create({
          value: 'score',
          selected: true,
          readOnly: true,
          isDisabled: false
        }),
        Ember.Object.create({
          value: 'completion',
          selected: false,
          readOnly: false,
          isDisabled: true
        }),
        Ember.Object.create({
          value: 'time-spent',
          selected: true,
          readOnly: false,
          isDisabled: false
        })
      ])
    );

    controller.set(
      'mobileOptionsCollectionsTeacher',
      Ember.A([
        Ember.Object.create({
          value: 'score',
          selected: true,
          readOnly: false,
          isDisabled: false
        }),
        Ember.Object.create({
          value: 'completion',
          selected: false,
          readOnly: false,
          isDisabled: true
        }),
        Ember.Object.create({
          value: 'time-spent',
          selected: false,
          readOnly: false,
          isDisabled: false
        })
      ])
    );
    controller.get('teacherController').restoreSelectedOptions(true);
  },

  deactivate: function() {
    this.set('controller.active', false);
  }
});
