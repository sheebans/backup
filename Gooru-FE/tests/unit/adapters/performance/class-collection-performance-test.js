import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'adapter:performance/class-collection-performance',
  'Unit | Adapter | performance/class-collection-performance',
  {}
);

test('urlForQueryRecord method for collection class performance', function(
  assert
) {
  const adapter = this.subject();
  const query = {
    classId: 'the-class-id',
    courseId: 'the-course-id',
    unitId: 'the-unit-id',
    lessonId: 'the-lesson-id'
  };
  const url = adapter.urlForQueryRecord(query);

  //assert.equal(url, '/mocked-api/insights/api/v2/class/the-class-id/course/the-course-id/unit/the-unit-id/lesson/the-lesson-id/performance', 'Wrong url');
  assert.equal(
    url,
    '/api/nucleus-insights/v2/class/the-class-id/course/the-course-id/unit/the-unit-id/lesson/the-lesson-id/performance',
    'Wrong url'
  );
});
