import Ember from 'ember';
import OpenEndedUtil from 'quizzes-addon/utils/question/open-ended';

//Question Types
export const QUESTION_TYPES = {
  singleChoice: 'single_choice',
  multipleAnswer: 'multiple_choice',
  trueFalse: 'true_false',
  openEnded: 'extended_text',
  fib: 'text_entry',
  hotSpotText: 'multiple_choice_text',
  hotSpotImage: 'multiple_choice_image',
  hotTextReorder: 'drag_and_drop',
  hotTextHighlightWord: 'hot_text_word',
  hotTextHighlightSentence: 'hot_text_sentence'
};

//Question type configuration
export const QUESTION_CONFIG = {
  single_choice: Ember.Object.create({
    apiType: 'single_choice_question',
    component: {
      player: 'player.questions.qz-single-choice',
      answer: 'reports.assessment.questions.qz-single-choice'
    }
  }),
  multiple_choice: Ember.Object.create({
    apiType: 'multiple_choice_question',
    component: {
      player: 'player.questions.qz-multiple-answer',
      answer: 'reports.assessment.questions.qz-multiple-answer'
    }
  }),
  drag_and_drop: Ember.Object.create({
    apiType: 'drag_and_drop',
    component: {
      player: 'player.questions.qz-reorder',
      answer: 'reports.assessment.questions.qz-reorder'
    }
  }),
  hot_text_word: Ember.Object.create({
    apiType: 'hot_text_highlight_question',
    component: {
      player: 'player.questions.qz-hot-text-highlight',
      answer: 'reports.assessment.questions.qz-hot-text-highlight'
    }
  }),
  hot_text_sentence: Ember.Object.create({
    apiType: 'hot_text_highlight_question',
    component: {
      player: 'player.questions.qz-hot-text-highlight',
      answer: 'reports.assessment.questions.qz-hot-text-highlight'
    }
  }),
  true_false: Ember.Object.create({
    apiType: 'true_false_question',
    component: {
      player: 'player.questions.qz-true-false',
      answer: 'reports.assessment.questions.qz-true-false'
    }
  }),
  text_entry: Ember.Object.create({
    apiType: 'text_entry_question',
    component: {
      player: 'player.questions.qz-fib',
      answer: 'reports.assessment.questions.qz-fib'
    }
  }),
  multiple_choice_image: Ember.Object.create({
    apiType: 'hot_spot_image_question',
    component: {
      player: 'player.questions.qz-hs-image',
      answer: 'reports.assessment.questions.qz-hs-image'
    }
  }),
  multiple_choice_text: Ember.Object.create({
    apiType: 'multiple_choice_text_question',
    component: {
      player: 'player.questions.qz-hs-text',
      answer: 'reports.assessment.questions.qz-hs-text'
    }
  }),
  extended_text: Ember.Object.create({
    apiType: 'open_ended_question',
    util: OpenEndedUtil,
    component: {
      player: 'player.questions.qz-open-ended',
      answer: 'reports.assessment.questions.qz-open-ended'
    }
  })
};

/**
 * Returns the question config information
 * @param {string} questionType
 * @param {string} propertyPath a valid property path inside the question config object
 */
export function getQuestionConfig(questionType, propertyPath) {
  let config = QUESTION_CONFIG[questionType];

  if (!config) {
    Ember.Logger.error(
      `Questions of type ${questionType} are currently not supported`
    );
  } else if (propertyPath && !config.get(propertyPath)) {
    Ember.Logger.error(
      `Property not found ${propertyPath} for question type ${questionType}`
    );
  } else {
    config = propertyPath ? config.get(propertyPath) : config;
  }

  return config;
}

/**
 * Returns the question type based on apiType
 * @param {string} apiType, a valid question apiType from API 3.0
 */
export function getQuestionTypeByApiType(apiType) {
  let type = null;
  for (var property in QUESTION_CONFIG) {
    if (QUESTION_CONFIG.hasOwnProperty(property)) {
      if (QUESTION_CONFIG[property].apiType === apiType) {
        type = property;
        break;
      }
    }
  }
  return type;
}

/**
 * Gets the question util per question type
 * @param {string} questionType
 * @returns {Object|*}
 */
export function getQuestionUtil(questionType) {
  return getQuestionConfig(questionType, 'util');
}

/**
 * Returns the new question api type for API 3.0
 * @param {string} questionType
 * @returns {string}
 */
export function getQuestionApiType(questionType) {
  return getQuestionConfig(questionType, 'apiType');
}

// LaTeX expressions used in rich text editor
export const LATEX_EXPRESSIONS = {
  fraction: '\\frac{}{}',
  sqrt: '\\sqrt{}',
  sqrtn: '\\sqrt[{}]{}',
  overline: '\\overline{}',
  angles: '\\langle{}',
  sum: '\\sum{}',
  sin: '\\sin\\left({}\\right)',
  cos: '\\cos\\left({}\\right)',
  tan: '\\tan\\left({}\\right)',
  in: '\\in',
  notin: '\\notin',
  exists: '\\exists',
  nexists: '\\nexists',
  ge: '\\ge',
  gt: '\\gt',
  lambda: '\\Lambda',
  omega: '\\Omega',
  infinity: '\\infty',
  subscript: '{}_{}',
  superscript: '{}^{}',
  'over-left-arrow': '\\overleftarrow{}',
  'over-right-arrow': '\\overrightarrow{}',
  div: '\\div',
  plus: '\\+',
  minus: '\\-',
  mult: '\\times',
  cdot: '\\cdot',
  'not-equal': '\\neq',
  lt: '\\lt',
  le: '\\le',
  sim: '\\sim',
  approx: '\\approx',
  alpha: '\\alpha',
  pmatrix: '\\left({}\\right)',
  Bmatrix: '\\left\\{{} \\right\\}',
  vmatrix: '\\left|{} \\right|',
  angle: '\\angle',
  measuredangle: '\\measuredangle',
  bot: '\\bot',
  parallel: '\\parallel',
  sigma: '\\Sigma',
  theta: '\\Theta',
  pi: '\\pi'
};
