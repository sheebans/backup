import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import SessionMixin from 'gooru-web/mixins/session';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'gooru-web/models/taxonomy/taxonomy-tag-data';

/**
 * Resource, Questions and Rubric card
 *
 * Component responsible of showing the question ,resource or rubric information in cards, so that most useful information is summarized there.
 * @module
 */
export default Ember.Component.extend(ModalMixin, SessionMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} session
   */
  session: Ember.inject.service('session'),

  /**
   * @property {Service} profile service
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['new-cards', 'gru-resource-card'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered to edit the resource/question
     */
    editResource: function() {
      this.sendAction('onEditResource', this.get('resource'));
    },

    /**
     * Action triggered to play the resource/question
     */
    playResource: function() {
      this.sendAction('onPlayResource', this.get('resource'));
    },

    /**
     * Action triggered to add to collection
     */
    addToCollection: function() {
      const component = this;
      if (component.get('session.isAnonymous')) {
        component.send('showModal', 'content.modals.gru-login-prompt');
      } else {
        let assessmentsPromise = Ember.RSVP.resolve(null);
        if (component.get('isQuestion')) {
          assessmentsPromise = component
            .get('profileService')
            .readAssessments(component.get('session.userId'));
        }
        assessmentsPromise
          .then(function(assessments) {
            return component
              .get('profileService')
              .readCollections(component.get('session.userId'))
              .then(function(collections) {
                return {
                  content: component.get('resource'),
                  collections,
                  assessments
                };
              });
          })
          .then(model =>
            component.send(
              'showModal',
              'content.modals.gru-add-to-collection',
              model,
              null,
              'add-to'
            )
          );
      }
    },

    /**
     * Action triggered to remix the question
     */
    remixQuestion: function() {
      if (this.get('session.isAnonymous')) {
        this.send('showModal', 'content.modals.gru-login-prompt');
      } else {
        this.sendAction('onRemixQuestion', this.get('resource'));
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Profile information
   * @property {Profile} profile
   */
  profile: null,

  /**
   * Indicates if it allow profile navigation or not in the cards
   * @property {boolean} allowProfileNavigation
   */
  allowProfileNavigation: true,

  /**
   * Indicates if the edit functionality is enabled
   * @property {boolean}
   */
  editEnabled: false,

  /**
   * Indicates if this resource is a question
   * @property {boolean}
   */
  isQuestion: Ember.computed.equal('resource.format', 'question'),

  /**
   * Indicates if this resource is a rubric
   * @property {boolean}
   */
  isRubric: false,

  /**
   * @property {string} edit action
   */
  onEditResource: null,

  /**
   * @property {Resource|Question} resource
   */
  resource: null,

  /**
   * Indicates if is the card is showing on profile
   * @property {boolean}
   */
  isOnProfile: false,

  /**
   * Show the publisher if the resource has publisher and is publish
   * @property {boolean}
   */
  showPublisher: Ember.computed('resource', function() {
    return this.get('resource').isPublished && this.get('resource').publisher;
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed(
    'resource.standards.[]',
    'isRubric',
    'resource.taxonomy.[]',
    function() {
      var standards = !this.get('isRubric')
        ? this.get('resource.standards')
        : this.get('resource.taxonomy');
      if (standards) {
        standards = standards.filter(function(standard) {
          // Filter out learning targets (they're too long for the card)
          return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
        });
      }
      return TaxonomyTag.getTaxonomyTags(standards);
    }
  )
});
