import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

moduleForComponent(
  '/class/analytics/performance/teacher/gru-metrics-performance-information',
  'Integration | Component | /class/analytics/performance/teacher/gru-metrics-performance-information',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);
test('Metrics performance information Layout', function(assert) {
  assert.expect(4);

  const dataPickerOptionsMock = Ember.A(['score', 'completion']);
  const performanceDataMock = Ember.Object.create({
    score: 50,
    timeSpent: 3600,
    completionDone: 16,
    completionTotal: 32,
    headerTitle: 'header test',
    hideScore: false
  });

  this.set('dataPickerOptions', dataPickerOptionsMock);
  this.set('performanceData', performanceDataMock);

  this.render(
    hbs`{{class/analytics/performance/teacher/gru-metrics-performance-information performanceData=performanceData dataPickerOptions=dataPickerOptions}}`
  );

  const $component = this.$(); //component dom element

  var $score = $component.find('.score');
  T.exists(assert, $score, 'Missing score cell');

  var $completion = $component.find('.gru-completion-chart');
  T.exists(assert, $completion, 'Missing gru-completion-chart component');

  var $studyTime = $component.find('.study-time');
  T.notExists(assert, $studyTime, 'study time cell should not be visible');

  var $report = $component.find('.report');
  T.notExists(assert, $report, 'report cell should not be visible');
});

test('When hiding the score', function(assert) {
  assert.expect(4);

  const dataPickerOptionsMock = Ember.A(['score', 'completion']);
  const performanceDataMock = Ember.Object.create({
    score: 50,
    timeSpent: 3600,
    completionDone: 16,
    completionTotal: 32,
    headerTitle: 'header test',
    hideScore: true
  });

  this.set('dataPickerOptions', dataPickerOptionsMock);
  this.set('performanceData', performanceDataMock);

  this
    .render(hbs`{{class/analytics/performance/teacher/gru-metrics-performance-information
  performanceData=performanceData
  userPerformance='fakeUserPerformance'
  dataPickerOptions=dataPickerOptions}}`);

  const $component = this.$(); //component dom element

  var $score = $component.find('.score');
  T.notExists(assert, $score, 'Score cell should not be visible');

  var $notApplicable = $component.find('.not-applicable');
  T.exists(assert, $notApplicable, 'Missing N/A');

  var $completion = $component.find('.gru-completion-chart');
  T.exists(assert, $completion, 'Missing gru-completion-chart component');

  var $studyTime = $component.find('.study-time');
  T.notExists(assert, $studyTime, 'study time cell should not be visible');
});

test('When clicking the report', function(assert) {
  assert.expect(3);

  const dataPickerOptionsMock = Ember.A(['score', 'completion']);
  const performanceDataMock = Ember.Object.create({
    score: 50,
    timeSpent: 3600,
    completionDone: 16,
    completionTotal: 32,
    headerTitle: 'header test',
    hasStarted: true
  });

  this.set('dataPickerOptions', dataPickerOptionsMock);
  this.set('showReport', true);
  this.set('performanceData', performanceDataMock);

  this.on('clickReport', function(performance, userPerformance) {
    assert.equal(performance.get('score'), 50, 'Wrong score');
    assert.equal(
      userPerformance,
      'fakeUserPerformance',
      'Wrong user performance'
    );
  });

  this
    .render(hbs`{{class/analytics/performance/teacher/gru-metrics-performance-information
      onClickReport='clickReport'
      userPerformance='fakeUserPerformance'
      performanceData=performanceData
      dataPickerOptions=dataPickerOptions
      showReport=showReport}}`);

  const $component = this.$();

  var $report = $component.find('.report span');
  assert.ok($component.find('.report.pointer'), 'Missing report tooltip');
  $report.click();
  return wait();
});
