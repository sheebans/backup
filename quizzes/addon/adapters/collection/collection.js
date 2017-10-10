import TokenMixin from 'quizzes-addon/mixins/token';
import ApplicationAdapter from 'quizzes-addon/adapters/application';

export default ApplicationAdapter.extend(TokenMixin, {
  /**
   * @property {string} End-point URI
   */
  namespace: '/quizzes/api/v1/collections',

  /**
   * Reads a Collection by id
   *
   * @param {string} collectionId
   * @param {string} type collection|assessment
   * @param {boolean} refresh indicates if the data should be refreshed from the repository
   * @returns {Promise}
   */
  readCollection: function(collectionId, type, refresh = false) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${collectionId}?type=${type}&refresh=${refresh}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  }
});
