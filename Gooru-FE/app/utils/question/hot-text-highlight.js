import Ember from 'ember';
import QuestionUtil from './question';
import AnswerObject from 'gooru-web/utils/question/answer-object';
/**
 * It contains convenience methods for grading and retrieving useful information
 * for hot text highlight
 *
 * # Answer object (structure required by the BE)
 *
 *   It is an array containing a json object for each user selection
 *
 *   text the text entered by the user, it also include inputs left blank
 *   status could be correct or incorrect based on the text entered
 *   order represents the text index, starting at 1
 *   answerId it is always 0
 *   skip is always false
 *
 * [{"text":"Tell","status":"incorrect","order":1,"answerId":0,"skip":false},
 * {"text":"nos.","status":"correct","order":14,"answerId":0,"skip":false},
 * {"text":"parens","status":"correct","order":31,"answerId":0,"skip":false}]
 *
 * # User answer (structure used by the FE)
 *
 *   It corresponds to an array representing the texts entered by the user
 *
 *   index represents the index of the text in the question, starting 0
 *   text the entered text
 *
 *   { {index: number, text: string }[] }
 *
 * @typedef {Object} HotTextHighlightUtil
 */
export default QuestionUtil.extend({
  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Indicates if the answer choice is correct
   * @param { { index: number, text: string } } answerChoice
   *
   * @see '# User Answer' section at class comment
   */
  isAnswerChoiceCorrect: function(answerChoice) {
    let correctAnswer = this.getCorrectAnswer();
    let found = correctAnswer.findBy('index', answerChoice.index);
    return found !== null && found !== undefined; //if found
  },

  /**
   * Gets the correct answer
   * The question text contains the information for the correct answer, correct items are wrapped by []
   * i.e La casa es de [colo] pero el [teco] es azul
   * @return {{index: number, text: string }[]} returns the correct answer items
   *
   * @see '# User Answer' section at class comment
   */
  getCorrectAnswer: function() {
    const items = this.getItems();
    return items.filterBy('correct', true).map(function(item) {
      return { index: item.get('index'), text: item.get('text') };
    });
  },

  /**
   * Gets items based on text format.
   * This methods creates an item for each word in the text, it removes []
   * i.e La casa es de [colo] pero el [teco] es azul
   * @param {string} text
   * @returns {{index: number, text: string, selected: boolean}} items
   */
  getWordItems: function(text) {
    const util = this,
      words = Ember.A(text.split(' '));

    return util.toItems(words);
  },

  /**
   * Gets items based on text format
   * Each text before, after and in between [] are considered sentences
   * @param {string} text i.e Sentence 1 [Sentence 2] Sentence 3 with any text here [Sentence 4] Sentence 5
   *
   * @returns {{index: number, text: string, selected: boolean}} items
   */
  getSentenceItems: function(text) {
    const util = this,
      regex = /(\[.*?\.])/gm,
      items = text.split(regex);

    let result = [];
    items.forEach(function(item) {
      if (!regex.exec(item)) {
        // split consecutive non correct sentences
        result = result.concat(item.replace(/\. /gm, '.@').split('@'));
      } else {
        result.push(item);
      }
    });
    return util.toItems(result);
  },

  /**
   * Transforms the text so it is compliant with hot text highlight question.
   * It removes the initial/wrapping <p> tag if available
   * @param {string} text
   * @returns {string}
   */
  transformText: function(text) {
    const regex = /^<p>(.*)<\/p>$/gm,
      match = regex.exec(text);
    return match ? match[1].trim() : text;
  },

  /**
   * Transforms a list of string into item objects, it trims the texts and removes []
   * @param {string[]} textList
   *
   * @returns {{index: number, text: string, selected: boolean, correct: boolean}} items
   */
  toItems: function(textList) {
    textList = textList.filter(function(text) {
      let trimmed = text.trim();
      return trimmed || trimmed.length;
    });

    return textList.map(function(text, index) {
      let correct = text.indexOf('[') >= 0 && text.indexOf(']') > 0;
      return Ember.Object.create({
        index: index,
        text: text.replace('[', '').replace(']', '').trim(),
        selected: false,
        correct: correct
      });
    });
  },

  /**
   * Generate phrase items from the first question answer text
   * It handle word and sentence variants, and it sets the 'items' component property accordingly
   */
  getItems: function() {
    const util = this,
      question = util.get('question'),
      answers = question.get('answers');

    var items = Ember.A();
    if (question.get('hasAnswers')) {
      const answer = answers.get('firstObject'),
        text = util.transformText(answer.get('text'));

      if (question.get('isHotTextHighlightWord')) {
        items = util.getWordItems(text);
      } else {
        items = util.getSentenceItems(text);
      }
    }

    return items;
  },

  /**
   * Returns a unique key representing the answer
   * For hot text the answer is an array of string
   * @param { {index: number, text: string }[] } answer
   * @returns {string} i.e 1,2,3
   *
   * @see '# User Answer' section at class comment
   */
  answerKey: function(answer) {
    let indexes = answer.map(function(item) {
      return item.index;
    });
    return indexes.sort().join();
  },

  /**
   * Converts the model user answer into an answerObject format
   *
   * @param { {index: number, text: string }[] } userAnswer answer ids in selected order
   * @return {AnswerObject[]}
   *
   * @see '# User Answer' section at class comment
   * @see '# Answer Object' section at class comment
   */
  toAnswerObjects: function(userAnswer) {
    let util = this;
    return userAnswer.map(function(selection) {
      let index = selection.index;
      return AnswerObject.create({
        text: selection.text,
        correct: util.isAnswerChoiceCorrect(selection),
        order: index + 1,
        answerId: 0,
        skip: false
      });
    });
  },

  /**
   * Converts an answerObject format to model userAnswer
   *
   * @param {AnswerObject[]} answerObjects
   * @return {{index: number, text: string }[]} answer ids in selected order
   *
   * @see '# User Answer' section at class comment
   * @see '# Answer Object' section at class comment
   */
  toUserAnswer: function(answerObjects) {
    return !answerObjects || !answerObjects.length
      ? null //if not respond is provided
      : answerObjects.map(function(answerObject) {
        return {
          index: answerObject.get('order') - 1,
          text: answerObject.get('text')
        };
      });
  }
});
