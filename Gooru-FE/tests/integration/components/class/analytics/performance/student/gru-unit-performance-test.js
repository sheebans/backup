import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';

moduleForComponent(
  'class/analytics/performance/student/gru-unit-performance',
  'Integration | Component | class/analytics/performance/student/gru unit performance',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Test for unit performance for assessment', function(assert) {
  const unitPerformance = Ember.Object.create({
    id: 'unit-id-1',
    title: 'Unit 1',
    type: 'unit',
    score: 75,
    completionDone: 5,
    completionTotal: 10,
    timeSpent: 3600000,
    ratingScore: null,
    attempts: 2,
    displayableTimeSpent: '1h',
    isCompleted: false,
    hasStarted: true,
    isUnitOrLesson: true
  });
  const classModel = Ember.Object.create({
    id: 'class-id-1',
    course: 'course-id-1'
  });

  this.set('userId', 'user-id-1');
  this.set('classModel', classModel);
  this.set('unit', unitPerformance);
  this.set('index', 0);
  this.set('selectedLessonId', 'non-selected-lesson');
  this.set('selectedUnitId', 'non-selected-unit');

  assert.expect(7);

  this.render(hbs`{{class.analytics.performance.student.gru-unit-performance
    unit=unit
    classModel=classModel
    userId=userId
    localIndex=index
    selectedLessonId=selectedLessonId
    selectedUnitId=selectedUnitId
    onLocationUpdate=onLocationUpdate
    updateSelectedLesson=updateSelectedLesson
  }}`);

  const $component = this.$();
  T.exists(assert, $component, 'Missing Unit Container');

  const $titleElement = $component.find('.unit-lesson .section-title');
  assert.ok($titleElement.length, 'Missing unit title');

  const $scoreElement = $component.find(
    '.gru-performance-summary .score .score-box'
  );
  assert.equal(T.text($scoreElement), '75%', 'Wrong unit score');

  const $completionElement = $component.find(
    '.gru-performance-summary .completion .gru-completion-chart span'
  );
  assert.equal(T.text($completionElement), '5/10', 'Wrong unit completion');

  const $timeSpentElement = $component.find(
    '.gru-performance-summary .timeSpent p'
  );
  assert.equal(T.text($timeSpentElement), '1h', 'Wrong unit timeSpent');

  const $reactionElement = $component.find(
    '.gru-performance-summary .reaction p'
  );
  assert.equal(T.text($reactionElement), '', 'Wrong unit reaction');

  const $attemptsElement = $component.find(
    '.gru-performance-summary .attempts p'
  );
  assert.equal(T.text($attemptsElement), '2', 'Wrong unit attempts');
});

test('Test for unit performance filtering by collection', function(assert) {
  const unitPerformance = Ember.Object.create({
    id: 'unit-id-1',
    title: 'Unit 1',
    type: 'unit',
    score: 75,
    completionDone: 5,
    completionTotal: 10,
    timeSpent: 3600000,
    ratingScore: null,
    attempts: 2,
    displayableTimeSpent: '1h',
    isCompleted: false,
    hasStarted: true,
    isUnitOrLesson: true
  });
  const classModel = Ember.Object.create({
    id: 'class-id-1',
    course: 'course-id-1'
  });

  this.set('userId', 'user-id-1');
  this.set('classModel', classModel);
  this.set('unit', unitPerformance);
  this.set('index', 0);
  this.set('selectedLessonId', 'non-selected-lesson');
  this.set('selectedUnitId', 'non-selected-unit');

  assert.expect(7);

  this.render(hbs`{{class.analytics.performance.student.gru-unit-performance
    unit=unit
    classModel=classModel
    userId=userId
    localIndex=index
    selectedLessonId=selectedLessonId
    selectedUnitId=selectedUnitId
    onLocationUpdate=onLocationUpdate
    updateSelectedLesson=updateSelectedLesson
    selectedFilterBy='collection'
  }}`);

  const $component = this.$();
  T.exists(assert, $component, 'Missing Unit Container');

  const $titleElement = $component.find('.unit-lesson .section-title');
  assert.ok($titleElement.length, 'Missing unit title');

  const $scoreElement = $component.find(
    '.gru-performance-summary .score .score-box'
  );
  assert.ok(
    !$scoreElement.length,
    'Score should not be visible when filtering by collection'
  );

  const $completionElement = $component.find(
    '.gru-performance-summary .completion .gru-completion-chart span'
  );
  assert.equal(T.text($completionElement), '5/10', 'Wrong unit completion');

  const $timeSpentElement = $component.find(
    '.gru-performance-summary .timeSpent p'
  );
  assert.equal(T.text($timeSpentElement), '1h', 'Wrong unit timeSpent');

  const $reactionElement = $component.find(
    '.gru-performance-summary .reaction p'
  );
  assert.equal(T.text($reactionElement), '', 'Wrong unit reaction');

  const $attemptsElement = $component.find(
    '.gru-performance-summary .attempts p'
  );
  assert.equal(T.text($attemptsElement), '2', 'Wrong unit attempts');
});
