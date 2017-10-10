import Ember from 'ember';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Attributes

  queryParams: [
    'token',
    'classId',
    'page',
    'unitId',
    'lessonId',
    'collectionId',
    'sourceId',
    'collectionType'
  ]
  // -------------------------------------------------------------------------
  // Properties
});
