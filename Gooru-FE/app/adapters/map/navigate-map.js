import Ember from 'ember';

/**
 * Adapter to support the navigate map operations
 *
 * @typedef {Object} NavigateMapAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service(),

  namespace: '/api/navigate-map/v1',

  /**
   * Calls the next map navigation api
   *
   * @param {*} userId
   * @returns {Promise|Object}
   */
  next: function(context) {
    const namespace = this.get('namespace');
    const url = `${namespace}/next`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: this.defineHeaders(),
      data: JSON.stringify(context)
    };

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax(url, options).then(resolve, reject);
    });
  },

  /**
   * Calls the get current map location api
   *
   * @param {string} courseId
   * @param {string} classId
   * @returns {Promise|Object}
   */
  getCurrentMapContext: function(courseId, classId = undefined) {
    const namespace = this.get('namespace');
    const url = `${namespace}/context`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.defineHeaders(),
      data: {
        course_id: courseId,
        class_id: classId
      }
    };

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax(url, options).then(resolve, reject);
    });
  },

  defineHeaders: function() {
    return {
      Authorization: `Token ${this.get('session.token-api3')}`
    };
  }
});
