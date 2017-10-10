import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * @property {Ember.Service} Service to do the search
   */
  searchService: Ember.inject.service('api-sdk/search'),

  model: function(params) {
    const selectedOptionTypes = params.selectedOptionTypes;
    const taxonomies = this.paramsFor('search').taxonomies;
    const term = this.paramsFor('search').term;
    const options = {
      formats: selectedOptionTypes,
      taxonomies: taxonomies
    };

    var resourceResults = this.get('searchService').searchResources(
      term,
      options,
      true
    );
    return Ember.RSVP
      .hash({
        term: term,
        resources: resourceResults,
        selectedOptionTypes: selectedOptionTypes
      })
      .catch(function(err) {
        if (err.status === 400) {
          return { msg: 'Recovered from rejected promise', error: err };
        }
      });
  },

  /**
   * Set all controller properties used in the template
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('resourceResults', model.resources);
    controller.set('term', model.term);
    controller.resetValues();
    if (model.error) {
      controller.setInvalidSearchTerm(true);
    } else {
      controller.set('selectedOptionTypes', model.selectedOptionTypes);
    }
  },

  deactivate: function() {
    this.get('controller').resetValues();
  }
});
