import Ember from 'ember';
import QuestionResult from 'gooru-web/models/result/question';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'questions', 'gru-question-play'],

  classNameBindings: ['view', 'fixed-header'],

  tagName: 'article',

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    submitQuestion: function() {
      Ember.Logger.debug('Submitting question from question player');
    },
    /**
     * Performs a back action in the browser history
     */
    goBack: function() {
      window.history.go(-1);
    }
  },

  // -------------------------------------------------------------------------
  // Events
  didInsertElement: function() {
    this._super(...arguments);
    this.set('fixed-header', true);
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * Course model as instantiated by the route.
   * @property {Course}
   */
  question: null,

  /**
   * Player question format
   * @property {Resource}
   */
  playerQuestion: Ember.computed('question', function() {
    return this.get('question').toPlayerResource();
  }),

  /**
   * Question result for this viewer, it is always an empty result
   */
  questionResult: Ember.computed(function() {
    return QuestionResult.create({});
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('question.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get('question.standards'), false);
  }),

  /**
   * @property {Boolean} Whether or not the currently logged in user is the creator/owner of the question
   */
  isCreator: Ember.computed('question.owner', function() {
    return this.get('question.owner.id') === this.get('session.userId');
  })
});
