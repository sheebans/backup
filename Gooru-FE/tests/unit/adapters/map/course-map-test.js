import { test } from 'ember-qunit';
import moduleForAdapter from 'gooru-web/tests/helpers/module-for-adapter';
import MapContext from 'gooru-web/models/map/map-context';
import MapSuggestion from 'gooru-web/models/map/map-suggestion';
import { ASSESSMENT_SUB_TYPES } from 'gooru-web/config/config';

moduleForAdapter(
  'adapter:map/course-map',
  'Unit | Adapter | map/course-map',
  {
    // needs: []
  }
);

test('getLessonInfo', function(assert) {
  const adapter = this.subject();
  const expectedData = 'any-data';
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v2/course-map/course-id/units/unit-id/lessons/lesson-id',
      () => [200, { 'Content-Type': 'text/plain' }, expectedData],
      false
    );
  });
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  let done = assert.async();
  adapter
    .getLessonInfo('class-id', 'course-id', 'unit-id', 'lesson-id')
    .then(response => {
      assert.equal(response, expectedData, 'Response should match');
      done();
    });
});

test('createNewPath', function(assert) {
  let adapter = this.subject();
  let expectedResponse = 1;
  this.pretender.map(function() {
    this.post(
      '/api/nucleus/v2/course-map/paths',
      function(request) {
        let requestBodyJson = JSON.parse(request.requestBody);
        assert.equal(
          requestBodyJson.ctx_course_id,
          'course-id',
          'Wrong ctx_course_id'
        );
        assert.equal(
          requestBodyJson.ctx_unit_id,
          'unit-id',
          'Wrong ctx_unit_id'
        );
        assert.equal(
          requestBodyJson.ctx_lesson_id,
          'lesson-id',
          'Wrong ctx_lesson_id'
        );
        assert.equal(
          requestBodyJson.ctx_collection_id,
          null,
          'Wrong ctx_collection_id'
        );
        assert.equal(
          requestBodyJson.ctx_class_id,
          undefined,
          'Wrong ctx_class_id'
        );
        assert.equal(
          requestBodyJson.parent_path_id,
          undefined,
          'Wrong parent_path_id'
        );
        assert.equal(
          requestBodyJson.target_content_type,
          'collection',
          'Wrong target_content_type'
        );
        assert.equal(
          requestBodyJson.target_content_subtype,
          ASSESSMENT_SUB_TYPES.PRE_TEST,
          'Wrong target_content_subtype'
        );
        //assert.equal(requestBodyJson['target_course_id'], 'course-id', 'Wrong target_course_id');
        //assert.equal(requestBodyJson['target_unit_id'], 'unit-id', 'Wrong target_unit_id');
        //assert.equal(requestBodyJson['target_lesson_id'], 'lesson-id', 'Wrong target_lesson_id');
        assert.equal(
          requestBodyJson.target_collection_id,
          'suggestion-id',
          'Wrong target_collection_id'
        );
        return [
          201,
          { 'Content-Type': 'text/plain', Location: expectedResponse },
          undefined
        ];
      },
      false
    );
  });
  let done = assert.async();
  let context = MapContext.create({
    courseId: 'course-id',
    unitId: 'unit-id',
    lessonId: 'lesson-id',
    collectionId: null
  });
  let suggestion = MapSuggestion.create({
    id: 'suggestion-id',
    type: 'collection',
    subType: ASSESSMENT_SUB_TYPES.PRE_TEST
  });
  adapter.createNewPath(context, suggestion).then(response => {
    assert.equal(response, expectedResponse, 'Response should match');
    done();
  });
});

