import Ember from 'ember';
import PlayerRoute from 'gooru-web/routes/player';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';
import { CONTENT_TYPES } from 'gooru-web/config/config';

/**
 * Study Player Route
 *
 * The context player route extends the player route to provide the study player
 * controller with additional information available only to signed-in users
 *
 * @module
 * @extends PlayerRoute
 */
export default PlayerRoute.extend(PrivateRouteMixin, {
  templateName: 'study-player',

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
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send attempt related events
   */
  quizzesAttemptService: Ember.inject.service('quizzes/attempt'),

  /**
   * @dependency {i18nService} Service to retrieve translations information
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the submission is complete
     */
    onFinish: function() {
      let controller = this.get('controller');
      let profileId = this.get('session.userData.gooruUId');
      let contextId = controller.get('contextResult.contextId');
      let classId = controller.get('classId');
      let queryParams = {
        courseId: controller.get('course.id'),
        collectionId: controller.get('collection.id'),
        type: controller.get('type'),
        role: controller.get('role'),
        lessonId: controller.get('lessonId'),
        unitId: controller.get('unitId'),
        contextId,
        source: controller.get('source')
      };
      if (classId) {
        queryParams.classId = classId;
      }
      const navigateMapService = this.get('navigateMapService');
      this.get('quizzesAttemptService')
        .getAttemptIds(contextId, profileId)
        .then(
          attemptIds =>
            !attemptIds || !attemptIds.length
              ? {}
              : this.get('quizzesAttemptService').getAttemptData(
                attemptIds[attemptIds.length - 1]
              )
        )
        .then(attemptData =>
          Ember.RSVP.hash({
            attemptData,
            mapLocation: navigateMapService.getStoredNext()
          })
        )
        .then(({ mapLocation, attemptData }) => {
          mapLocation.context.set('score', attemptData.get('averageScore'));
          return navigateMapService.next(mapLocation.context);
        })
        .then(() =>
          this.transitionTo('reports.study-student-collection', { queryParams })
        );
    },

    /**
     * When a pre-test needs to be loaded
     */
    loadPreTest: function() {
      const navigateMapService = this.get('navigateMapService');
      navigateMapService
        .getStoredNext()
        .then(mapLocation => navigateMapService.next(mapLocation.context))
        .then(() => this.refresh());
    }
  },

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
        elementSelector: '.header-panel .course-info',
        title: route.get('i18n').t('gru-take-tour.study-player.stepTwo.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepTwo.description')
      },
      {
        elementSelector: '.header-panel .suggest-player',
        title: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepSeven.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepSeven.description')
      },
      {
        elementSelector: '.header-panel .performance-info',
        title: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepThree.title'),
        description: route
          .get('i18n')
          .t('gru-take-tour.study-player.stepThree.description')
      },
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

        params.type =
          mapLocation.get('context.itemType') ||
          mapLocation.get('context.collectionType');
        if (params.type === CONTENT_TYPES.EXTERNAL_ASSESSMENT) {
          route.transitionTo('study-player-external');
        }

        return Ember.RSVP
          .hash({
            //loading breadcrumb information and navigation info
            course: route.get('courseService').fetchById(courseId),
            unit: route.get('unitService').fetchById(courseId, unitId),
            lesson: route
              .get('lessonService')
              .fetchById(courseId, unitId, lessonId)
          })
          .then(function(hash) {
            //setting query params using the map location
            params.collectionId =
              mapLocation.get('context.itemId') ||
              mapLocation.get('context.collectionId');
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

            //loads the player model if it has no suggestions
            return route.playerModel(params).then(function(model) {
              return Object.assign(model, {
                tourSteps: tourSteps,
                course: hash.course,
                unit: hash.unit,
                lesson: hash.lesson,
                mapLocation,
                collectionId: params.collectionId,
                type: params.type
              });
            });
          });
      });
  },

  setupController(controller, model) {
    this._super(...arguments);
    const isAnonymous = model.isAnonymous;
    const mapLocation = model.mapLocation;
    controller.setProperties({
      steps: model.tourSteps,
      course: model.course,
      unit: model.unit,
      lesson: model.lesson,
      showConfirmation:
        model.collection &&
        !(model.collection.get('isCollection') || isAnonymous), //TODO: move to computed
      mapLocation: model.mapLocation,
      classId: mapLocation.get('context.classId'),
      //setting query params variables using the map location
      unitId: mapLocation.get('context.unitId'),
      lessonId: mapLocation.get('context.lessonId'),
      collectionId: model.collectionId,
      courseId: mapLocation.get('context.courseId'),
      type: model.type
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
