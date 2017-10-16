import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';

/**
 * Player navigator
 *
 * Component responsible for enabling more flexible navigation options for the player.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-navigator'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {

    /**
     * Action triggered to remix the collection
     * @param content
     */
    remixCollection: function() {
      this.sendAction('onRemixCollection');
    },

    /**
     * Action triggered when the user closes the content player
     */
    closePlayer: function() {
      this.sendAction('onClosePlayer');
    },

    /**
     * Redirect to course map
     */
    redirectCourseMap() {
      if (this.get('classId')) {
        this.get('router').transitionTo(
          'student.class.course-map',
          this.get('classId'), {
            queryParams: {
              refresh: true
            }
          }
        );
      } else {
        this.get(
          'router'
        ).transitionTo('student.independent.course-map', this.get('course.id'), {
          queryParams: {
            refresh: true
          }
        });
      }
    },

    /**
     * Go back to collection
     */
    backToCollection() {
      window.location.href = this.get('collectionUrl');
    },


    onLeftNavigatorSlideOpen() {
      let component = this;
      component.$('.nav-menu-titles').animate({
        left: '60px'
      });
    },

    onLeftNavigatorSlideClose() {
      let component = this;
      component.$('.nav-menu-titles').animate({
        left: '-300px'
      });
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   *  @property {Object} Extracted the unit title from unit
   */
  unitTitle: Ember.computed(function() {
    let unit = this.get('unit');
    if (unit) {
      return Ember.Object.create({
        shortname: `U${unit.get('sequence')}`,
        fullname: unit.get('title')
      });
    }
    return null;
  }),

  /**
   *  @property {Object} Extracted the lesson title from lesson
   */
  lessonTitle: Ember.computed(function() {
    let lesson = this.get('lesson');
    if (lesson) {
      return Ember.Object.create({
        shortname: `L${lesson.get('sequence')}`,
        fullname: lesson.get('title')
      });
    }
    return null;
  }),

  /**
   *  @property {Object} Extracted the collection title from unit, lesson and/or collection
   */
  collectionTitle: Ember.computed(function() {
    let collection = this.get('collection');
    let lesson = this.get('lesson');
    let title = {};
    if (lesson) {
      let lessonChildren = lesson.children;
      let isChild = lessonChildren.findBy('id', collection.id);
      if (collection && isChild) {
        if (collection.isCollection) {
          let collections = lessonChildren.filter(
            collection => collection.format === 'collection'
          );
          collections.forEach((child, index) => {
            if (child.id === collection.id) {
              let collectionSequence = index + 1;
              title = Ember.Object.create({
                shortname: `C${collectionSequence}`,
                fullname: collection.get('title')
              });
            }
          });
        } else {
          let assessments = lessonChildren.filter(
            assessment => assessment.format === 'assessment'
          );
          assessments.forEach((child, index) => {
            if (child.id === collection.id) {
              let assessmentSequence = index + 1;
              title = Ember.Object.create({
                shortname: `A${assessmentSequence}`,
                fullname: collection.get('title')
              });
            }
          });
        }
      }
    } else {
      title = Ember.Object.create({
        shortname: collection.isCollection ? 'C' : 'A',
        fullname: collection.get('title')
      });
    }
    return title;
  }),


  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods


});
