import Ember from 'ember';
import AccordionMixin from 'gooru-web/mixins/gru-accordion';
import { CONTENT_TYPES } from 'gooru-web/config/config';
// Whenever the observer 'parsedLocationChanged' is running, this flag is set so
// clicking on the units should not update the location
var isUpdatingLocation = false;

/**
 * Accordion Unit
 *
 * Component responsible for behaving as an accordion and listing a set of lessons.
 * It is meant to be used inside of an {@link ./gru-accordion-course|Accordion Course}
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
   * @requires service:api-sdk/lesson
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),

  /**
   * @requires service:api-sdk/unit
   */
  unitService: Ember.inject.service('api-sdk/unit'),

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
   * @requires service:api-sdk/analytics
   */
  analyticsService: Ember.inject.service('api-sdk/analytics'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-accordion-unit'],

  classNameBindings: ['isExpanded:expanded'],

  tagName: 'li',

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Launch an assessment on-air
     *
     * @function actions:launchOnAir
     */
    launchOnAir: function(collectionId) {
      this.get('onLaunchOnAir')(collectionId);
    },

    /**
     * @function goLive
     */
    goLive: function(collectionId) {
      this.sendAction('onGoLive', collectionId);
    },

    /**
     * Load the data for this unit (data should only be loaded once) and trigger
     * the 'onLocationUpdate' event handler with the unit information
     *
     * @function actions:selectUnit
     */
    selectUnit: function(unitId) {
      const courseId =
        this.get('currentClass.courseId') || this.get('currentCourse.id');
      if (!isUpdatingLocation) {
        let newLocation = this.get('isExpanded') ? '' : unitId;
        this.get('onLocationUpdate')(newLocation);
      } else if (!this.get('isExpanded')) {
        this.loadData(courseId, unitId);
      }
    },

    /**
     * @function actions:selectItem
     * @param {string} collection - collection or assessment
     * @see components/class/overview/gru-accordion-lesson
     */
    selectResource: function(lessonId, collection) {
      let unitId = this.get('model.id');
      this.get('onSelectResource')(unitId, lessonId, collection);
    },

    /**
     * @function studyNow
     * @param {string} type - lesson or collection
     * @param {string} lesson - lesson id
     * @param {string} item - collection, assessment, lesson or resource
     * @see components/class/overview/gru-accordion-lesson
     */
    studyNow: function(type, lesson, item) {
      let unitId = this.get('model.id');
      this.get('onStudyNow')(type, unitId, lesson, item);
    },

    /**
     * Trigger the 'onLocationUpdate' event handler with the unit and lesson information
     *
     * @function actions:updateLesson
     */
    updateLesson: function(lessonId) {
      const newLocation = lessonId
        ? `${this.get('model.id')}+${lessonId}`
        : this.get('model.id');
      this.get('onLocationUpdate')(newLocation);
    },
    /**
     * Trigger action to update content visibility list
     */
    updateContentVisibility: function(contentId, visible) {
      this.sendAction('onUpdateContentVisibility', contentId, visible);
    }
  },

  // -------------------------------------------------------------------------
  // Events
  setupComponent: Ember.on('didInsertElement', function() {
    const component = this;

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

  removeSubscriptions: Ember.on('willDestroyElement', function() {
    this.$().off('hide.bs.collapse');
    this.$().off('show.bs.collapse');
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop {Function} onLocationUpdate - Event handler
   */
  onLocationUpdate: null,

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
   * Contains only visible units
   * @property {Unit[]} units
   */
  lessons: null,

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
   * Indicates the status of the spinner
   * @property {Boolean}
   */
  loading: false,

  /**
   * Indicates if the current user is a student
   * @property {Boolean}
   */
  isStudent: null,

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
        // Get the users for a specific unit
        let entity = usersLocation.findBy('lesson', item.get('id'));
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

    if (parsedLocation.length) {
      isUpdatingLocation = true;

      let unitId = parsedLocation[0];
      this.updateAccordionById(unitId);

      isUpdatingLocation = false;
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Load data for the unit
   *
   * @function actions:loadData
   * @returns {undefined}
   */
  loadData: function() {
    // Load the lessons and users in the course when the component is instantiated
    let component = this;
    component.set('loading', true);
    component.getLessons().then(function(lessons) {
      if (!component.isDestroyed) {
        component.set('items', lessons);
        component.set('loading', false);
      }
    });
  },

  /**
   * Get all the lessons by unit
   *
   * @function
   * @requires api-sdk/lesson#findByClassAndCourseAndUnit
   * @returns {Lesson[]}
   */
  getLessons: function() {
    const component = this;
    const userId = component.get('session.userId');
    const classId = component.get('currentClass.id');
    const courseId =
      component.get('currentClass.courseId') ||
      component.get('currentCourse.id');
    const unitId = component.get('model.id');
    const classMembers = component.get('classMembers');
    const isTeacher = component.get('isTeacher');
    const contentVisibility = component.get('contentVisibility');
    let lessons = Ember.A();
    let unitPeers = Ember.A();

    let peersPromise = classId
      ? component
        .get('analyticsService')
        .getUnitPeers(classId, courseId, unitId)
      : Ember.RSVP.resolve(unitPeers);
    return Ember.RSVP
      .hash({
        unit: component.get('unitService').fetchById(courseId, unitId),
        peers: peersPromise
      })
      .then(({ unit, peers }) => {
        lessons = unit.get('children');
        unitPeers = peers;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          let performancePromise = Ember.RSVP.resolve();
          if (classId) {
            performancePromise = isTeacher
              ? component
                .get('performanceService')
                .findClassPerformanceByUnit(
                  classId,
                  courseId,
                  unitId,
                  classMembers
                )
              : component
                .get('performanceService')
                .findStudentPerformanceByUnit(
                  userId,
                  classId,
                  courseId,
                  unitId,
                  lessons
                );
            Ember.RSVP.resolve(performancePromise).then(resolve, reject);
          } else {
            Ember.RSVP
              .hash({
                assessmentPerformance: component
                  .get('learnerService')
                  .fetchPerformanceUnit(
                    courseId,
                    unitId,
                    CONTENT_TYPES.ASSESSMENT
                  ),
                collectionPerformance: component
                  .get('learnerService')
                  .fetchPerformanceUnit(
                    courseId,
                    unitId,
                    CONTENT_TYPES.COLLECTION
                  )
              })
              .then(({ assessmentPerformance, collectionPerformance }) => {
                performancePromise = assessmentPerformance.concat(
                  collectionPerformance
                );
                Ember.RSVP.resolve(performancePromise).then(resolve, reject);
              });
          }
        });
      })
      .then(performance => {
        lessons.forEach(function(lesson) {
          const peer = unitPeers.findBy('id', lesson.get('id'));
          if (peer) {
            lesson.set('membersCount', peer.get('peerCount'));
          }
          if (performance) {
            if (isTeacher) {
              const averageScore = performance.calculateAverageScoreByItem(
                lesson.get('id')
              );
              lesson.set(
                'performance',
                Ember.Object.create({
                  score: averageScore,
                  hasStarted: averageScore > 0
                })
              );
            } else {
              let lessonPerformance;
              if (classId) {
                lessonPerformance = performance.findBy('id', lesson.get('id'));
              } else {
                lessonPerformance = performance.findBy(
                  'lessonId',
                  lesson.get('id')
                );

                if (lessonPerformance) {
                  const score = lessonPerformance.get('scoreInPercentage');
                  const timeSpent = lessonPerformance.get('timeSpent');
                  const completionDone = lessonPerformance.get(
                    'completedCount'
                  );
                  const completionTotal = lessonPerformance.get('totalCount');
                  const hasStarted = score > 0 || timeSpent > 0;
                  const isCompleted =
                    completionDone > 0 && completionDone >= completionTotal;
                  lessonPerformance.set('hasStarted', hasStarted);
                  lessonPerformance.set('isCompleted', isCompleted);
                  lessonPerformance.set('completionDone', completionDone);
                  lessonPerformance.set('completionTotal', completionTotal);
                }
              }
              lesson.set('performance', lessonPerformance);
            }
            if (classId) {
              lesson.set(
                'performance.completionTotal',
                contentVisibility.getTotalAssessmentsByUnitAndLesson(
                  unitId,
                  lesson.get('id')
                )
              );
            }
          }
        });
        return lessons;
      });
  }
});
