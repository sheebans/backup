import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'gooru-web/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';
import Assessment from 'gooru-web/models/content/assessment';
import Collection from 'gooru-web/models/content/collection';
import ClassActivity from 'gooru-web/models/content/class-activity';
import ActivityPerformanceSummary from 'gooru-web/models/performance/activity-performance-summary';
import tHelper from 'ember-i18n/helper';

moduleForComponent(
  'class/gru-student-class-activity-panel',
  'Integration | Component | class/gru student class activity panel',
  {
    integration: true,
    beforeEach: function() {
      this.i18n = this.container.lookup('service:i18n');
      this.i18n.set('locale', 'en');
      this.registry.register('helper:t', tHelper);
    }
  }
);

test('Layout', function(assert) {
  const collectionMock = Assessment.create(
    Ember.getOwner(this).ownerInjection(),
    {
      id: '3-1',
      format: 'assessment',
      openEndedQuestionCount: 0,
      questionCount: 4,
      resourceCount: 0,
      title: 'The Early Earth',
      members: [],
      visible: true,
      isOnAir: true
    }
  );

  const performance = Ember.Object.create({
    score: 100,
    timeSpent: 5400000,
    isCompleted: true
  });

  const classActivity = ClassActivity.create({
    activationDate: null, //inactive
    collection: collectionMock,
    activityPerformanceSummary: ActivityPerformanceSummary.create({
      collectionPerformanceSummary: performance
    })
  });

  this.set('classActivity', classActivity);

  this.render(
    hbs`{{class.gru-student-class-activity-panel classActivity=classActivity}}`
  );

  var $component = this.$(); //component dom element
  const $collectionPanel = $component.find(
    '.gru-student-class-activity-panel.panel'
  );
  T.exists(assert, $collectionPanel, 'Missing class collection panel');

  const $collectionTitle = $collectionPanel.find('.panel-title');
  assert.ok($collectionTitle.length, 'Panel title element is missing');

  const $collectionIcon = $collectionTitle.find('.icon-container .gru-icon');
  assert.ok($collectionIcon.length, 'Collection icon is missing');

  const $collectionTitleAnchor = $collectionTitle.find('.title');
  assert.ok($collectionTitleAnchor.length, 'Title anchor element is missing');

  const $collectionTitleText = $collectionTitle.find('.title .text');
  assert.ok($collectionTitleText.length, 'Title text element is missing');
  assert.equal(
    T.text($collectionTitleText),
    'The Early Earth',
    'Wrong title text'
  );

  const $collectionTitleType = $collectionTitle.find('.title .type');
  assert.ok($collectionTitleType.length, 'Title type element is missing');
  assert.equal(
    T.text($collectionTitleType),
    this.get('i18n').t('common.assessment').string,
    'Wrong title type'
  );

  const $collectionInfo = $collectionPanel.find('.info');
  assert.ok($collectionInfo.length, 'Collection Info element is missing');

  const $collectionContentCount = $collectionInfo.find('.content-count');
  assert.ok($collectionContentCount.length, 'Content count panel is missing');
  assert.equal(
    T.text($collectionContentCount.find('.question-count')),
    '4 Questions',
    'Wrong  question count text'
  );

  assert.ok(
    $collectionInfo.find('.left-info .score').length,
    'Score info element is missing'
  );
});

test('Layout - collection', function(assert) {
  const collectionMock = Collection.create(
    Ember.getOwner(this).ownerInjection(),
    {
      id: '3-1',
      format: 'collection',
      openEndedQuestionCount: 0,
      questionCount: 2,
      resourceCount: 4,
      title: 'The Early Earth',
      members: [],
      visible: true,
      isOnAir: true
    }
  );

  const performance = Ember.Object.create({
    score: 100,
    completionDone: 44,
    completionTotal: 50,
    timeSpent: 5400000,
    isCompleted: true
  });
  const classActivity = ClassActivity.create({
    activationDate: null, //inactive
    collection: collectionMock,
    activityPerformanceSummary: ActivityPerformanceSummary.create({
      collectionPerformanceSummary: performance
    })
  });

  this.set('classActivity', classActivity);

  this.render(
    hbs`{{class.gru-student-class-activity-panel classActivity=classActivity}}`
  );

  var $component = this.$(); //component dom element
  const $collectionPanel = $component.find(
    '.gru-student-class-activity-panel.panel'
  );

  const $collectionInfo = $collectionPanel.find('.info');
  assert.ok($collectionInfo.length, 'Collection Info element is missing');

  const $collectionContentCount = $collectionInfo.find('.content-count');
  assert.ok($collectionContentCount.length, 'Content count panel is missing');
  assert.equal(
    T.text($collectionContentCount.find('.resource-count')),
    '4 Resources',
    'Wrong  resource count text'
  );
  assert.equal(
    T.text($collectionContentCount.find('.question-count')),
    '2 Questions',
    'Wrong  question count text'
  );
});
