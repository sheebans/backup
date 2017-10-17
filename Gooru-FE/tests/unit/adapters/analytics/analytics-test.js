import { moduleFor, test } from 'ember-qunit';
import Pretender from 'pretender';
import Ember from 'ember';

moduleFor(
  'adapter:analytics/analytics',
  'Unit | Adapter | analytics/analytics',
  {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
    beforeEach: function() {
      this.pretender = new Pretender();
    },
    afterEach: function() {
      this.pretender.shutdown();
    }
  }
);

test('queryRecord', function(assert) {
  const adapter = this.subject();
  assert.expect(1);
  const query = {
    classId: 'the-class-id',
    courseId: 'the-course-id',
    unitId: 'the-unit-id',
    lessonId: 'the-lesson-id',
    collectionId: 'the-collection-id',
    collectionType: 'the-collection-type'
  };
  const routes = function() {
    this.get(
      '/api/nucleus-insights/v2/class/the-class-id/course/the-course-id/unit/the-unit-id/lesson/the-lesson-id/the-collection-type/the-collection-id/performance',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.queryRecord(query).then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('getStandardsSummary', function(assert) {
  const adapter = this.subject();
  adapter.set(
    'session',
    Ember.Object.create({
      'token-api3': 'token-api-3'
    })
  );

  assert.expect(3);
  this.pretender.map(function() {
    this.get(
      '/api/nucleus-insights/v2/session/12345/taxonomy/usage',
      function(request) {
        assert.equal(request.queryParams.userUid, '23', 'Wrong user id param');
        assert.equal(
          request.requestHeaders.Authorization,
          'Token token-api-3',
          'Wrong token'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  });

  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  var done = assert.async();
  adapter.getStandardsSummary(12345, '23').then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
    done();
  });
});
