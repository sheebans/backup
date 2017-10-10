import Ember from 'ember';
import SessionMixin from 'gooru-web/mixins/session';
import Category from 'gooru-web/models/rubric/rubric-category';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';
import ModalMixin from 'gooru-web/mixins/modal';
import TaxonomyTagData from 'gooru-web/models/taxonomy/taxonomy-tag-data';
import { EDUCATION_CATEGORY } from 'gooru-web/config/config';

export default Ember.Component.extend(SessionMixin, ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * @property {Service} Notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @property {MediaService} Media service API SDK
   */
  mediaService: Ember.inject.service('api-sdk/media'),

  /**
   /**
   * @property {RubricService} Rubric service API SDK
   */
  rubricService: Ember.inject.service('api-sdk/rubric'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'rubric', 'gru-rubric-edit'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Add new category
     */
    addNewCategory: function() {
      let newCategory = Category.create(Ember.getOwner(this).ownerInjection(), {
        isNew: true,
        allowsLevels: true,
        allowsScoring: true
      }).initLevels();
      let categories = this.get('categories');
      categories.addObject(newCategory);
    },
    /**
     * Cancel Rubric Edition
     */
    cancelEdit: function() {
      this.cancel();
    },
    /**
     * Update Rubric
     */
    updateContent: function() {
      this.save();
    },
    /**
     * Edit Content
     */
    editContent: function() {
      var rubricForEditing = this.get('rubric').copy();
      this.set('tempRubric', rubricForEditing);
      this.set('isEditing', true);
    },
    /**
     * Triggered by gru-category
     *Copy category
     */
    copyCategory: function(category, index) {
      let categories = this.get('categories');
      let newCategory = category.copy();
      categories.insertAt(index + 1, newCategory);
    },
    /**
     *Triggered by gru-category
     * Delete category
     */
    deleteCategory: function(category) {
      let categories = this.get('categories');
      categories.removeObject(category);
      this.saveCategory(category);
    },
    /**
     *Set if feedback is required
     */
    setFeedBack: function() {
      this.set('rubric.requiresFeedback', !this.get('rubric.requiresFeedback'));
    },
    /**
     *
     * @param {TaxonomyRoot} subject
     */
    selectSubject: function(subject) {
      this.set('selectedSubject', subject);
    },
    /**
     *SelectCategory
     * @param {String} category
     */
    selectCategory: function(category) {
      var standardLabel = category === EDUCATION_CATEGORY.value;
      this.set('standardLabel', !standardLabel);
    },

    /**
     * SelectCategory
     * @param {String} category
     */
    updateCategory: function(category) {
      this.saveCategory(category);
    },
    /**
     * Remove tag data from the taxonomy list in tempUnit
     */
    removeTag: function(taxonomyTag) {
      var tagData = taxonomyTag.get('data');
      this.get('tempRubric.standards').removeObject(tagData);
    },
    /**
     * Open taxonomy modal
     */
    openTaxonomyModal: function() {
      this.openTaxonomyModal();
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Category[]} Temporal categories array
   */
  categories: Ember.computed('tempRubric.categories.[]', function() {
    let categories = Ember.A([]);
    if (this.get('tempRubric.categories.length')) {
      categories = this.get('tempRubric.categories');
    }
    return categories;
  }),
  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  editableTags: Ember.computed('tempRubric.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(
      this.get('tempRubric.standards'),
      false,
      true
    );
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('rubric.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get('rubric.standards'), false);
  }),

  /**
   * If the file upload should show an error
   * @property {Boolean}
   */
  emptyFileError: false,

  /**
   *
   * @property {Object[]} footerActions List of action buttons to show
   */
  footerActions: Ember.computed(function() {
    return [
      {
        name: 'cancel',
        text: this.get('i18n').t('common.cancel'),
        class: 'btn-default',
        action: () => this.cancel()
      },
      {
        name: 'save',
        text: this.get('i18n').t('common.save'),
        class: 'btn-primary',
        action: () => this.save()
      }
    ];
  }),
  /**
   * @property {Object[]} headerActions List of action buttons to show
   */
  headerActions: Ember.computed(function() {
    return [
      {
        name: 'delete',
        icon: 'delete',
        action: () => this.delete()
      },
      {
        name: 'link',
        text: this.get('i18n').t('common.link'),
        icon: 'insert_link',
        isShare: true,
        type: 'rubric'
      },
      {
        name: 'copy',
        icon: 'content_copy',
        action: () => this.copy()
      },
      {
        name: 'preview',
        text: this.get('i18n').t('common.preview'),
        action: () => this.preview()
      }
    ];
  }),

  /*
   *  @property {Object}  backButton
   */
  backButton: Ember.computed(function() {
    return {
      text: this.get('i18n').t('common.back'),
      class: 'back-to',
      name: 'keyboard_arrow_left',
      visible: true,
      action: () => this.back()
    };
  }),

  /**
   * @property {String} headerTitle
   */
  headerTitle: Ember.computed(function() {
    return this.get('i18n').t('common.edit-rubric');
  }),
  /**
   * @property {Boolean} isEditing
   */
  isEditing: true,

  /**
   * @property {Object[]} options List of tab options to show
   */
  options: Ember.computed(function() {
    return [
      {
        name: 'information',
        text: this.get('i18n').t('common.information')
      },
      {
        name: 'rubric',
        text: this.get('i18n').t('common.rubric-creation')
      }
    ];
  }),
  /**
   * @property {String} selected Current option selected
   */
  selected: 'information',
  /**
   * @property {TaxonomyRoot}
   */
  selectedSubject: null,
  /**
   * @property {boolean}
   */
  standardDisabled: Ember.computed.not('selectedSubject'),
  /**
   * @property {boolean}
   */
  standardLabel: true,
  /**
   * i18n key for the standard/competency dropdown label
   * @property {string}
   */
  standardLabelKey: Ember.computed('standardLabel', function() {
    return this.get('standardLabel')
      ? 'common.standards'
      : 'common.competencies';
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Cancel function for rubric edition
   */
  cancel: function() {
    this.set('isEditing', false);
  },

  /*
   * Back fucntion  for rubric edition
   */
  back: function() {
    let rubric = this.get('rubric');
    this.get('router').transitionTo(
      'profile.content.rubrics',
      rubric.get('owner')
    );
  },

  delete: function() {
    const myId = this.get('session.userId');
    var model = {
      content: this.get('rubric'),
      deleteMethod: function() {
        return this.get('rubricService').deleteRubric(this.get('rubric.id'));
      }.bind(this),
      redirect: {
        route: 'profile.content.courses',
        params: {
          id: myId
        }
      }
    };

    this.actions.showModal.call(
      this,
      'content.modals.gru-delete-rubric',
      model,
      null,
      null,
      null,
      false
    );
  },

  /**
   * Copy function for rubric edition
   */
  copy: function() {
    let component = this;
    const rubricId = component.get('rubric.id');
    const rubricTitle = component.get('rubric.title');

    component
      .get('rubricService')
      .copyRubric(rubricId)
      .then(function(newRubricId) {
        let successMsg = component
          .get('i18n')
          .t('gru-rubric-edit.copy.success-message', { title: rubricTitle })
          .string;
        let editLabel = component.get('i18n').t('common.edit');
        let editRubricUrl = component
          .get('router')
          .generate('content.rubric.edit', newRubricId);
        component
          .get('notifications')
          .success(
            `${successMsg} <a class="btn btn-success" href="${editRubricUrl}">${editLabel}</a>`
          );
      });
  },

  /**
   * Save function for rubric edition
   */
  save: function() {
    let component = this;
    let tempRubric = component.get('tempRubric');
    tempRubric.set(
      'categories',
      component.get('categories').filter(category => category.get('title'))
    );
    let rubric = component.get('rubric');
    this.set('emptyFileError', !tempRubric.get('url'));
    tempRubric.validate().then(function({ validations }) {
      if (validations.get('isValid')) {
        let imageIdPromise = new Ember.RSVP.resolve(
          tempRubric.get('thumbnail')
        );
        if (
          tempRubric.get('thumbnail') &&
          tempRubric.get('thumbnail') !== rubric.get('thumbnail')
        ) {
          imageIdPromise = component
            .get('mediaService')
            .uploadContentFile(tempRubric.get('thumbnail'));
        }
        imageIdPromise
          .then(imageId => {
            tempRubric.set('thumbnail', imageId);
            return component.get('rubricService').updateRubric(tempRubric);
          })
          .then(() => {
            rubric.merge(tempRubric, [
              'title',
              'description',
              'thumbnail',
              'subject',
              'audience',
              'isPublished',
              'categories',
              'url',
              'uploaded',
              'feedback',
              'standards'
            ]);
            component.set('isEditing', false);
          });
      }
      component.set('didValidate', true);
    });
  },

  /**
   * Save function for categories
   */
  saveCategory(category) {
    let component = this;
    let tempRubric = component.get('rubric');
    let categories = tempRubric.get('categories');
    tempRubric.set(
      'categories',
      component
        .get('categories')
        .filter(
          cat =>
            cat.get('title') &&
            (categories.findBy('title', cat.get('title')) ||
              category.get('title') === cat.get('title'))
        )
    );
    return component.get('rubricService').updateRubric(tempRubric);
  },

  /**
   * Preview rubric on header action
   */
  preview: function() {
    let component = this;
    let rubric = component.get('rubric');
    component.get('router').transitionTo('content.rubric.preview', rubric.id);
  },

  /**
   * Open Taxonomy Modal
   */
  openTaxonomyModal: function() {
    var component = this;
    var standards = component.get('tempRubric.standards') || [];
    var subject = component.get('selectedSubject');
    var subjectStandards = TaxonomyTagData.filterBySubject(subject, standards);
    var notInSubjectStandards = TaxonomyTagData.filterByNotInSubject(
      subject,
      standards
    );
    var model = {
      selected: subjectStandards,
      shortcuts: null, // TODO: TBD
      subject: subject,
      standardLabel: component.get('standardLabel'),
      callback: {
        success: function(selectedTags) {
          var dataTags = selectedTags.map(function(taxonomyTag) {
            return taxonomyTag.get('data');
          });
          const standards = Ember.A(dataTags);
          standards.pushObjects(notInSubjectStandards.toArray());
          component.set('tempRubric.standards', standards);
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
  }
});
