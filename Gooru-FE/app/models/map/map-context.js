import Ember from 'ember';

/**
 * MapContext model
 *
 * @typedef {Object} MapContext
 */
const MapContextModel = Ember.Object.extend({
  /**
   * @property {string} courseId
   */
  courseId: null,

  /**
   * @property {string} classId
   */
  classId: null,

  /**
   * @property {string} unitId
   */
  unitId: null,

  /**
   * @property {string} lessonId
   */
  lessonId: null,

  /**
   * @property {string} collectionId
   */
  collectionId: null,

  /**
   * @property {string} collectionType collection/assessment
   */
  collectionType: null,

  /**
   * @property {string} collectionSubType pre-test/post-test/benchmark
   */
  collectionSubType: null,

  /**
   * @property {string} itemId
   */
  itemId: null,

  /**
   * @property {string} itemType collection/assessment/lesson
   */
  itemType: null,

  /**
   * @property {string} status continue/start/suggested
   */
  status: null,

  /**
   * @property {number} pathId
   */
  pathId: null,

  /**
   * @property {number} score
   */
  score: null
});

export default MapContextModel;
