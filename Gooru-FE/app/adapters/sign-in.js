import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  /**
   * @property {string} End-point URI
   */
  namespace: '/gooruapi/rest/v2/account/login',

  /**
   * Builds the end-point URL using the apiKey as a query string param
   * @param modelName
   * @param id
   * @param snapshot
   * @param requestType
   * @param query
   * @returns {string}
   */
  buildURL: function(modelName, id, snapshot, requestType, query) {
    var apiKeyParam = `apiKey=${this.get('apiKey')}`;
    return `${this._super(
      modelName,
      id,
      snapshot,
      requestType,
      query
    )}?${apiKeyParam}`;
  }
});
