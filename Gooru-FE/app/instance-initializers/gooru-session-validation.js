import Ember from 'ember';

/**
 * Initialize session validation function
 */
export function initialize(application) {
  const sessionService = application.lookup('service:session');

  Ember.$(document).ajaxError(function(event, jqXHR) {
    if (jqXHR.status === 401) {
      sessionService.invalidate();
    }
  });
}

export default {
  name: 'gooru-session-validation',
  after: 'gooru-session-service',
  initialize: initialize
};
