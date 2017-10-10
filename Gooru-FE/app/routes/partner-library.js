import Ember from 'ember';
import PublicRouteMixin from 'gooru-web/mixins/public-route-mixin';

/**
 * Partner library route
 *
 * @module
 * @augments Ember.Route
 */

export default Ember.Route.extend(PublicRouteMixin, {
  queryParams: {
    refresh: {
      refreshModel: true
    }
  },

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {libraryService} Library service object
   */
  libraryService: Ember.inject.service('api-sdk/library'),

  // -------------------------------------------------------------------------
  // Methods

  model: function(params) {
    const libraryId = params.id;
    return Ember.RSVP.hash({
      library: this.get('libraryService').fetchById(libraryId)
    });
  },

  redirect: function() {
    const currentUrl = this.get('router.url');
    const isRoot = currentUrl.split('/').length - 1 === 2;
    if (isRoot) {
      this.transitionTo('partner-library.content.courses');
    }
  },

  setupController: function(controller, model) {
    controller.set('library', model.library);
  }
});
