import Ember from 'ember';
import ErrorSerializer from 'gooru-web/serializers/error/error';
import ErrorAdapter from 'gooru-web/adapters/error/error';

export default Ember.Service.extend({
  errorSerializer: null,

  errorAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'errorSerializer',
      ErrorSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'errorAdapter',
      ErrorAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   *
   * @param {Error} error
   * @returns {Test.Promise|*|RSVP.Promise}
   */
  createError: function(error) {
    var service = this;
    Ember.Logger.error(error);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const errorContent = service.get('errorSerializer').serializeError(error);
      service
        .get('errorAdapter')
        .createError({ body: errorContent })
        .then(resolve, reject);
    });
  }
});
