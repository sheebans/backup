import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';
import ResourceAnswer from 'gooru-web/models/resource/answer';

const Validations = buildValidations({
  text: {
    validators: [
      validator('presence', {
        presence: true,
        message: '{{description}}',
        descriptionKey: 'common.errors.add-question-answer-text'
      }),
      validator('hot-text-highlight', {
        answerNotSelectedKey: 'common.errors.highlight-text-not-selected',
        wrongFormatKey: 'common.errors.highlight-text-wrong-format'
      })
    ]
  }
});

/**
 * Answer model
 * typedef {Object} Answer
 */
const Answer = Ember.Object.extend(Validations, {
  /**
   * @property {Number} sequence - The order sequence of the answer
   */
  sequence: 0,

  /**
   * @property {Boolean} isCorrect - Indicates if the answer is correct or not
   */
  isCorrect: false,

  /**
   * @property {String} text - The answer text
   */
  text: null,

  /**
   * @property {String} type - The answer type
   */
  type: null,

  /**
   * @property {String} highlightType - The highlight type for hot text highlight answers
   */
  highlightType: null,

  /**
   * Return a copy of the answer
   *
   * @function
   * @return {Answer}
   */
  copy: function() {
    var properties = [];
    var enumerableKeys = Object.keys(this);

    for (let i = 0; i < enumerableKeys.length; i++) {
      let key = enumerableKeys[i];
      let value = Ember.typeOf(this.get(key));
      if (value === 'string' || value === 'number' || value === 'boolean') {
        properties.push(key);
      }
    }

    // Copy the question data
    properties = this.getProperties(properties);

    return Answer.create(Ember.getOwner(this).ownerInjection(), properties);
  },

  /**
   * Returns a player answer object.
   * @returns {Answer}
   */
  toPlayerAnswer: function() {
    const answer = this;
    return ResourceAnswer.create({
      id: answer.get('id'),
      text: answer.get('text'),
      answerType: answer.get('type'),
      order: answer.get('sequence'),
      isCorrect: answer.get('isCorrect'),
      highlightType: answer.get('highlightType')
    });
  }
});

export default Answer;
