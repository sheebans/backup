import Ember from 'ember';
import AccordionMixin from 'gooru-web/mixins/gru-accordion';
import { CONTENT_TYPES } from 'gooru-web/config/config';

// Whenever the observer 'parsedLocationChanged' is running, this flag is set so
// clicking on the lessons should not update the location
var isUpdatingLocation = false;

/**
 * Accordion Lesson
 *
 * Component responsible for behaving as an accordion and listing a set of collections/assessments.
 * It is meant to be used inside of an {@link ./gru-accordion-course|Accordion Unit}
 *
 * @module
 * @augments Ember/Component
 * @mixes mixins/gru-accordion
 */
export default Ember.Component.extend(AccordionMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),

  /**
   * @requires service:api-sdk/collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @requires service:api-sdk/course-location
   */
  courseLocationService: Ember.inject.service('api-sdk/course-location'),

  /**
   * @requires service:api-sdk/performance
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  /**
   * @requires service:api-sdk/learner
   */
  learnerService: Ember.inject.service('api-sdk/learner'),

  /**
   * @requires service:api-sdk/course-map
   */
  courseMapService: Ember.inject.service('api-sdk/course-map'),

  /**
   * @requires service:api-sdk/analytics
   */
  analyticsService: Ember.inject.service('api-sdk/analytics'),

  /**
   * @requires service:api-sdk/profile
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @requires service:api-sdk/assessment
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),
  /**
   * @type {ClassService} Service to retrieve class information
   */
  classService: Ember.inject.service('api-sdk/class'),

  /**
   * @property {ClassActivityService}
   */
  classActivityService: Ember.inject.service('api-sdk/class-activity'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-accordion-lesson', 'panel', 'panel-default'],

  classNameBindings: ['isExpanded:expanded'],

  tagName: 'li',

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Load the data for this lesson (data should only be loaded once) and trigger
     * the 'onLessonUpdate' event handler
     *
     * @function actions:selectLesson
     * @returns {undefined}
     */
    selectLesson: function(lessonId) {
      this.set('isResourceSelected', false);
      if (!isUpdatingLocation) {
        let updateValue = this.get('isExpanded') ? '' : lessonId;
        this.get('onSelectLesson')(updateValue);
        this.set('showLocation', false);
      } else if (!this.get('isExpanded')) {
        this.loadData();
      }
    },

    /**
     * @function goLive
     */
    goLive: function(collectionId) {
      this.sendAction('onGoLive', collectionId);
    },

    /**
     * @function actions:selectResource
     * @param {string} collection - (collection/assessment)
     */
    selectResource: function(collection) {
      if (this.get('isTeacher')) {
        let lessonId = this.get('model.id');
        this.get('onSelectResource')(lessonId, collection);
      } else {
        this.activeStudyPlayer(collection);
        this.set('isResourceSelected', true);
      }
    },

    setOnAir: function(collectionId) {
      this.get('onLaunchOnAir')(collectionId);
    },

    /**
     * Opens the study player
     *
     * @function actions:studyNow
     * @param {string} type - collection or assessment
     * @param {string} item - collection, assessment, lesson or resource
     */
    studyNow: function(type, item) {
      let lessonId = this.get('model.id');
      if (type === 'lesson') {
        this.get('onStudyNow')(type, item.id, this.get('items')[0]);
      } else {
        this.get('onStudyNow')(type, lessonId, item);
      }
    },

    /**
     * Add to class activity
     *
     * @function actions:addToClassActivities
     */
    addToClassActivities: function(collection) {
      const classId = this.get('currentClass.id');
      const context = {
        courseId: this.get('currentClass.courseId'),
        unitId: this.get('unitId'),
        lessonId: this.get('model.id')
      };
      this.get('classActivityService')
        .addActivityToClass(
          classId,
          collection.get('id'),
          collection.get('collectionType'),
          context
        )
        .then(function() {
          collection.set('isAddedToClassActivities', true);
        });
    },
    /**
     * @function changeVisibility
     * @param {boolean} isChecked
     * @param {Assessment} item
     */
    changeVisibility: function(isChecked, item) {
      const component = this;
      const classId = component.get('currentClass.id');
      let type = item.isAssessment ? 'assessment' : 'collection';
      let contentId = item.get('id');
      component
        .get('classService')
        .updateContentVisibility(classId, contentId, isChecked, type)
        .then(function() {
          item.set('visible', isChecked);
          component.sendAction(
            'onUpdateContentVisibility',
            item.get('id'),
            isChecked
          );
        });
    }
  },

  // -------------------------------------------------------------------------
  // Events
  setupComponent: Ember.on('didInsertElement', function() {
    const component = this;

    this.set('activeElement', this.get('currentResource'));

    this.$().on('hide.bs.collapse', function(e) {
      e.stopPropagation();
      component.set('isExpanded', false);
    });

    this.$().on('show.bs.collapse', function(e) {
      e.stopPropagation();
      component.set('isExpanded', true);
    });
    Ember.run.scheduleOnce('afterRender', this, this.parsedLocationChanged);
  }),

  didRender: function() {
    this.$('[data-toggle="tooltip"]').tooltip();
  },

  removeSubscriptions: Ember.on('willDestroyElement', function() {
    this.$().off('hide.bs.collapse');
    this.$().off('show.bs.collapse');
  }),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @prop {String[]} parsedLocation - Location the user has navigated to
   * parsedLocation[0] - unitId
   * parsedLocation[1] - lessonId
   * parsedLocation[2] - resourceId
   */
  parsedLocation: [],

  /**
   * @property {string} go live action name
   */
  onGoLive: 'goLive',

  /**
   * @prop {String} - Id of the unit this lesson belongs to
   */
  unitId: null,

  /**
   * Contains only visible units
   * @property {Unit[]} units
   */
  collections: null,

  /**
   * @prop {String} userLocation - Location of a user in a course
   */
  userLocation: null,

  /**
   * @prop {Ember.RSVP.Promise} usersLocation - Users enrolled in the course
   * Will resolve to {Location[]}
   */
  usersLocation: Ember.A([]),

  /**
   * @prop {Boolean} isStudent
   *
   */
  isStudent: Ember.computed.not('isTeacher'),

  /**
   * @prop {Boolean} isResourceSelected
   *
   */
  isResourceSelected: false,

  /**
   * Check it's nu course version or not
   * @type {Boolean}
   */
  isNUCourse: false,

  /**
   * Check if study now button should be disabled
   * @type {Boolean}
   */
  studyNowDisabled: Ember.computed('items', function() {
    return (
      this.get('items.length') === 1 && !this.get('items')[0].get('visible')
    );
  }),

  /**
   * @prop {Boolean} Indicate if the lesson is selected as active element to study
   */
  isLessonSelected: Ember.computed(
    'isExpanded',
    'isStudent',
    'isResourceSelected',
    'showLocation',
    function() {
      return (
        this.get('isStudent') &&
        this.get('isExpanded') &&
        !this.get('isResourceSelected') &&
        !this.get('showLocation')
      );
    }
  ),

  /**
   * Indicates the status of the spinner
   * @property {Boolean}
   */
  loading: false,

  /**
   * Toggle Options
   * @property {Ember.Array}
   */
  switchOptions: Ember.A([
    Ember.Object.create({
      label: 'On',
      value: true
    }),
    Ember.Object.create({
      label: 'Off',
      value: false
    })
  ]),

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observe when the 'items' promise has resolved and proceed to add the
   * corresponding users information (coming from a separate service) to each
   * one of the items so they are resolved in one single loop in the template.
   */
  addUsersToItems: Ember.observer('items', 'usersLocation', function() {
    if (this.get('items.length')) {
      let component = this;
      let visibleItems = this.get('items');
      let usersLocation = component.get('usersLocation');
      visibleItems.forEach(item => {
        // Get the users for a specific lesson
        let entity = usersLocation.findBy('collection', item.get('id'));
        if (entity) {
          entity.get('locationUsers').then(locationUsers => {
            item.set('users', locationUsers);
          });
        }
      });
    }
  }),

  /**
   * Observe changes to 'parsedLocation' to update the accordion's status
   * (expanded/collapsed).
   */
  parsedLocationChanged: Ember.observer('parsedLocation.[]', function() {
    const parsedLocation = this.get('parsedLocation');
    if (parsedLocation) {
      isUpdatingLocation = true;
      let lessonId = parsedLocation[1];
      this.updateAccordionById(lessonId);
      isUpdatingLocation = false;
    }
  }),
  /**
   * Observe changes when expands or collapse a lesson.
   */
  removedActiveLocation: Ember.observer('isExpanded', function() {
    if (this.get('isStudent') && !this.get('isExpanded')) {
      this.set('activeElement', '');
    }
  }),
  /**
   * Removed the selected element if the user decide to show the current location
   */
  showMyLocation: Ember.observer('showLocation', function() {
    if (this.get('showLocation')) {
      this.set('activeElement', '');
    }
  }),
  // -------------------------------------------------------------------------
  // Methods

  /**
   * Load the collections for the lesson
   *
   * @function
   * @returns {undefined}
   */
  loadData: function() {
    const component = this;
    const userId = component.get('session.userId');
    const classId = component.get('currentClass.id');
    const courseId =
      component.get('currentClass.courseId') ||
      component.get('currentCourse.id');
    const unitId = component.get('unitId');
    const lessonId = component.get('model.id');
    const classMembers = component.get('classMembers');
    const isTeacher = component.get('isTeacher');
    let collections = Ember.A();
    let lessonPeers = Ember.A();

    component.set('loading', true);

    let peersPromise = classId
      ? component
        .get('analyticsService')
        .getLessonPeers(classId, courseId, unitId, lessonId)
      : Ember.RSVP.resolve(lessonPeers);

    return Ember.RSVP
      .hash({
        lesson: component
          .get('courseMapService')
          .getLessonInfo(classId, courseId, unitId, lessonId),
        peers: peersPromise
      })
      .then(({ lesson, peers }) => {
        collections = lesson.get('children');
        lessonPeers = peers;

        let loadDataPromise = Ember.RSVP.resolve();
        if (classId) {
          isTeacher
            ? component
              .loadTeacherData(
                classId,
                courseId,
                unitId,
                lessonId,
                classMembers,
                lessonPeers,
                collections
              )
              .then(function() {
                loadDataPromise = component.loadCollectionData(
                  classId,
                  courseId,
                  unitId,
                  lessonId,
                  classMembers,
                  collections
                );
              })
            : (loadDataPromise = component.loadStudentData(
              userId,
              classId,
              courseId,
              unitId,
              lessonId,
              classMembers,
              lessonPeers,
              collections
            ));
        } else {
          loadDataPromise = component.loadLearnerData(
            courseId,
            unitId,
            lessonId,
            classMembers,
            lessonPeers,
            collections
          );
        }
        return loadDataPromise;
      })
      .then(() => {
        if (!component.isDestroyed) {
          collections.forEach(collection =>
            component.setVisibility(collection)
          );
          component.set('items', collections);
          component.set('loading', false);
        }
      });
  },
  loadTeacherData: function(
    classId,
    courseId,
    unitId,
    lessonId,
    classMembers,
    lessonPeers,
    collections
  ) {
    const component = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      component
        .get('performanceService')
        .findClassPerformanceByUnitAndLesson(
          classId,
          courseId,
          unitId,
          lessonId,
          classMembers
        )
        .then(function(performance) {
          const promises = collections.map(function(collection) {
            const isAssessment = collection.get('format') === 'assessment';
            const collectionId = collection.get('id');
            const peer = lessonPeers.findBy('id', collectionId);
            const assessmentDataPromise = isAssessment
              ? component.get('assessmentService').readAssessment(collectionId)
              : Ember.RSVP.resolve(true);

            return assessmentDataPromise.then(function(assessmentData) {
              const averageScore = performance.calculateAverageScoreByItem(
                collectionId
              );
              const timeSpent = performance.calculateAverageTimeSpentByItem(
                collectionId
              );
              const completionDone = performance.calculateSumCompletionDoneByItem(
                collectionId
              );
              const completionTotal = performance.calculateSumCompletionTotalByItem(
                collectionId
              );
              collection.set(
                'performance',
                Ember.Object.create({
                  score: averageScore,
                  hasStarted: averageScore > 0 || timeSpent > 0,
                  isDisabled: isAssessment
                    ? !assessmentData.get('classroom_play_enabled')
                    : undefined,
                  isCompleted:
                    completionDone > 0 && completionDone >= completionTotal
                })
              );

              if (peer) {
                return component
                  .get('profileService')
                  .readMultipleProfiles(peer.get('peerIds'))
                  .then(function(profiles) {
                    collection.set('members', profiles);
                  });
              }
            });
          });
          Ember.RSVP.all(promises).then(resolve, reject);
        });
    });
  },

  loadCollectionData: function(
    classId,
    courseId,
    unitId,
    lessonId,
    classMembers,
    collections
  ) {
    const component = this;
    return new Ember.RSVP.Promise(function() {
      component
        .get('performanceService')
        .findClassPerformanceByUnitAndLesson(
          classId,
          courseId,
          unitId,
          lessonId,
          classMembers,
          { collectionType: CONTENT_TYPES.COLLECTION }
        )
        .then(function(performance) {
          collections.map(function(collection) {
            const isCollection = collection.get('format') === 'collection';
            const timeSpent = performance.calculateAverageTimeSpentByItem(
              collection.get('id')
            );
            if (isCollection) {
              collection.set('performance.timeSpent', timeSpent);
              collection.set('performance.hasStarted', timeSpent > 0);
            }
          });
          Ember.RSVP.resolve(true);
        });
    });
  },

  loadStudentData: function(
    userId,
    classId,
    courseId,
    unitId,
    lessonId,
    classMembers,
    lessonPeers,
    collections
  ) {
    const component = this;
    const isResourceSelected = collections.findBy(
      'id',
      this.get('activeElement')
    );

    component.set('isResourceSelected', isResourceSelected);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      const classMinScore = component.get('currentClass.minScore');
      Ember.RSVP
        .hash({
          performanceAssessment: component
            .get('performanceService')
            .findStudentPerformanceByLesson(
              userId,
              classId,
              courseId,
              unitId,
              lessonId,
              collections,
              { collectionType: CONTENT_TYPES.ASSESSMENT }
            ),
          performanceCollection: component
            .get('performanceService')
            .findStudentPerformanceByLesson(
              userId,
              classId,
              courseId,
              unitId,
              lessonId,
              collections,
              { collectionType: CONTENT_TYPES.COLLECTION }
            )
        })
        .then(({ performanceAssessment, performanceCollection }) => {
          let assessments = performanceAssessment.filterBy(
            'type',
            'assessment'
          );
          let collection = performanceCollection.filterBy('type', 'collection');
          let performance = assessments.concat(collection);
          const promises = collections.map(function(collection) {
            const collectionId = collection.get('id');
            const isAssessment = collection.get('format') === 'assessment';
            const isResource =
              collection.get('format') !== 'assessment' &&
              collection.get('format') !== 'assessment-external' &&
              collection.get('format') !== 'collection';
            const peer = lessonPeers.findBy('id', collectionId);
            if (peer) {
              component
                .get('profileService')
                .readMultipleProfiles(peer.get('peerIds'))
                .then(function(profiles) {
                  collection.set('members', profiles);
                });
            }

            collection.set('isResource', isResource);

            const collectionPerformanceData = performance.findBy(
              'id',
              collectionId
            );
            if (collectionPerformanceData) {
              const score = collectionPerformanceData.get('score');
              const timeSpent = collectionPerformanceData.get('timeSpent');
              const completionDone = collectionPerformanceData.get(
                'completionDone'
              );
              const completionTotal = collectionPerformanceData.get(
                'completionTotal'
              );

              const hasStarted = score > 0 || timeSpent > 0;
              const isCompleted =
                completionDone > 0 && completionDone >= completionTotal;
              const hasTrophy =
                score && score > 0 && classMinScore && score >= classMinScore;

              collectionPerformanceData.set('timeSpent', timeSpent);
              collectionPerformanceData.set('hasTrophy', hasTrophy);
              collectionPerformanceData.set('hasStarted', hasStarted);
              collectionPerformanceData.set('isCompleted', isCompleted);

              collection.set('performance', collectionPerformanceData);

              let showTrophy =
                collection.get('performance.hasTrophy') &&
                component.get('isStudent') &&
                !collection.get('collectionSubType');
              collection.set('showTrophy', showTrophy);

              const attempts = collectionPerformanceData.get('attempts');

              if (isAssessment) {
                return component
                  .get('assessmentService')
                  .readAssessment(collectionId)
                  .then(function(assessment) {
                    const attemptsSettings = assessment.get('attempts');
                    if (attemptsSettings) {
                      const noMoreAttempts =
                        attempts &&
                        attemptsSettings > 0 &&
                        attempts >= attemptsSettings;
                      collectionPerformanceData.set(
                        'noMoreAttempts',
                        noMoreAttempts
                      );
                      collectionPerformanceData.set(
                        'isDisabled',
                        !assessment.get('classroom_play_enabled')
                      );
                    }
                  });
              } else {
                return Ember.RSVP.resolve(true);
              }
            }
          });
          Ember.RSVP.all(promises).then(resolve, reject);
        });
    });
  },

  loadLearnerData: function(
    courseId,
    unitId,
    lessonId,
    classMembers,
    lessonPeers,
    collections
  ) {
    const component = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const classMinScore = component.get('currentClass.minScore');
      Ember.RSVP
        .hash({
          performanceAssessment: component
            .get('learnerService')
            .fetchPerformanceLesson(
              courseId,
              unitId,
              lessonId,
              CONTENT_TYPES.ASSESSMENT
            ),
          performanceCollection: component
            .get('learnerService')
            .fetchPerformanceLesson(
              courseId,
              unitId,
              lessonId,
              CONTENT_TYPES.COLLECTION
            )
        })
        .then(({ performanceAssessment, performanceCollection }) => {
          let performance = performanceAssessment.concat(performanceCollection);
          const promises = collections.map(function(collection) {
            const collectionId = collection.get('id');
            const isAssessment = collection.get('format') === 'assessment';
            const isResource =
              collection.get('format') !== 'assessment' &&
              collection.get('format') !== 'assessment-external' &&
              collection.get('format') !== 'collection';
            const peer = lessonPeers.findBy('id', collectionId);
            if (peer) {
              component
                .get('profileService')
                .readMultipleProfiles(peer.get('peerIds'))
                .then(function(profiles) {
                  collection.set('members', profiles);
                });
            }

            collection.set('isResource', isResource);

            const collectionPerformanceData = performance.findBy(
              'collectionId',
              collectionId
            );
            if (collectionPerformanceData) {
              const score = collectionPerformanceData.get('scoreInPercentage');
              const timeSpent = collectionPerformanceData.get('timeSpent');
              const completionDone = collectionPerformanceData.get(
                'completedCount'
              );
              const completionTotal = collectionPerformanceData.get(
                'totalCount'
              );
              const hasStarted = score > 0 || timeSpent > 0;
              const isCompleted =
                completionDone > 0 && completionDone >= completionTotal;
              const hasTrophy =
                score && score > 0 && classMinScore && score >= classMinScore;

              collectionPerformanceData.set('timeSpent', timeSpent);
              collectionPerformanceData.set('hasTrophy', hasTrophy);
              collectionPerformanceData.set('hasStarted', hasStarted);
              collectionPerformanceData.set('isCompleted', isCompleted);

              collection.set('performance', collectionPerformanceData);

              let showTrophy =
                collection.get('performance.hasTrophy') &&
                component.get('isStudent') &&
                !collection.get('collectionSubType');
              collection.set('showTrophy', showTrophy);

              const attempts = collectionPerformanceData.get('attempts');
              if (isAssessment) {
                return component
                  .get('assessmentService')
                  .readAssessment(collectionId)
                  .then(function(assessment) {
                    const attemptsSettings = assessment.get('attempts');
                    if (attemptsSettings) {
                      const noMoreAttempts =
                        attempts &&
                        attemptsSettings > 0 &&
                        attempts >= attemptsSettings;
                      collectionPerformanceData.set(
                        'noMoreAttempts',
                        noMoreAttempts
                      );
                      collectionPerformanceData.set(
                        'isDisabled',
                        !assessment.get('classroom_play_enabled')
                      );
                    }
                  });
              } else {
                return Ember.RSVP.resolve(true);
              }
            }
          });
          Ember.RSVP.all(promises).then(resolve, reject);
        });
    });
  },
  /**
   * Select an element as active element to study
   */
  activeStudyPlayer: function(item) {
    if (this.get('isStudent')) {
      if (this.get('activeElement') === item.id) {
        this.set('activeElement', '');
      } else {
        this.set('activeElement', item.id);
      }
      this.set('showLocation', false);
    }
  },
  setVisibility: function(collection) {
    if (this.get('currentClass')) {
      const isAssessment = collection.get('isAssessment');
      const visible = isAssessment
        ? this.get('contentVisibility').isVisible(collection.id)
        : true;
      collection.set('visible', visible);
    } else {
      collection.set('visible', true);
    }
  }
});
