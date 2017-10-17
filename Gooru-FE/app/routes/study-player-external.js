import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';

export default Ember.Route.extend(PrivateRouteMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service('session'),

  /**
   * @property {NavigateMapService}
   */
  navigateMapService: Ember.inject.service('api-sdk/navigate-map'),

  /**
   * @property {Ember.Service} Service to retrieve an assessment
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),

  /**
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @type {UnitService} Service to retrieve course information
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @type {UnitService} Service to retrieve unit information
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  /**
   * @type {LessonService} Service to retrieve lesson information
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),

  /**
   * @dependency {i18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Methods
  model: function(params) {
    const route = this;

    //Steps for Take a Tour functionality
    const tourSteps = Ember.A([
      {
        title: route.get('i18n').t('gru-take-tour.study-player.stepOne.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepOne.description')
      },
      {
        elementSelector: '.header-panel .course-info .course-title',
        title: route.get('i18n').t('gru-take-tour.study-player.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepTwo.description')
      },
      {
        elementSelector: '.header-panel .performance-info .performance',
        title: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepThree.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepThree.description')
      },
      {
        elementSelector: '.header-panel .course-info .actions .course-map',
        title: route.get('i18n').t('gru-take-tour.study-player.stepFive.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepFive.description')
      },
      /*{
       elementSelector: '.header-panel .performance-info .suggestions',
       title: route.get('i18n').t('gru-take-tour.study-player.stepSeven.title'),
       description: route.get('i18n').t('gru-take-tour.study-player.stepSeven.description')
       },*/
      {
        title: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepEight.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepEight.description')
      }
    ]);
    return route
      .get('navigateMapService')
      .getStoredNext()
      .then(function(mapLocation) {
        const courseId = mapLocation.get('context.courseId');
        const unitId = mapLocation.get('context.unitId');
        const lessonId = mapLocation.get('context.lessonId');
        params.collectionId =
          mapLocation.get('context.itemId') ||
          mapLocation.get('context.collectionId');

        return Ember.RSVP
          .hash({
            //loading breadcrumb information and navigation info
            course: route.get('courseService').fetchById(courseId),
            unit: route.get('unitService').fetchById(courseId, unitId),
            lesson: route
              .get('lessonService')
              .fetchById(courseId, unitId, lessonId),
            collection:  route.get('collectionService').readCollection(params.collectionId)
          })
          .then(function(hash) {
            //setting query params using the map location

            params.type =
              mapLocation.get('context.itemType') ||
              mapLocation.get('context.collectionType');
            params.classId =
              params.classId || mapLocation.get('context.classId');
            params.unitId = params.unitId || mapLocation.get('context.unitId');
            params.lessonId =
              params.lessonId || mapLocation.get('context.lessonId');
            params.pathId = params.pathId || mapLocation.get('context.pathId');
            params.collectionSubType =
              params.subtype || mapLocation.get('context.collectionSubType');

            // Set the correct unit sequence number
            hash.course.children.find((child, index) => {
              let found = false;
              if (child.get('id') === hash.unit.get('id')) {
                found = true;
                hash.unit.set('sequence', index + 1);
              }
              return found;
            });

            // Set the correct lesson sequence number
            hash.unit.children.find((child, index) => {
              let found = false;
              if (child.get('id') === hash.lesson.get('id')) {
                found = true;
                hash.lesson.set('sequence', index + 1);
              }
              return found;
            });
            return Ember.RSVP.hash({
              ourSteps: tourSteps,
              course: hash.course,
              unit: hash.unit,
              lesson: hash.lesson,
              collection: hash.collection,
              mapLocation,
              collectionId: params.collectionId,
              type: params.type
            });
          });
      });
  },

  setupController(controller, model) {
    this._super(...arguments);
    const isAnonymous = model.isAnonymous;
    const mapLocation = model.mapLocation;
    console.log(model.collection);
    controller.setProperties({
      steps: model.tourSteps,
      course: model.course,
      unit: model.unit,
      lesson: model.lesson,
      collection: model.collection,
      showConfirmation:
        model.collection &&
        !(model.collection.get('isCollection') || isAnonymous), //TODO: move to computed
      mapLocation: model.mapLocation,
      classId: mapLocation.get('context.classId'),
      //setting query params variables using the map location
      unitId: mapLocation.get('context.unitId'),
      lessonId: mapLocation.get('context.lessonId'),
      collectionId: model.collectionId,
      type: model.type,
      content: mapLocation.content
    });
  },

  /**
   * Gets the map location for the study player based on parameters
   * @param params
   * @returns {*}
   */
  getMapLocation: function(params) {
    const route = this;
    const classId = params.classId;
    const courseId = params.courseId;
    const unitId = params.unitId;
    const lessonId = params.lessonId;
    const collectionType = params.type;
    const collectionId = params.collectionId;
    const pathId = params.pathId;
    const collectionSubType = params.subtype;

    const continueCourse = !unitId;
    const startLesson = lessonId && !collectionId;

    const navigateMapService = route.get('navigateMapService');

    let mapLocationPromise = null;
    if (continueCourse) {
      mapLocationPromise = navigateMapService
        .getCurrentMapContext(courseId, classId)
        .then(mapContext => navigateMapService.next(mapContext, false));
    } else if (startLesson) {
      mapLocationPromise = navigateMapService.startLesson(
        courseId,
        unitId,
        lessonId,
        classId
      );
    } else if (collectionSubType) {
      mapLocationPromise = navigateMapService.startSuggestion(
        courseId,
        unitId,
        lessonId,
        collectionId,
        collectionType,
        collectionSubType,
        pathId,
        classId
      );
    } else {
      mapLocationPromise = navigateMapService.startCollection(
        courseId,
        unitId,
        lessonId,
        collectionId,
        collectionType,
        classId
      );
    }
    return mapLocationPromise;
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
