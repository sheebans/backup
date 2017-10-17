import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import ConfigurationMixin from 'gooru-web/mixins/configuration';
import ContextMixin from 'gooru-web/mixins/quizzes/context';
import QuizzesPlayer from 'quizzes-addon/routes/player';
import { ROLES, PLAYER_EVENT_SOURCE } from 'gooru-web/config/config';

/**
 * @typedef { Ember.Route } PlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default QuizzesPlayer.extend(
  ModalMixin,
  ConfigurationMixin,
  ContextMixin,
  {
    templateName: 'player',

    // -------------------------------------------------------------------------
    // Dependencies

    /**
   * @property {Ember.Service} Service to retrieve an assessment
   */
    assessmentService: Ember.inject.service('api-sdk/assessment'),
    /**
   * @type {ProfileService} Service to retrieve profile information
   */
    profileService: Ember.inject.service('api-sdk/profile'),

    /**
   * @property {Ember.Service} Service to retrieve a collection
   */
    collectionService: Ember.inject.service('api-sdk/collection'),
    /**
   * @property {Collection} carries a  new collection Object called from the service.
   */
    collectionObj: null,

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
   * @property {Ember.Service} session service
   */
    session: Ember.inject.service('session'),

    // -------------------------------------------------------------------------
    // Actions
    actions: {
      /**
   * When closing the player
   */
      onClosePlayer: function() {
        const $appContainer = Ember.$('.app-container');
        if ($appContainer.hasClass('navigator-on')) {
          $appContainer.removeClass('navigator-on');
        }
        var route = !this.get('history.lastRoute.name')
          ? 'index'
          : this.get('history.lastRoute.url');
        this.transitionTo(route);
      },
      /**
   * Action triggered to remix the collection
   */
      onRemixCollection: function() {
        let collection = this.get('collectionObj');
        if (this.get('session.isAnonymous')) {
          this.send('showModal', 'content.modals.gru-login-prompt');
        } else {
          var remixModel = {
            content: collection
          };
          if (collection.get('isCollection')) {
            this.send(
              'showModal',
              'content.modals.gru-collection-remix',
              remixModel
            );
          } else {
            this.send(
              'showModal',
              'content.modals.gru-assessment-remix',
              remixModel
            );
          }
        }
      },

      /**
     * When the submission is complete
     */
      onFinish: function() {
        let controller = this.get('controller');
        let queryParams = {
          collectionId: controller.get('collection.id'),
          type: controller.get('type'),
          role: controller.get('role'),
          classId: controller.get('classId'),
          contextId: controller.get('contextResult.contextId')
        };
        const reportController = this.controllerFor(
          'reports.student-collection'
        );

        //this doesn't work when refreshing the page, TODO
        reportController.set('backUrl', this.get('history.lastRoute.url'));
        this.transitionTo('reports.student-collection', { queryParams });
      },

      startAssessment: function() {
        const controller = this.get('controller');
        controller.startAssessment();
      },

      /**
     * Navigates to the assessment report
     */
      navigateToReport: function() {
        const route = this;
        const controller = route.get('controller');
        let context = controller.get('context');
        let collection = controller.get('collection');
        const queryParams = {
          collectionId: context.get('collectionId'),
          userId: controller.get('session.userId'),
          type: collection.get('collectionType'),
          role: controller.get('role')
        };
        if (context.get('classId')) {
          queryParams.classId = context.get('classId');
        }
        if (context.get('courseId')) {
          queryParams.courseId = context.get('courseId');
          queryParams.unitId = context.get('unitId');
          queryParams.lessonId = context.get('lessonId');
        }

        const reportController = route.controllerFor(
          'reports.student-collection'
        );

        //this doesn't work when refreshing the page, TODO
        reportController.set('backUrl', route.get('history.lastRoute.url'));
        route.transitionTo('reports.student-collection', {
          queryParams: queryParams
        });
      },

      /**
     * On navigator remix collection button click
     * @param {Collection} collection
     */
      remixCollection: function(collection) {
        var remixModel = {
          content: collection
        };
        if (collection.get('isCollection')) {
          this.send(
            'showModal',
            'content.modals.gru-collection-remix',
            remixModel
          );
        } else {
          this.send(
            'showModal',
            'content.modals.gru-assessment-remix',
            remixModel
          );
        }
      }
    },

    // -------------------------------------------------------------------------
    // Properties

    // -------------------------------------------------------------------------
    // Methods

    /**
   * @param {{ collectionId: string, resourceId: string }} params
   */
    model(params) {
      return this.playerModel(params);
    },

    setupController(controller, model) {
      console.log(model);
      this._super(...arguments);
      const isAnonymous = model.isAnonymous;
      const isTeacher = this.get('profile.role') === ROLES.TEACHER;
      controller.set('isTeacher', isTeacher);
      controller.set('isAnonymous', isAnonymous);
    },

    /**
   * Loads the player model
   * @param params
   * @returns {Promise.<TResult>}
     */
    playerModel: function(params) {
      const route = this;
      const userId = route.get('session.userId');
      if (userId !== 'anonymous') {
        route
          .get('profileService')
          .readUserProfile(userId)
          .then(function(updatedProfile) {
            route.set('profile', updatedProfile);
          });
      }
      const collectionId = params.collectionId;
      const type = params.type;
      const role = params.role || ROLES.TEACHER;
      params.sourceUrl = location.host;
      params.partnerId = this.get('session.partnerId');
      params.tenantId = this.get('session.tenantId');
      params.notCheckAttempts =
        params.source !== PLAYER_EVENT_SOURCE.COURSE_MAP;

      return route
        .loadCollection(collectionId, type)
        .then(function(collection) {
          route.set('collectionObj', collection);
          params.type = collection.get('collectionType');
          return route.createContext(
            params,
            collection,
            role === ROLES.STUDENT
          );
        })
        .then(function({ id }) {
          params.contextId = id;
          params.role = route.get('profile.role');
          params.isTeacher = route.get('profile.role') === ROLES.TEACHER;
          params.profileId = route.get('session.userData.gooruUId');
          return route.quizzesModel(params);
        });
    },

    /**
   * Loads the collection
   * @param {string} collectionId
   * @param {string} type
   * @returns {Promise.<Collection>}
     */
    loadCollection: function(collectionId, type) {
      const route = this;
      const isCollection = type === 'collection';
      const isAssessment = type === 'assessment';
      const loadAssessment = !type || isAssessment;
      const loadCollection = !type || isCollection;

      return Ember.RSVP
        .hashSettled({
          assessment: loadAssessment
            ? route.get('assessmentService').readAssessment(collectionId)
            : false,
          collection: loadCollection
            ? route.get('collectionService').readCollection(collectionId)
            : false
        })
        .then(function(hash) {
          let collectionFound =
            hash.assessment.state === 'rejected' ||
            hash.assessment.value === false;
          return collectionFound
            ? hash.collection.value
            : hash.assessment.value;
        });
    },

    deactivate: function() {
      this.get('controller').resetValues();
    }
  }
);
