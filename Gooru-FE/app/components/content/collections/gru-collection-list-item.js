import Ember from 'ember';
import BuilderMixin from 'gooru-web/mixins/content/builder';
import { CONTENT_TYPES, RUBRIC_OFF_OPTIONS } from 'gooru-web/config/config';
import ModalMixin from 'gooru-web/mixins/modal';
import FillInTheBlank from 'gooru-web/utils/question/fill-in-the-blank';
import { replaceMathExpression, removeHtmlTags } from 'gooru-web/utils/utils';
import Rubric from 'gooru-web/models/rubric/rubric';

/**
 * Collection List
 *
 * Component responsible for listing a set of resources/questions
 *
 * @module
 * @augments content/courses/gru-accordion-course
 *
 */
export default Ember.Component.extend(BuilderMixin, ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:api-sdk/resource
   */
  resourceService: Ember.inject.service('api-sdk/resource'),

  /**
   * @requires service:api-sdk/question
   */
  questionService: Ember.inject.service('api-sdk/question'),

  /**
   * @requires service:api-sdk/media
   */
  mediaService: Ember.inject.service('api-sdk/media'),

  /**
   * @property {Service} profile service
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @property {Service} rubric service
   */
  rubricService: Ember.inject.service('api-sdk/rubric'),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @property {Service} session
   */
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Remove selected collection item
     */
    deleteItem: function(builderItem) {
      let component = this;
      const collection = component.get('collection');
      var model = {
        content: builderItem,
        index: this.get('index'),
        parentName: this.get('collection.title'),
        callback: {
          success: function() {
            component.get('onRemoveCollectionItem')(builderItem);
          }
        }
      };
      var collectionItem = null;
      if (builderItem.get('format') === 'question') {
        collectionItem = {
          deleteMethod: function() {
            return this.get('questionService').deleteQuestion(
              this.get('model.id'),
              collection
            );
          }.bind(this),
          type: CONTENT_TYPES.QUESTION
        };
        this.actions.showModal.call(
          this,
          'content.modals.gru-quick-delete-content',
          $.extend(model, collectionItem),
          null,
          null,
          null,
          false
        );
      } else {
        collectionItem = {
          removeMethod: function() {
            return this.get('resourceService').deleteResource(
              this.get('model.id'),
              collection
            );
          }.bind(this),
          type: CONTENT_TYPES.RESOURCE
        };
        this.actions.showModal.call(
          this,
          'content.modals.gru-quick-remove-content',
          $.extend(model, collectionItem),
          null,
          null,
          null,
          false
        );
      }
    },
    copyTo: function(builderItem) {
      const component = this;
      if (component.get('session.isAnonymous')) {
        component.send('showModal', 'content.modals.gru-login-prompt');
      } else {
        let assessmentsPromise = Ember.RSVP.resolve(null);
        if (builderItem.format === 'question') {
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
                return { content: builderItem, collections, assessments };
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
    * Route to edit with correct query params.
    */
    edit: function(item) {
      const component = this;
      const route =
        item.get('format') === 'question'
          ? 'content.questions.edit'
          : 'content.resources.edit';
      const queryParams = {
        queryParams: {
          collectionId: component.get('collection.id'),
          isCollection: component.get('isCollection')
        }
      };
      component.get('router').transitionTo(route, item.get('id'), queryParams);
    },

    copy: function(builderItem) {
      var model = {
        content: this.get('model'),
        collectionId: this.get('collection.id'),
        isCollection: this.get('isCollection'),
        onRemixSuccess: this.get('onRemixCollectionItem')
      };
      if (builderItem.get('format') === 'question') {
        this.send('showModal', 'content.modals.gru-question-remix', model);
      } else {
        this.send('showModal', 'content.modals.gru-resource-remix', model);
      }
    },

    editNarration: function() {
      var modelForEditing = this.get('model').copy();

      this.setProperties({
        tempModel: modelForEditing,
        isPanelExpanded: true,
        isEditingNarration: true
      });
    },

    editInline: function() {
      this.showInlinePanel();
    },

    updateItem: function(builderItem) {
      let component = this;
      var editedModel = this.get('tempModel');
      const collection = component.get('collection');

      editedModel.validate().then(function({ model, validations }) {
        if (validations.get('isValid')) {
          if (builderItem.get('format') === 'question') {
            component.saveQuestion();
          } else {
            component
              .get('resourceService')
              .updateResource(editedModel.id, editedModel, collection)
              .then(function() {
                component.set('model', editedModel);
                model.merge(editedModel, ['title', 'narration']);
                component.setProperties({
                  isPanelExpanded: false,
                  isEditingInline: false,
                  isEditingNarration: false,
                  editImagePicker: false
                });
              })
              .catch(function(error) {
                var message = component
                  .get('i18n')
                  .t('common.errors.question-not-updated').string;
                component.get('notifications').error(message);
                Ember.Logger.error(error);
              });
          }
        } else {
          component.set('didValidate', true);
        }
      });
    },

    cancel: function() {
      this.setProperties({
        isPanelExpanded: false,
        isEditingInline: false,
        isEditingNarration: false,
        editImagePicker: false
      });
    },

    toggleImagePicker: function() {
      this.set('editImagePicker', true);
    },

    onShowAdvancedEditor: function(isChecked) {
      if (isChecked) {
        this.set('showAdvancedEditor', true);
      }
    },

    focusQuestionTextEditor: function() {
      this.scrollToFirstEditor();
    },

    /**
     * Action after selecting an option for maximum points
     */
    onMaxScoreChange: function(newValue) {
      this.set('tempModel.rubric.maxScore', parseInt(newValue));
    },

    /**
     * Action after selecting an option for increment
     */
    onIncrementChange: function(newValue) {
      this.set('tempModel.rubric.increment', parseFloat(newValue));
    },

    /**
     * Updates rubric to display the information of the associated rubric
     */
    updateAssociatedRubric: function(rubric) {
      this.set('model.rubric', rubric);

      let tempModel = this.get('tempModel');
      tempModel.set('rubric', rubric.copy());
    },

    /**
     * Disassociates the rubric from the question
     */
    removeRubric: function(associatedRubricId) {
      let component = this;
      let tempModel = component.get('tempModel');
      let rubric = Rubric.create(Ember.getOwner(this).ownerInjection(), {
        increment: 0.5,
        maxScore: 1
      });

      component
        .get('rubricService')
        .deleteRubric(associatedRubricId)
        .then(function() {
          component.set('model.rubric', null);
          tempModel.set('rubric', rubric);

          component.setProperties({
            isPanelExpanded: true,
            isEditingInline: true,
            isEditingNarration: false,
            editImagePicker: false
          });
        });
    },

    /**
     * Show modal with rubrics to choose one and associate it to the question
     */
    showAddRubricModal: function() {
      let component = this;
      const userId = component.get('session.userId');

      return component
        .get('rubricService')
        .getUserRubrics(userId)
        .then(function(rubrics) {
          return {
            questionId: component.get('tempModel.id'),
            userId,
            rubrics,
            callback: {
              success: function(rubricAssociated) {
                component.send('updateAssociatedRubric', rubricAssociated);
              }
            }
          };
        })
        .then(model =>
          component.send(
            'showModal',
            'content.modals.gru-add-rubric-to-question',
            model,
            null,
            null
          )
        );
    }
  },

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'collections', 'gru-collection-list-item'],

  tagName: 'li',

  attributeBindings: ['data-id'],

  'data-id': Ember.computed.alias('model.id'),

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    this._super(...arguments);
    const component = this;
    var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

    if (isTouch) {
      component.$('.actions .item-actions button').tooltip('disable');
    }

    component.setProperties({
      isPanelExpanded: false,
      isEditingInline: false,
      isEditingNarration: false
    });

    if (component.get('model')) {
      const editingContent = component.get('editingContent');
      const modelId = component.get('model.id');

      if (editingContent && modelId && editingContent === modelId) {
        component.showInlinePanel();
      }
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * If the user wants to edit the image
   * @property {Boolean}
   */
  editImagePicker: false,

  /**
   * If the image picker should be shown
   * @property {Boolean}
   */
  showImagePicker: Ember.computed.or('editImagePicker', 'model.thumbnail'),

  /**
   * @property {Number} remainingStandards - number of standards not displayed
   */
  remainingStandards: Ember.computed('visibleStandards', function() {
    return this.get('model.standards.length') - this.get('visibleStandards');
  }),

  /**
   * @property {Number} visibleStandards - number of standards that will be displayed
   */
  visibleStandards: 1,

  /**
   * @property {Object[]} visibleStandardsList - list of standards that will be displayed
   */
  visibleStandardsList: Ember.computed('visibleStandards', function() {
    var visibleStandards = this.get('visibleStandards');

    return this.get('model.standards').filter(function(item, index) {
      return index < visibleStandards;
    });
  }),
  /**
   * Course model as instantiated by the route. This is the resource that have the assigned collection
   * @property {Collection}
   */
  collection: null,
  /**
  * @property {Boolean} isCollection - is this a listing for a collection or for an assessment
  */
  isCollection: null,

  /**
   * Copy of the resource/question model used for editing.
   * @property {Resource/Question }
   */
  tempModel: null,

  /**
   * @property {Boolean} isEditingInline
   */
  isEditingInline: false,

  /**
   * @property {Boolean} isEditingNarration
   */
  isEditingNarration: false,

  /**
   * @property {Boolean} isPanelExpanded
   */
  isPanelExpanded: false,

  /**
   * @property {String} Error message to display below the description
   */
  descriptionError: null,

  /**
   * @property {Boolean} Indicates if a Hot spot answer has images
   */
  hasNoImages: false,

  /**
   * @property {Boolean} Indicates if a correct answer is required
   */
  correctAnswerNotSelected: false,

  /**
   * If the advanced editor should be shown
   * @property {Boolean}
   */
  showAdvancedEditor: false,

  /**
   * If a rubric ON is not associated
   * @property {Boolean}
   */
  rubricError: false,

  /**
   * If the advanced edit button should be shown
   @property {Boolean}
   */
  showAdvancedEditButton: Ember.computed(
    'model',
    'isEditingInline',
    function() {
      return (
        this.get('model.supportAnswerChoices') && this.get('isEditingInline')
      );
    }
  ),

  /**
   * Toggle Options for the Advanced Edit button
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

  /**
   * Options for maximum points
   * @property {Array}
   */
  maximumOptions: Ember.computed(function() {
    let options = [];
    for (let i = 1; i <= RUBRIC_OFF_OPTIONS.MAX_SCORE; i += 1) {
      options.push({
        id: i,
        name: i
      });
    }
    return options;
  }),

  /**
   * Options for increment
   * @property {Array}
   */
  incrementOptions: Ember.computed(function() {
    return RUBRIC_OFF_OPTIONS.INCREMENT;
  }),

  // ----------------------------
  // Methods

  /**
   * Save question content
   */
  saveQuestion: function() {
    const component = this;
    var editedQuestion = this.get('tempModel');
    editedQuestion.set('text', replaceMathExpression(editedQuestion.text));
    var questionForValidate = editedQuestion.copy();
    var answersForValidate = questionForValidate.get('answers');
    var promiseArray = [];
    var answersPromise = null;
    if (editedQuestion.get('isFIB')) {
      editedQuestion.set(
        'answers',
        FillInTheBlank.getQuestionAnswers(editedQuestion)
      );
      component.updateQuestion(editedQuestion, component);
    } else if (editedQuestion.get('isOpenEnded')) {
      if (
        editedQuestion.get('rubric.rubricOn') &&
        !editedQuestion.get('rubric.title')
      ) {
        component.set('rubricError', true);
      } else {
        component.updateQuestion(editedQuestion, component);
      }
    } else {
      if (editedQuestion.get('answers')) {
        if (this.get('showAdvancedEditButton')) {
          for (var i = 0; i < editedQuestion.get('answers').length; i++) {
            var answer = editedQuestion.get('answers')[i];
            answer.set('text', replaceMathExpression(answer.get('text')));
          }
        }
        if (editedQuestion.get('isHotSpotImage')) {
          this.hasImages(editedQuestion.get('answers'));
          promiseArray = editedQuestion
            .get('answers')
            .map(component.getAnswerSaveImagePromise.bind(component));
          answersPromise = Ember.RSVP.Promise
            .all(promiseArray)
            .then(function(values) {
              for (var i = 0; i < editedQuestion.get('answers').length; i++) {
                editedQuestion.get('answers')[i].set('text', values[i]);
              }
              answersForValidate = editedQuestion.get('answers');
              return Ember.RSVP.Promise.all(
                answersForValidate.map(component.getAnswerValidatePromise)
              );
            });
        } else {
          promiseArray = answersForValidate.map(
            component.getAnswerValidatePromise
          );
          answersPromise = Ember.RSVP.Promise.all(promiseArray);
        }
        answersPromise.then(function(values) {
          if (component.validateAnswers(values, editedQuestion)) {
            component.updateQuestion(editedQuestion, component);
          }
        });
      } else {
        component.updateQuestion(editedQuestion, component);
      }
    }
  },

  updateQuestion: function(editedQuestion, component) {
    let question = component.get('model');
    const collection = component.get('collection');

    editedQuestion.validate().then(function({ validations }) {
      if (validations.get('isValid')) {
        let imageIdPromise = new Ember.RSVP.resolve(
          editedQuestion.get('thumbnail')
        );
        if (
          editedQuestion.get('thumbnail') &&
          editedQuestion.get('thumbnail') !== question.get('thumbnail')
        ) {
          imageIdPromise = component
            .get('mediaService')
            .uploadContentFile(editedQuestion.get('thumbnail'));
        }
        var defaultTitle = component.get('i18n').t('common.new-question')
          .string;
        var defaultText = component.get('i18n').t('common.new-question-text')
          .string;
        var editedQuestionTitle = editedQuestion.title;
        var editedQuestionText = editedQuestion.text;

        if (
          editedQuestionTitle === defaultTitle &&
          editedQuestionText !== defaultText &&
          editedQuestionText !== ''
        ) {
          editedQuestionText = $.trim(editedQuestionText);
          //Replace answer placeholder in the question title from [answer] into ____
          var newTitle = editedQuestionText
            .replace(/\[[^\]]+\]/g, '____')
            .substr(0, 50);

          editedQuestion.set('title', newTitle);
        }
        imageIdPromise.then(function(imageId) {
          editedQuestion.set('thumbnail', imageId);
          component
            .get('questionService')
            .updateQuestion(editedQuestion.id, editedQuestion, collection)
            .then(function() {
              component.setProperties({
                model: editedQuestion,
                isPanelExpanded: false,
                isEditingInline: false,
                isEditingNarration: false,
                editImagePicker: false
              });

              if (component.get('editingContent')) {
                component.set('editingContent', null);
              }

              question.merge(editedQuestion, [
                'title',
                'narration',
                'thumbnail',
                'text'
              ]);

              if (
                editedQuestion.get('isOpenEnded') &&
                !editedQuestion.get('rubric.rubricOn')
              ) {
                editedQuestion.set('rubric.title', null);
              }

              if (!question.get('rubric')) {
                question.set('rubric', editedQuestion.get('rubric'));
              } else {
                question
                  .get('rubric')
                  .merge(editedQuestion.get('rubric'), [
                    'maxScore',
                    'increment',
                    'scoring',
                    'rubricOn',
                    'title'
                  ]);
              }
            })
            .catch(function(error) {
              var message = component
                .get('i18n')
                .t('common.errors.question-not-updated').string;
              component.get('notifications').error(message);
              Ember.Logger.error(error);
            });
        });
      }
      component.set('didValidate', true);
    });
  },

  /**
   * Check that validate promises are not returning false
   */
  validateAnswers: function(promiseValues, question) {
    var valid = true;
    promiseValues.find(function(promise) {
      if (promise === false) {
        valid = false;
      }
    });
    return valid && this.isCorrectAnswerSelected(question);
  },

  /**
   * Check if an answer is selected as correct
   */
  isCorrectAnswerSelected: function(question) {
    if (question.get('answers').length > 0) {
      let correctAnswers = question.get('answers').filter(function(answer) {
        return answer.get('isCorrect');
      });
      if (correctAnswers.length > 0) {
        this.set('correctAnswerNotSelected', false);
      } else {
        this.set('correctAnswerNotSelected', true);
        return false;
      }
    }
    return true;
  },

  /**
   * Returns upload image promises
   */
  getAnswerSaveImagePromise: function(answer) {
    if (answer.get('text') && typeof answer.get('text').name === 'string') {
      return this.get('mediaService').uploadContentFile(answer.get('text'));
    } else {
      return answer.get('text');
    }
  },

  /**
   * Returns validate answer promises
   */
  getAnswerValidatePromise: function(answer) {
    if (answer.get('text')) {
      if (answer.get('text').length > 0) {
        answer.set('text', removeHtmlTags(answer.text));
      }
    }
    return answer.validate().then(function({ validations }) {
      return validations.get('isValid');
    });
  },

  /**
   * Check if an hs-answer has image
   */
  hasImages: function(answers) {
    if (answers.length > 0) {
      let answerImages = answers.filter(function(answer) {
        return answer.get('text') === null;
      });
      if (answerImages.length > 0) {
        this.set('hasNoImages', true);
      } else {
        this.set('hasNoImages', false);
        return false;
      }
    }
    return true;
  },

  /**
   * show Inline Edit Panel
   */
  showInlinePanel: function() {
    var modelForEditing = this.get('model').copy();

    if (modelForEditing.get('isOpenEnded') && !modelForEditing.get('rubric')) {
      let rubric = Rubric.create(Ember.getOwner(this).ownerInjection(), {
        increment: 0.5,
        maxScore: 1
      });
      modelForEditing.set('rubric', rubric);
    }
    this.setProperties({
      tempModel: modelForEditing,
      isPanelExpanded: true,
      isEditingInline: true,
      editImagePicker: false,
      showAdvancedEditor: false,
      rubricError: false
    });
  },

  /**
  * scroll to first editor of the page, when it has several editor answers
  */
  scrollToFirstEditor: function() {
    var component = this;
    Ember.run.later(function() {
      var editorID =
        '.panel-body .question .gru-rich-text-editor:eq(0) .rich-editor';
      var editor = component.$(editorID);
      if (editor && editor.length > 0) {
        editor[0].focus();
      }
    }, 100);
  }
});
