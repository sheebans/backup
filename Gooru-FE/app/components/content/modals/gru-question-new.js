import Ember from 'ember';
import Question from 'gooru-web/models/content/question';
import Collection from 'gooru-web/models/content/collection';
import { QUESTION_CONFIG, QUESTION_TYPES } from 'gooru-web/config/question';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {QuestionService} Question service API SDK
   */
  questionService: Ember.inject.service('api-sdk/question'),

  /**
   * @property {CollectionService} Collection service API SDK
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @property {AssessmentService} Assessment service API SDK
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * @property {Service} Notifications service
   */
  notifications: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'modals', 'gru-question-new'],

  classNameBindings: ['component-class'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    createQuestion: function() {
      const component = this;
      const question = component.get('question');
      question.set(
        'title',
        component.get('i18n').t('common.new-question').string
      ); //Default title
      let questionDescription =
        question.get('type') === 'FIB'
          ? component.get('i18n').t('common.new-fib-question-text')
          : component.get('i18n').t('common.new-question-text');
      question.set('description', questionDescription.string); //Default description
      //TODO temporal fix
      question.validate().then(function({ validations }) {
        if (validations.get('isValid')) {
          component.set('isLoading', true);
          let questionId;
          component
            .get('questionService')
            .createQuestion(question)
            .then(function(newQuestion) {
              questionId = newQuestion.get('id');
              if (component.get('model')) {
                let service =
                  component.get('model') instanceof Collection
                    ? component.get('collectionService')
                    : component.get('assessmentService');
                return service.addQuestion(
                  component.get('model').get('id'),
                  questionId
                );
              } else {
                return Ember.RSVP.resolve(true);
              }
            })
            .then(
              function() {
                component.closeModal(questionId);
              },
              function() {
                component.set('isLoading', false);
                const message = component
                  .get('i18n')
                  .t('common.errors.question-not-created').string;
                component.get('notifications').error(message);
              }
            );
        }
        component.set('didValidate', true);
      });
    },

    selectType: function(type) {
      this.set('selectedType', type);
      this.set('question.type', this.get('selectedType'));
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    var question = Question.create(Ember.getOwner(this).ownerInjection(), {
      title: null,
      type: QUESTION_TYPES.multipleChoice
    });
    this.set('question', question);
  },

  didInsertElement() {
    var component = this;
    if (component && component.$() && component.$().length) {
      setTimeout(function() {
        if (component && component.$() && component.$().length) {
          component
            .$()
            .attr('tabindex', 0)
            .focus();
        }
      }, 400);
      component
        .$()
        .off('keyup')
        .on('keyup', function() {
          var keyCode = event.keyCode ? event.keyCode : event.which;
          if (keyCode === 13) {
            component.$('button[type=submit]').trigger('click');
          }
        });
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @type {?String} specific class
   */
  'component-class': null,

  /**
   * @type {Question} question
   */
  question: null,

  /**
   * @type {String} selectedType
   */
  selectedType: Ember.computed('question.type', function() {
    return this.get('question.type');
  }),

  /**
   * @type {Array[]} questionTypes
   */
  questionTypes: Ember.computed(function() {
    return Ember.A(Object.keys(QUESTION_CONFIG));
  }),

  /**
   * Indicate if it's waiting for createQuestion callback
   */
  isLoading: false,

  //Methods
  closeModal: function(questionId) {
    const component = this;
    component.set('isLoading', false);
    component.triggerAction({ action: 'closeModal' });

    const collectionId = component.get('model.id');
    const isCollection = component.get('model.isCollection');

    if (collectionId) {
      const queryParams = { queryParams: { editingContent: questionId } };
      if (isCollection) {
        component
          .get('router')
          .transitionTo('content.collections.edit', collectionId, queryParams);
      } else {
        component
          .get('router')
          .transitionTo('content.assessments.edit', collectionId, queryParams);
      }
    } else {
      const queryParams = { queryParams: { editing: true } };
      component
        .get('router')
        .transitionTo('content.questions.edit', questionId, queryParams);
    }
  },

  /*
   * Move array object into array
   * */
  move(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
});
