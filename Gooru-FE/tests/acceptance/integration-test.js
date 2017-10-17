import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | integration', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'token-value',
      user: {
        providedAt: Date.now()
      }
    });
  }
});

test('integration route to not valid page', function(assert) {
  visit(
    '/integration/teams?token=any-token&classId=class-for-pochita-as-teacher&page=unexistant-page'
  );
  andThen(function() {
    assert.expect(1);
    assert.equal(currentURL(), '/sign-in');
  });
});

test('integration route to info', function(assert) {
  visit(
    '/integration/teams?token=any-token&classId=class-for-pochita-as-teacher&page=class-info'
  );
  andThen(function() {
    assert.expect(1);
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/info');
  });
});

test('integration route to data analytics page in a teacher class', function(
  assert
) {
  visit(
    '/integration/teams?token=any-token&classId=class-for-pochita-as-teacher&page=teacher-data'
  );
  andThen(function() {
    assert.expect(1);
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
    );
  });
});

test('integration route to data analytics page in a student class', function(
  assert
) {
  visit(
    '/integration/teams?token=any-token&classId=class-for-pochita-as-student&page=student-data'
  );

  andThen(function() {
    assert.expect(1);
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-student/analytics/performance/student'
    );
  });
});

test('integration route to overview', function(assert) {
  visit(
    '/integration/teams?token=any-token&classId=class-for-pochita-as-student&page=course-map'
  );

  andThen(function() {
    assert.expect(1);
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-student/overview?location=first-unit-id%2Bfirst-lesson-id%2Bfirst-assessment-id'
    );
  });
});

test('integration route to overview with unit id', function(assert) {
  visit(
    '/integration/teams?token=any-token&classId=class-for-pochita-as-student&page=course-map&unitId=first-unit-id'
  );

  andThen(function() {
    assert.expect(1);
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-student/overview?location=first-unit-id'
    );
  });
});

test('integration route to overview with unit id and lesson id', function(
  assert
) {
  visit(
    '/integration/teams?token=any-token&classId=class-for-pochita-as-student&page=course-map&unitId=first-unit-id&lessonId=first-lesson-id'
  );

  andThen(function() {
    assert.expect(1);
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-student/overview?location=first-unit-id-first-lesson-id'
    );
  });
});

test('integration route to overview with unit id and lesson id and collection id', function(
  assert
) {
  visit(
    '/integration/teams?token=any-token&classId=class-for-pochita-as-student&page=course-map&unitId=first-unit-id&lessonId=first-lesson-id&collectionId=first-assessment-id'
  );

  andThen(function() {
    assert.expect(1);
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-student/overview?location=first-unit-id-first-lesson-id-first-assessment-id'
    );
  });
});

test('integration route to player with collection id and type', function(
  assert
) {
  visit(
    '/integration/teams?token=any-token&page=player&collectionId=all-resource-types-collection-id&collectionType=collection'
  );

  andThen(function() {
    assert.expect(1);
    assert.equal(
      currentURL(),
      '/player/all-resource-types-collection-id?resourceId=image-resource-id&role=teacher&type=collection'
    );
  });
});

test('integration route to player with collection id and type and source id', function(
  assert
) {
  visit(
    '/integration/teams?token=any-token&page=player&collectionId=all-resource-types-collection-id&collectionType=collection&sourceId=123'
  );

  andThen(function() {
    assert.expect(1);
    assert.equal(
      currentURL(),
      '/player/all-resource-types-collection-id?resourceId=image-resource-id&role=teacher&sourceId=123&type=collection'
    );
  });
});
