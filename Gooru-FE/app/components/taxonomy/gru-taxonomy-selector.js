import Ember from 'ember';
import {
  TAXONOMY_CATEGORIES,
  CONTENT_CATEGORIES
} from 'gooru-web/config/config';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';

/**
 * Taxonomy selector component
 *
 * Component responsible for displaying/editing a category, subject and subject course values
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:taxonomy
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['taxonomy', 'gru-taxonomy-selector'],

  // -------------------------------------------------------------------------
  // Events
  onInit: Ember.on('init', function() {
    this.setupComponent();
  }),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Set Category
     */
    setCategory(category) {
      const component = this;
      component.set('selectedSubject', null);
      component.set('internalCategory', category);
      component.loadSubjects(category);
      if (component.get('onCategorySelected')) {
        component.sendAction('onCategorySelected', category);
      }
    },
    /**
     * Set Subject
     */
    setSubject(subject) {
      const component = this;
      component.set('selectedSubject', subject);
      if (component.get('onSubjectSelected')) {
        component.sendAction('onSubjectSelected', subject);
      }
    },

    /**
     * Select a subject course
     */
    selectTaxonomy(taxonomy) {
      const component = this;
      component.set('selectedTaxonomy', taxonomy);
      if (component.get('onTaxonomySelected')) {
        component.sendAction(
          'onTaxonomySelected',
          this.get('selectedTaxonomy')
        );
      }
    },

    /**
     * Remove a specific tag
     */
    removeTag(tag) {
      const component = this;
      component.removeTaxonomyTagData(tag.get('data.id'));
      if (component.get('onTaxonomySelected')) {
        component.sendAction(
          'onTaxonomySelected',
          this.get('selectedTaxonomy')
        );
      }
    }
  },

  //
  // Methods
  /**
   * Removes a taxonomy tag data from taxonomy
   * @param id
   */
  removeTaxonomyTagData: function(taxonomyId) {
    const taxonomy = this.get('selectedTaxonomy');
    let taxonomyTagData = taxonomy.findBy('id', taxonomyId);
    if (taxonomyTagData) {
      taxonomy.removeObject(taxonomyTagData);
    }
  },

  /**
   * Loads subjects by category
   */
  loadSubjects: function(category) {
    const component = this;
    component
      .get('taxonomyService')
      .getSubjects(category)
      .then(function(subjects) {
        component.set('subjects', subjects);
      });
  },

  setupComponent: function() {
    const component = this;
    const subject = component.get('selectedSubject');
    const category = component.get('selectedCategory');
    if (category) {
      component.loadSubjects(category);
    }

    if (subject) {
      if (!subject.get('hasCourses')) {
        component.get('taxonomyService').getCourses(subject);
      }
    }
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * i18n key for the subject dropdown label
   * @property {string}
   */
  subjectLabelKey: 'taxonomy.gru-taxonomy-selector.primary-subject-and-course',

  /**
   * @type {Ember.A} categories - List of content categories
   */
  categories: Ember.computed('showCourses', function() {
    return this.get('showCourses') ? TAXONOMY_CATEGORIES : CONTENT_CATEGORIES;
  }),

  /**
   * @property {boolean}
   */
  showCategories: true,

  /**
   * Is the entity being edited or not?
   * @property {Boolean}
   */
  isEditing: null,

  /**
   * Indicates if it should only include subjects having standards
   * @poperty {boolean}
   */
  onlySubjectsWithStandards: false,

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('selectedTaxonomy.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get('selectedTaxonomy'), false);
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  editableTags: Ember.computed('selectedTaxonomy.[]', function() {
    return TaxonomyTag.getTaxonomyTags(
      this.get('selectedTaxonomy'),
      false,
      true
    );
  }),

  /**
   * @property {string[]} taxonomy ids
   */
  selectedTaxonomyIds: Ember.computed('selectedTaxonomy.[]', function() {
    return this.get('selectedTaxonomy').map(function(tagData) {
      return tagData.get('id');
    });
  }),

  /**
   * @type {Array} List of subjects
   */
  subjects: null,

  /**
   * Internal category used to store the category from UI when subject is not selected
   * @property {string}
   */
  internalCategory: null,

  /**
   * @type {String} the selected category
   */
  selectedCategory: Ember.computed(
    'selectedSubject.category',
    'internalCategory',
    function() {
      return (
        this.get('selectedSubject.category') || this.get('internalCategory')
      );
    }
  ),

  /**
   * the subject selected
   * @property {TaxonomyRoot}
   */
  selectedSubject: null,

  /**
   * the subject courses to present
   * @property {[]}
   */
  subjectCourses: Ember.computed.alias('selectedSubject.courses'),

  /**
   * @property {TaxonomyTagData[]}
   */
  selectedTaxonomy: Ember.A(),

  /**
   * Indicates if it should show subject courses
   * @property {boolean}
   */
  showCourses: false,

  /**
   * when a category is selected
   * @property {string}
   */
  onCategorySelected: null,

  /**
   * when a subject is selected
   * @property {string}
   */
  onSubjectSelected: null,

  /**
   * when a taxonomy is selected
   * @property {string}
   */
  onTaxonomySelected: null,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Sets the corresponding lists of subjects and courses when the primary subject changes
   */
  onSelectedSubjectChanged: Ember.observer('selectedSubject', function() {
    this.setupComponent();
  }),

  /**
   * Set the subject dropdown label - from course
   */
  setSubjectLabelKey: Ember.observer(
    'internalCategory',
    'showCourses',
    function() {
      if (this.get('showCourses')) {
        var subjectLabelKey =
          this.get('internalCategory') === 'higher_education'
            ? 'taxonomy.gru-taxonomy-selector.competency-subject-and-course'
            : 'taxonomy.gru-taxonomy-selector.primary-subject-and-course';
        this.set('subjectLabelKey', subjectLabelKey);
      }
    }
  )
});
