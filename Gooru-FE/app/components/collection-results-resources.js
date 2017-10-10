import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * @property {object} Collection item
   */
  collection: null,

  /**
   * @property {array} List of resources of the collection
   */
  resources: null,

  /**
   * @property {boolean} Indicates if collection has 1 or more resources
   */
  hasResources: Ember.computed.gt('collection.resourceCount', 0),

  /**
   * @property {boolean} Indicates if collection has more than 1 resource
   */
  hasSeveralResources: Ember.computed.gt('collection.resourceCount', 1),

  /**
   * @property {boolean} Indicates if collection has 1 or more questions
   */
  hasQuestions: Ember.computed.gt('collection.questionCount', 0),

  /**
   * @property {boolean} Indicates if collection has more than 1 question
   */
  hasSeveralQuestions: Ember.computed.gt('collection.questionCount', 1)
});
