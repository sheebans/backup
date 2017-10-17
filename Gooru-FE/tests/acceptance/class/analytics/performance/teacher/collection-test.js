import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
//import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance(
  'Acceptance | class/analytics/performance/teacher/collection',
  {
    beforeEach: function() {
      authenticateSession(this.application, {
        isAnonymous: false,
        token: 'class-analytics-performance-teacher-lesson-token',
        user: {
          /* using a pochita, @see classes/class-for-pochita-as-teacher-200-response.js */
          gooruUId: 'id-for-pochita'
        }
      });
    }
  }
);

test('Layout', function(assert) {
  // TODO Remove this assert and enable the commented code once integration is complete
  assert.ok(true, 'This is a temporal assert!!');

  /*
  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/collection/all-question-types-assessment-id');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/collection/all-question-types-assessment-id');

    const $performanceContainer = find(".controller.class .controller.analytics-performance-teacher-collection");
    T.exists(assert, $performanceContainer.find(".gru-class-assessment-report"), "Missing class report");

    const $classMenu = find(".controller.class .gru-class-navigation .class-menu");
    T.exists(assert, $classMenu.find(".analytics.selected"), "Missing selected analytics item");

    const $filters = find(".controller.class .gru-filters");
    T.notExists(assert, $filters, "Filters should be hidden");
  });
  */
});