test('createNewPath resource', function(assert) {
  let adapter = this.subject();
  let expectedResponse = 1;
  this.pretender.map(function() {
    this.post(
      '/api/nucleus/v2/course-map/paths',
      function(request) {
        let requestBodyJson = JSON.parse(request.requestBody);
        assert.equal(
          requestBodyJson.ctx_course_id,
          'course-id',
          'Wrong ctx_course_id'
        );
        assert.equal(
          requestBodyJson.ctx_unit_id,
          'unit-id',
          'Wrong ctx_unit_id'
        );
        assert.equal(
          requestBodyJson.ctx_lesson_id,
          'lesson-id',
          'Wrong ctx_lesson_id'
        );
        assert.equal(
          requestBodyJson.ctx_collection_id,
          null,
          'Wrong ctx_collection_id'
        );
        assert.equal(
          requestBodyJson.ctx_class_id,
          undefined,
          'Wrong ctx_class_id'
        );
        assert.equal(
          requestBodyJson.parent_path_id,
          undefined,
          'Wrong parent_path_id'
        );
        assert.equal(
          requestBodyJson.target_content_type,
          'resource',
          'Wrong target_content_type'
        );
        assert.equal(
          requestBodyJson.target_content_subtype,
          null,
          'Wrong target_content_subtype'
        );
        //assert.equal(requestBodyJson['target_course_id'], 'course-id', 'Wrong target_course_id');
        //assert.equal(requestBodyJson['target_unit_id'], 'unit-id', 'Wrong target_unit_id');
        //assert.equal(requestBodyJson['target_lesson_id'], 'lesson-id', 'Wrong target_lesson_id');
        assert.equal(
          requestBodyJson.target_collection_id,
          null,
          'Wrong target_collection_id'
        );
        assert.equal(
          requestBodyJson.target_resource_id,
          'suggestion-id',
          'Wrong target_resource_id'
        );
        return [
          201,
          { 'Content-Type': 'text/plain', Location: expectedResponse },
          undefined
        ];
      },
      false
    );
  });
  let done = assert.async();
  let context = MapContext.create({
    courseId: 'course-id',
    unitId: 'unit-id',
    lessonId: 'lesson-id',
    collectionId: null
  });
  let suggestion = MapSuggestion.create({
    id: 'suggestion-id',
    type: 'resource',
    subType: ASSESSMENT_SUB_TYPES.RESOURCE
  });
  adapter.createNewPath(context, suggestion).then(response => {
    assert.equal(response, expectedResponse, 'Response should match');
    done();
  });
});

test('createNewPath backfill', function(assert) {
  let adapter = this.subject();
  let expectedResponse = 1;
  this.pretender.map(function() {
    this.post(
      '/api/nucleus/v2/course-map/paths',
      function(request) {
        let requestBodyJson = JSON.parse(request.requestBody);
        assert.equal(
          requestBodyJson.ctx_course_id,
          'course-id',
          'Wrong ctx_course_id'
        );
        assert.equal(
          requestBodyJson.ctx_unit_id,
          'unit-id',
          'Wrong ctx_unit_id'
        );
        assert.equal(
          requestBodyJson.ctx_lesson_id,
          'lesson-id',
          'Wrong ctx_lesson_id'
        );
        assert.equal(
          requestBodyJson.ctx_collection_id,
          null,
          'Wrong ctx_collection_id'
        );
        assert.equal(
          requestBodyJson.ctx_class_id,
          undefined,
          'Wrong ctx_class_id'
        );
        assert.equal(requestBodyJson.parent_path_id, 1, 'Wrong parent_path_id');
        assert.equal(
          requestBodyJson.target_content_type,
          'collection',
          'Wrong target_content_type'
        );
        assert.equal(
          requestBodyJson.target_content_subtype,
          null,
          'Wrong target_content_subtype'
        );
        //assert.equal(requestBodyJson['target_course_id'], 'course-id', 'Wrong target_course_id');
        //assert.equal(requestBodyJson['target_unit_id'], 'unit-id', 'Wrong target_unit_id');
        //assert.equal(requestBodyJson['target_lesson_id'], 'lesson-id', 'Wrong target_lesson_id');
        assert.equal(
          requestBodyJson.target_collection_id,
          'suggestion-id',
          'Wrong target_collection_id'
        );
        return [
          201,
          { 'Content-Type': 'text/plain', Location: expectedResponse },
          undefined
        ];
      },
      false
    );
  });
  let done = assert.async();
  let context = MapContext.create({
    courseId: 'course-id',
    unitId: 'unit-id',
    lessonId: 'lesson-id',
    collectionId: null,
    pathId: 1
  });
  let suggestion = MapSuggestion.create({
    id: 'suggestion-id',
    type: 'collection',
    subType: ASSESSMENT_SUB_TYPES.BACKFILL
  });
  adapter.createNewPath(context, suggestion).then(response => {
    assert.equal(response, expectedResponse, 'Response should match');
    done();
  });
});
