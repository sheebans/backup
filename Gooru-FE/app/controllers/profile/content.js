import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import ContentSearch from 'gooru-web/models/search/content-search';

export default Ember.Controller.extend(ModalMixin, {
  queryParams: ['term', 'sortOn', 'order'],

  // -------------------------------------------------------------------------
  // Dependencies

  parentController: Ember.inject.controller('profile'),

  coursesController: Ember.inject.controller('profile.content.courses'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * A link to the parent profile controller
   * @see controllers/profile.js
   * @property {Class}
   */
  profile: Ember.computed.reads('parentController.profile'),

  /**
   * A link to the computed property isMyProfile in profile controller
   * @see controllers/profile.js
   * @property {isMyProfile}
   */
  isMyProfile: Ember.computed.reads('parentController.isMyProfile'),

  /**
   * Search term object
   */
  searchObject: null,

  /**
   * Search term
   */
  term: null,

  /**
   * sortOn to filter
   */
  sortOn: 'updated_at',

  /**
   * order to filter
   */
  order: 'desc',

  /**
   * Indicate if the selected profile bar is Course
   */
  disableSearch: Ember.computed.alias('coursesController.disableSearch'),

  actions: {
    /**
     *Term to search by keyword
     */
    searchByTerm: function(term) {
      this.set('term', term);
    },

    /**
     *Filter by most recent
     */
    filterByDate: function() {
      if (this.get('sortOn') === 'title') {
        this.set('order', 'desc');
        this.set('sortOn', 'updated_at');
      } else {
        this.set('order', this.get('order') === 'asc' ? 'desc' : 'asc');
      }
    },

    /**
     *Filter by alphanumeric
     */
    filterByTitle: function() {
      if (this.get('sortOn') === 'updated_at') {
        this.set('order', 'asc');
        this.set('sortOn', 'title');
      } else {
        this.set('order', this.get('order') === 'desc' ? 'asc' : 'desc');
      }
    },

    clearContent: function() {
      this.set('term', '');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * init and reset all the properties for the validations
   */
  resetProperties: function() {
    var controller = this;
    var searchObject = ContentSearch.create(
      Ember.getOwner(this).ownerInjection(),
      {
        term: ''
      }
    );
    controller.set('searchObject', searchObject);
  }
});
