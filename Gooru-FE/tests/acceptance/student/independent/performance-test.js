import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | student/independent/performance', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-course-map-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('My report', function(assert) {
  visit('/student/course/course-for-pochita-as-student');
  andThen(function() {
    let $MyReport = find('.performance.tab a');
    click($MyReport);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/student/course/course-for-pochita-as-student/performance?courseId=course-123&lessonId=637e7599-96de-4459-83cb-c72bd47ae4b0&unitId=first-unit-id'
      );
    });
  });
});
