import Ember from 'ember';
import TaxonomyTagData from 'gooru-web/models/taxonomy/taxonomy-tag-data';
import ModalMixin from 'gooru-web/mixins/modal';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';
import { SEARCH_CATEGORIES } from 'gooru-web/config/config';

export default Ember.Controller.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  queryParams: ['term', 'taxonomies'],

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Services
  /**
   * @property {Ember.Service} Service to do the search
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * @requires service:taxonomy
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    setCategory: function(category) {
      this.set('selectedCategory', category);
      this.filterSubjects(category);
      this.set('disableSubjects', false);
    },
    setSubject: function(subject) {
      const controller = this;
      controller.get('taxonomyService').getCourses(subject).then(function() {
        controller.openTaxonomyModal(subject);
      });
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {string} term filter
   */
  term: null,

  /**
   * @property {string} collection type filter
   */
  collectionType: null,

  /**
   * Configured standards
   * @property {Standard[]}
   */
  standards: null,

  /**
   * Enables the subject control
   * @property {boolean}
   */
  disableSubjects: true,

  /**
   * These are the collection search results
   * @property {CollectionResult[]}
   */
  collectionResults: null,

  /**
   * Type of collection filter selected
   *  @property {string} selectedFilterType
   *
   */
  selectedFilterType: 'collection',

  /**
   * @property {taxonomyCodes[]} list of taxonomy codes
   */
  taxonomyCodes: Ember.A([]),

  /**
   * @property {TaxonomyTagData[]}
   */
  selectedStandards: Ember.A([]),

  /**
   * @property {string} taxonomies query param
   */
  taxonomies: Ember.A([]),

  /**
   * @property {selectedTags[]} selected tags
   */
  selectedTags: Ember.A([]),

  /**
   * @property {categories[]} list of categories for filtering subjects
   */
  categories: SEARCH_CATEGORIES,

  /**
   * The selected category
   * @property {object}
   */
  selectedCategory: null,

  /**
   * @property {subjects[]} list of subjects for the search function
   */
  subjects: Ember.A([]),

  /**
   * Indicates if the standard filters are enabled
   * @property {boolean}
   */
  standardFilterEnabled: true,

  // -------------------------------------------------------------------------
  // Methods
  openTaxonomyModal: function(subject) {
    var controller = this;
    var standards = controller.get('selectedTags').map(function(selectedTag) {
      return selectedTag.get('data');
    });
    var subjectStandards = TaxonomyTagData.filterBySubject(subject, standards);
    var notInSubjectStandards = TaxonomyTagData.filterByNotInSubject(
      subject,
      standards
    );
    var model = {
      selected: subjectStandards,
      subject: subject,
      fromSearch: true,
      standardLabel: true,
      callback: {
        success: function(selectedTags) {
          var dataTags = selectedTags.map(function(taxonomyTag) {
            return taxonomyTag.get('data');
          });
          const standards = Ember.A(dataTags);
          standards.pushObjects(notInSubjectStandards.toArray());

          var taxonomies = Ember.A([]);
          var selectTaxonomyTags = Ember.A([]);

          standards.forEach(function(taxonomyTagData) {
            taxonomies.push(taxonomyTagData.get('id'));
            selectTaxonomyTags.push(
              controller.createTaxonomyTag(taxonomyTagData)
            );
          });

          controller.set('taxonomies', taxonomies);
          controller.set('selectedTags', selectTaxonomyTags);
        }
      }
    };

    this.actions.showModal.call(
      this,
      'taxonomy.modals.gru-standard-picker',
      model,
      null,
      'gru-standard-picker'
    );
  },

  filterSubjects: function(category) {
    this.get('taxonomyService').getSubjects(category.value).then(
      function(subjects) {
        this.set('subjects', subjects);
      }.bind(this)
    );
  },

  reloadTaxonomyTags: function() {
    const selectedTags = this.taxonomyCodes.map(
      function(taxonomyCode) {
        const framework = this.extractFramework(taxonomyCode);
        return this.createTaxonomyTag(
          TaxonomyTagData.create({
            id: taxonomyCode.id,
            code: taxonomyCode.code,
            frameworkCode: framework ? framework.get('frameworkId') : '',
            parentTitle: framework ? framework.get('subjectTitle') : '',
            title: taxonomyCode.title
          })
        );
      }.bind(this)
    );
    this.set('selectedTags', selectedTags);
    this.resetCategory();
  },

  extractFramework: function(taxonomyCode) {
    const frameworkId = taxonomyCode.id.split('-')[0];
    let framework;
    this.subjects.forEach(function(subject) {
      if (!framework) {
        const frameworks = subject.get('frameworks');
        if (frameworks.length) {
          framework = frameworks.findBy('id', frameworkId);
        }
      }
    });
    return framework;
  },

  createTaxonomyTag: function(dataTag) {
    return TaxonomyTag.create({
      isActive: true,
      isReadonly: true,
      isRemovable: true,
      data: dataTag
    });
  },

  resetCategory: function() {
    const category = this.get('selectedCategory');
    if (category) {
      this.send('setCategory', category);
    }
  }
});
