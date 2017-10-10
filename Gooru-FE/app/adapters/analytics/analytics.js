import Ember from 'ember';

export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus-insights/v2',

  queryRecord: function(query) {
    const namespace = this.get('namespace');
    const classId = query.classId;
    const courseId = query.courseId;
    const unitId = query.unitId;
    const lessonId = query.lessonId;
    const collectionId = query.collectionId;
    const collectionType = query.collectionType;
    const url = `${namespace}/class/${classId}/course/${courseId}/unit/${unitId}/lesson/${lessonId}/${collectionType}/${collectionId}/performance`;
    const options = {
      type: 'GET',
      dataType: 'json',
      headers: this.defineHeaders(),
      data: {}
    };
    return Ember.$.ajax(url, options);
  },

  getStandardsSummary: function(sessionId, userId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/session/${sessionId}/taxonomy/usage`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.defineHeaders(),
      data: {
        userUid: userId
      }
    };
    return Ember.$.ajax(url, options);
  },

  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
