import Ember from 'ember';
import { cleanFilename } from 'gooru-web/utils/utils';
import QuestionModel from 'gooru-web/models/content/question';
import AnswerModel from 'gooru-web/models/content/answer';
import TaxonomySerializer from 'gooru-web/serializers/taxonomy/taxonomy';
import RubricSerializer from 'gooru-web/serializers/rubric/rubric';

/**
 * Serializer to support the Question CRUD operations for API 3.0
 *
 * @typedef {Object} QuestionSerializer
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  /**
   * @property {RubricSerializer} rubricSerializer
   */
  rubricSerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'taxonomySerializer',
      TaxonomySerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'rubricSerializer',
      RubricSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Serialize a Question object into a JSON representation required by the Create Question endpoint
   *
   * @param questionModel The Question model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeCreateQuestion: function(questionModel) {
    const serializer = this;
    const format = QuestionModel.serializeQuestionType(
      questionModel.get('type')
    );
    const answers = questionModel.get('answers');
    var serializedQuestion = {
      title: questionModel.get('title'),
      description: questionModel.get('description'),
      content_subformat: format,
      visible_on_profile: questionModel.get('isVisibleOnProfile'),
      metadata: questionModel.get('metadata') || {},
      answer:
        answers && answers.length
          ? answers.map(function(answer, index) {
            return serializer.serializerAnswer(
              answer,
              index + 1,
              questionModel.get('isHotSpotImage')
            );
          })
          : null
    };
    serializedQuestion.metadata.audience = questionModel.get('audience')
      ? questionModel.get('audience')
      : [];
    serializedQuestion.metadata.depth_of_knowledge = questionModel.get(
      'depthOfknowledge'
    )
      ? questionModel.get('depthOfknowledge')
      : [];
    return serializedQuestion;
  },

  /**
   * Serialize a Question object into a JSON representation required by the Update Question endpoint
   *
   * @param questionModel The Question model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeUpdateQuestion: function(questionModel) {
    const serializer = this;
    let answers = questionModel.get('answers');
    let serializedQuestion = {
      title: questionModel.get('title'),
      //'content_subformat': QuestionModel.serializeQuestionType(questionModel.get("type")), // This is not supported on the back end yet
      taxonomy: serializer
        .get('taxonomySerializer')
        .serializeTaxonomy(questionModel.get('standards')),
      visible_on_profile: questionModel.get('isVisibleOnProfile'),
      metadata: questionModel.get('metadata') || {},
      answer:
        answers && answers.length
          ? answers.map(function(answer, index) {
            return serializer.serializerAnswer(
              answer,
              index + 1,
              questionModel.get('isHotSpotImage')
            );
          })
          : null
    };

    let thumbnail = questionModel.get('thumbnail');
    serializedQuestion.thumbnail =
      cleanFilename(thumbnail, this.get('session.cdnUrls')) || null;
    let narration = questionModel.get('narration');
    if (narration) {
      serializedQuestion.narration = narration;
    }

    let description = questionModel.get('text');
    if (description) {
      serializedQuestion.description = description;
    }

    serializedQuestion.metadata.audience = questionModel.get('audience')
      ? questionModel.get('audience')
      : [];
    serializedQuestion.metadata.depth_of_knowledge = questionModel.get(
      'depthOfknowledge'
    )
      ? questionModel.get('depthOfknowledge')
      : [];
    return serializedQuestion;
  },

  /**
   * Serialize the question title
   *
   * @param title
   * @returns {Object} returns a JSON Object
   */
  serializeUpdateQuestionTitle: function(title) {
    let serializedQuestion = {
      title: title
    };
    return serializedQuestion;
  },

  /**
   * Serialize an Answer model object into a JSON representation required by the Update Question endpoint
   *
   * @param answerModel - the Answer model to be serialized
   * @param sequenceNumber - the answer's sequence number
   * @returns {Object}
   */
  serializerAnswer: function(answerModel, sequenceNumber, isHotSpotImage) {
    var serializedAnswer = {
      sequence: sequenceNumber,
      is_correct: answerModel.get('isCorrect') ? 1 : 0,
      answer_text: isHotSpotImage
        ? cleanFilename(answerModel.get('text'), this.get('session.cdnUrls'))
        : answerModel.get('text'),
      answer_type: answerModel.get('type')
    };
    if (answerModel.get('highlightType')) {
      serializedAnswer.highlight_type = answerModel.get('highlightType');
    }
    return serializedAnswer;
  },

  /**
   * Normalize the question data into a Question object
   * @param questionData
   * @param index optional index value, corresponds to the assessment or collection index
   * @returns {Question}
   */
  normalizeReadQuestion: function(questionData, index) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const format = QuestionModel.normalizeQuestionType(
      questionData.content_subformat
    );
    const standards = questionData.taxonomy || {};
    const metadata = questionData.metadata || {};
    const question = QuestionModel.create(
      Ember.getOwner(this).ownerInjection(),
      {
        id: questionData.id,
        title: questionData.title,
        narration: questionData.narration,
        type: format,
        thumbnail: questionData.thumbnail
          ? basePath + questionData.thumbnail
          : null,
        text: questionData.description,
        publishStatus: questionData.publish_status,
        owner: questionData.creator_id,
        creator: questionData.original_creator_id,
        standards: serializer
          .get('taxonomySerializer')
          .normalizeTaxonomyObject(standards),
        hints: null, //TODO
        explanation: null, //TODO
        isVisibleOnProfile:
          typeof questionData.visible_on_profile !== 'undefined'
            ? questionData.visible_on_profile
            : true,
        order: questionData.sequence_id || index + 1,
        metadata: metadata,
        audience:
          metadata.audience && metadata.audience.length > 0
            ? metadata.audience
            : [],
        depthOfknowledge:
          metadata.depth_of_knowledge && metadata.depth_of_knowledge.length > 0
            ? metadata.depth_of_knowledge
            : [],
        courseId: questionData.course_id,
        unitId: questionData.unit_id,
        lessonId: questionData.lesson_id,
        collectionId: questionData.collection_id
      }
    );

    const answers = serializer.normalizeAnswerArray(
      questionData.answer,
      format
    );
    if (question.get('isHotSpotImage')) {
      answers.forEach(function(answer) {
        //adding the basepath for HS Image
        answer.set('text', basePath + answer.get('text'));
      });
    }
    question.set('answers', answers);

    if (question.get('isLegacyFIB')) {
      //this logic support old FIB question format, it is necessary only for the editor
      question.updateLegacyFIBText();
    }

    if (question.get('isOpenEnded')) {
      question.set(
        'rubric',
        serializer
          .get('rubricSerializer')
          .normalizeRubric(questionData.rubric, [])
      );
    }

    return question;
  },

  /**
   * Normalize an array of answers
   *
   * @param answerArray array of answers coming from the endpoint
   * @returns {AnswerModel[]}
   */
  normalizeAnswerArray: function(answerArray, format) {
    const serializer = this;
    let result = Ember.A([]);
    if (answerArray && Ember.isArray(answerArray)) {
      result = answerArray.map(function(answerData) {
        return serializer.normalizeAnswer(answerData, format);
      });
    }
    return result;
  },

  /**
   * Normalize a single answer into a Answer object
   *
   * @param answerData Answer data
   * @returns {Answer}
   */
  normalizeAnswer: function(answerData, format) {
    const id =
      format !== 'MA'
        ? window.btoa(encodeURIComponent(answerData.answer_text))
        : `answer_${answerData.sequence}`;
    return AnswerModel.create(Ember.getOwner(this).ownerInjection(), {
      id: id,
      sequence: answerData.sequence,
      isCorrect: answerData.is_correct === 1 || answerData.is_correct === true,
      text: answerData.answer_text,
      type: answerData.answer_type,
      highlightType: answerData.highlight_type
    });
  }
});
