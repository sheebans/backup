import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForAdapter from 'gooru-web/tests/helpers/module-for-adapter';

moduleForAdapter(
  'adapter:content/class-activity',
  'Unit | Adapter | content/class-activity',
  {
    // needs: []
  }
);

test('addActivityToClass with no context', function(assert) {
  assert.expect(10);

  const adapter = this.subject();
  adapter.set(
    'session',
    Ember.Object.create({
      'token-api3': 'token-api-3'
    })
  );
  this.pretender.map(function() {
    this.post(
      '/api/nucleus/v2/classes/123/contents',
      function(request) {
        let requestBodyJson = JSON.parse(request.requestBody);
        assert.equal(requestBodyJson.class_id, 123, 'Wrong class id');
        assert.equal(requestBodyJson.content_id, 321, 'Wrong content id');
        assert.equal(
          requestBodyJson.content_type,
          'assessment',
          'Wrong content type'
        );
        assert.equal(
          moment(requestBodyJson.dca_added_date).format('YYYY-MM-DD'),
          '2013-01-20',
          'Wrong added date'
        );
        assert.notOk(
          requestBodyJson.ctx_course_id,
          'ctx_course_id should be undefined'
        );
        assert.notOk(
          requestBodyJson.ctx_unit_id,
          'ctx_unit_id should be undefined'
        );
        assert.notOk(
          requestBodyJson.ctx_lesson_id,
          'ctx_lesson_id should be undefined'
        );
        assert.notOk(
          requestBodyJson.ctx_collection_id,
          'ctx_collection_id should be undefined'
        );
        assert.equal(
          request.requestHeaders.Authorization,
          'Token token-api-3',
          'Wrong token'
        );
        return [201, { 'Content-Type': 'text/plain' }, ''];
      },
      false
    );
  });
  adapter
    .addActivityToClass(123, 321, 'assessment', new Date(2013, 0, 20))
    .then(function(response) {
      assert.equal('', response, 'Wrong response');
    });
});

test('addActivityToClass with context', function(assert) {
  assert.expect(10);

  const adapter = this.subject();
  adapter.set(
    'session',
    Ember.Object.create({
      'token-api3': 'token-api-3'
    })
  );
  this.pretender.map(function() {
    this.post(
      '/api/nucleus/v2/classes/123/contents',
      function(request) {
        let requestBodyJson = JSON.parse(request.requestBody);
        assert.equal(requestBodyJson.class_id, 123, 'Wrong class id');
        assert.equal(requestBodyJson.content_id, 321, 'Wrong content id');
        assert.equal(
          requestBodyJson.content_type,
          'assessment',
          'Wrong content type'
        );
        assert.equal(
          moment(requestBodyJson.dca_added_date).format('YYYY-MM-DD'),
          '2013-01-20',
          'Wrong added date'
        );
        assert.equal(
          requestBodyJson.ctx_course_id,
          10,
          'ctx_course_id should be 10'
        );
        assert.equal(
          requestBodyJson.ctx_unit_id,
          20,
          'ctx_unit_id should be 20'
        );
        assert.equal(
          requestBodyJson.ctx_lesson_id,
          30,
          'ctx_lesson_id should be 30'
        );
        assert.equal(
          requestBodyJson.ctx_collection_id,
          40,
          'ctx_collection_id should be 40'
        );
        assert.equal(
          request.requestHeaders.Authorization,
          'Token token-api-3',
          'Wrong token'
        );
        return [201, { 'Content-Type': 'text/plain' }, ''];
      },
      false
    );
  });
  adapter
    .addActivityToClass(123, 321, 'assessment', new Date(2013, 0, 20), {
      courseId: 10,
      unitId: 20,
      lessonId: 30,
      collectionId: 40
    })
    .then(function(response) {
      assert.equal('', response, 'Wrong response');
    });
});

test('enableClassActivity', function(assert) {
  assert.expect(2);

  const adapter = this.subject();
  adapter.set(
    'session',
    Ember.Object.create({
      'token-api3': 'token-api-3'
    })
  );
  this.pretender.map(function() {
    this.put(
      '/api/nucleus/v2/classes/123/contents/321',
      function(request) {
        //let requestBodyJson = JSON.parse(request.requestBody);
        //assert.equal(requestBodyJson.activation_date, '2012-11-13', 'Wrong activation date');
        assert.equal(
          request.requestHeaders.Authorization,
          'Token token-api-3',
          'Wrong token'
        );
        return [201, { 'Content-Type': 'text/plain' }, ''];
      },
      false
    );
  });
  adapter.enableClassActivity(123, 321).then(function(response) {
    assert.equal('', response, 'Wrong response');
  });
});

test('findClassActivities with no content type', function(assert) {
  assert.expect(3);

  const adapter = this.subject();
  adapter.set(
    'session',
    Ember.Object.create({
      'token-api3': 'token-api-3'
    })
  );
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v2/classes/123/contents',
      function(request) {
        assert.ok(
          !request.queryParams.content_type,
          'Content type should be undefined'
        );
        assert.equal(
          request.requestHeaders.Authorization,
          'Token token-api-3',
          'Wrong token'
        );
        return [
          201,
          { 'Content-Type': 'application/json' },
          JSON.stringify('fake-response')
        ];
      },
      false
    );
  });
  adapter.findClassActivities(123).then(function(response) {
    assert.equal('fake-response', response, 'Wrong response');
  });
});

test('findClassActivities with content type and dates', function(assert) {
  assert.expect(5);

  const adapter = this.subject();
  adapter.set(
    'session',
    Ember.Object.create({
      'token-api3': 'token-api-3'
    })
  );
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v2/classes/123/contents',
      function(request) {
        assert.equal(
          request.queryParams.content_type,
          'assessment',
          'Content type should be assessment'
        );
        assert.equal(
          moment(request.queryParams.date_from).format('YYYY-MM-DD'),
          '2012-01-20',
          'Wrong start date'
        );
        assert.equal(
          moment(request.queryParams.date_to).format('YYYY-MM-DD'),
          '2012-01-30',
          'Wrong end date'
        );
        assert.equal(
          request.requestHeaders.Authorization,
          'Token token-api-3',
          'Wrong token'
        );
        return [
          201,
          { 'Content-Type': 'application/json' },
          JSON.stringify('fake-response')
        ];
      },
      false
    );
  });
  adapter
    .findClassActivities(
      123,
      'assessment',
      new Date(2012, 0, 20),
      new Date(2012, 0, 30)
    )
    .then(function(response) {
      assert.equal('fake-response', response, 'Wrong response');
    });
});

test('removeClassActivity', function(assert) {
  const adapter = this.subject();
  adapter.set(
    'session',
    Ember.Object.create({
      'token-api3': 'token-api-3'
    })
  );
  this.pretender.map(function() {
    this.delete(
      '/api/nucleus/v2/classes/class-id/contents/content-id',
      function() {
        return [204, { 'Content-Type': 'application/json; charset=utf-8' }, ''];
      },
      false
    );
  });
  adapter.removeClassActivity('class-id', 'content-id').then(function() {
    assert.ok(true);
  });
});
