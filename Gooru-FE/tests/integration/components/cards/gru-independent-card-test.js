import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Location from 'gooru-web/models/learner/location';
import Performance from 'gooru-web/models/learner/performance';

moduleForComponent(
  'cards/gru-independent-card',
  'Integration | Component | cards/gru independent card',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('Layout course', function(assert) {
  this.set(
    'location',
    Location.create(Ember.getOwner(this).ownerInjection(), {
      title: 'course-title',
      type: 'course',
      currentId: 'collection-id',
      currentTitle: 'current-title',
      currentType: 'collection',
      lastAccessed: '2017-03-07 18:44:04.798',
      courseId: 'course-id'
    })
  );

  this.set(
    'performance',
    Performance.create(Ember.getOwner(this).ownerInjection(), {
      completedCount: 5,
      totalCount: 10,
      scoreInPercentage: 90,
      timeSpent: 4000
    })
  );

  this.render(
    hbs`{{cards/gru-independent-card location=location performance=performance}}`
  );

  const $component = this.$(); //component dom element
  const $card = $component.find('.gru-independent-card');
  const $panel = $card.find('.panel');
  const $panelHeading = $panel.find('.panel-heading');
  const $panelBody = $panel.find('.panel-body');

  T.exists(assert, $card, 'Missing course card section');
  T.exists(assert, $panel, 'Missing course card panel');
  T.exists(assert, $panelHeading, 'Missing course card panel heading');
  T.notExists(
    assert,
    $panelHeading.find('.check'),
    'Check should not appear when the course is incompleted'
  );
  T.exists(assert, $panelBody, 'Missing course card panel body');
  assert.equal(
    T.text($panelHeading.find('h5')),
    'course-title',
    'Wrong course title text'
  );

  T.exists(
    assert,
    $panelBody.find('.charts .performance .charts.gru-bubble-chart'),
    'Missing gru-bubble-chart component'
  );
  assert.equal(
    T.text(
      $panelBody.find(
        '.charts .performance .charts.gru-bubble-chart .bubble-circle span'
      )
    ),
    '90%',
    'Wrong performance score'
  );
  assert.equal(
    T.text($panelBody.find('.charts .performance span:eq(1)')),
    this.get('i18n').t('student-landing.class.performance').string,
    'Wrong performance chart label'
  );

  T.exists(
    assert,
    $panelBody.find('.charts .completed .charts.gru-radial-chart'),
    'Missing gru-radial-chart component'
  );
  assert.equal(
    T.text($panelBody.find('.charts .completed .charts.gru-radial-chart text')),
    '50%',
    'Wrong completed score'
  );
  assert.equal(
    T.text($panelBody.find('.charts .completed span:eq(0)')),
    this.get('i18n').t('common.completed').string,
    'Wrong completed chart label'
  );

  T.notExists(
    assert,
    $panelBody.find('.charts .time-spent'),
    'Missing time spent chart component'
  );

  T.exists(
    assert,
    $panelBody.find('.information'),
    'Missing course information'
  );
  assert.equal(
    T.text($panelBody.find('.information span:eq(0)')),
    this.get('i18n').t('student-landing.current-activity').string,
    'Wrong current activity label'
  );
  assert.equal(
    T.text($panelBody.find('.information .current-activity')),
    'current-title',
    'Wrong current activity'
  );

  assert.equal(
    T.text($panelBody.find('.information .last-access')),
    '6:44pm Mar. 7 2017',
    'Wrong last access'
  );
  T.notExists(
    assert,
    $panelBody.find('.information .collection-report'),
    'Missing collection report link'
  );
});

test('Layout course completed', function(assert) {
  this.set(
    'location',
    Location.create(Ember.getOwner(this).ownerInjection(), {
      title: 'course-title',
      type: 'course',
      currentId: 'collection-id',
      currentTitle: 'current-title',
      currentType: 'collection',
      lastAccessed: '2017-03-07 18:44:04.798',
      courseId: 'course-id',
      status: 'complete'
    })
  );

  this.set(
    'performance',
    Performance.create(Ember.getOwner(this).ownerInjection(), {
      completedCount: 10,
      totalCount: 10,
      scoreInPercentage: 0,
      timeSpent: 4000
    })
  );

  this.render(
    hbs`{{cards/gru-independent-card location=location performance=performance}}`
  );

  const $component = this.$(); //component dom element
  const $card = $component.find('.gru-independent-card');
  const $panel = $card.find('.panel');
  const $panelBody = $panel.find('.panel-body');
  assert.ok(
    $card.find('.panel-heading span.check').length,
    'Missing check icon'
  );
  assert.notOk(
    $card.find('.information .activity .not-applicable').length,
    'N/A should not appear'
  );
  assert.notOk(
    $card.find('.information .activity .collection-report').length,
    'Collection report should not appear'
  );
  assert.ok(
    $card.find('.information .activity .current-activity').length,
    'Current activity should appear'
  );
  assert.equal(
    T.text(
      $panelBody.find(
        '.charts .performance .charts.gru-bubble-chart .bubble-circle span'
      )
    ),
    '0%',
    'Wrong performance score'
  );
});

test('Layout course with no activity', function(assert) {
  this.set(
    'location',
    Location.create(Ember.getOwner(this).ownerInjection(), {
      title: 'course-title',
      type: 'course',
      lastAccessed: '2017-03-07 18:44:04.798',
      courseId: 'course-id',
      status: 'complete'
    })
  );

  this.set(
    'performance',
    Performance.create(Ember.getOwner(this).ownerInjection(), {
      completedCount: 10,
      totalCount: 10,
      scoreInPercentage: 0,
      timeSpent: 4000
    })
  );

  this.render(
    hbs`{{cards/gru-independent-card location=location performance=performance}}`
  );

  const $component = this.$(); //component dom element
  const $card = $component.find('.gru-independent-card');
  const $panel = $card.find('.panel');
  const $panelBody = $panel.find('.panel-body');
  assert.ok(
    $card.find('.panel-heading span.check').length,
    'Missing check icon'
  );
  assert.ok(
    $card.find('.information .activity .not-applicable').length,
    'Activity should be N/A'
  );
  assert.notOk(
    $card.find('.information .activity .collection-report').length,
    'Collection report should not appear'
  );
  assert.notOk(
    $card.find('.information .activity .current-activity').length,
    'Current activity should appear'
  );
  assert.equal(
    T.text(
      $panelBody.find(
        '.charts .performance .charts.gru-bubble-chart .bubble-circle span'
      )
    ),
    '0%',
    'Wrong performance score'
  );
});

test('Layout course not completed', function(assert) {
  this.set(
    'location',
    Location.create(Ember.getOwner(this).ownerInjection(), {
      title: 'course-title',
      type: 'course',
      currentId: 'collection-id',
      currentTitle: 'current-title',
      currentType: 'collection',
      lastAccessed: '2017-03-07 18:44:04.798',
      courseId: 'course-id',
      status: ''
    })
  );

  this.render(hbs`{{cards/gru-independent-card location=location}}`);

  const $component = this.$(); //component dom element
  const $card = $component.find('.gru-independent-card');
  assert.notOk(
    $card.find('.panel-heading span.check').length,
    'Check icon should not appear'
  );
  assert.notOk(
    $card.find('.information .activity .not-applicable').length,
    'N/A should not appear'
  );
  assert.notOk(
    $card.find('.information .activity .collection-report').length,
    'Collection report should not appear'
  );
  assert.ok(
    $card.find('.information .activity .current-activity').length,
    'Current activity should appear'
  );
});

test('Layout collection/assessment', function(assert) {
  this.set(
    'location',
    Location.create(Ember.getOwner(this).ownerInjection(), {
      title: 'collection-title',
      type: 'collection',
      lastAccessed: '2017-03-07 18:44:04.798'
    })
  );

  this.set(
    'performance',
    Performance.create(Ember.getOwner(this).ownerInjection(), {
      timeSpent: 4000
    })
  );

  this.render(
    hbs`{{cards/gru-independent-card location=location performance=performance}}`
  );

  const $component = this.$(); //component dom element
  const $card = $component.find('.gru-independent-card');
  const $panel = $card.find('.panel');
  const $panelHeading = $panel.find('.panel-heading');
  const $panelBody = $panel.find('.panel-body');

  T.exists(assert, $card, 'Missing course card section');
  T.exists(assert, $panel, 'Missing course card panel');
  T.exists(assert, $panelHeading, 'Missing course card panel heading');
  T.exists(assert, $panelBody, 'Missing course card panel body');
  assert.equal(
    T.text($panelHeading.find('h5')),
    'collection-title',
    'Wrong course title text'
  );

  T.notExists(
    assert,
    $panelBody.find('.charts .performance .charts.gru-bubble-chart'),
    'Missing gru-bubble-chart component'
  );
  T.notExists(
    assert,
    $panelBody.find('.charts .completed .charts.gru-radial-chart'),
    'Missing gru-radial-chart component'
  );

  T.exists(
    assert,
    $panelBody.find('.charts .time-spent'),
    'Missing time spent chart component'
  );
  assert.equal(
    T.text(
      $panelBody.find(
        '.charts .time-spent .charts.gru-bubble-chart .bubble-circle span'
      )
    ),
    '4s',
    'Wrong time spent'
  );

  T.exists(
    assert,
    $panelBody.find('.information'),
    'Missing course information'
  );
  T.exists(
    assert,
    $panelBody.find('.information .activity'),
    'Missing activity information'
  );

  assert.equal(
    T.text($panelBody.find('.information .last-access')),
    '6:44pm Mar. 7 2017',
    'Wrong last access'
  );
});

test('Layout collection/assessment completed', function(assert) {
  this.set(
    'location',
    Location.create(Ember.getOwner(this).ownerInjection(), {
      title: 'collection-title',
      type: 'collection',
      status: 'complete'
    })
  );

  this.render(
    hbs`{{cards/gru-independent-card location=location performance=performance}}`
  );

  const $component = this.$(); //component dom element
  const $card = $component.find('.gru-independent-card');
  assert.ok(
    $card.find('.panel-heading span.check').length,
    'Missing check icon'
  );
  assert.notOk(
    $card.find('.information .activity .not-applicable').length,
    'N/A should not appear'
  );
  assert.ok(
    $card.find('.information .activity .collection-report').length,
    'Collection report should appear'
  );
  assert.notOk(
    $card.find('.information .activity .current-activity').length,
    'Current activity should not appear'
  );
});

test('Layout collection/assessment  not completed', function(assert) {
  this.set(
    'location',
    Location.create(Ember.getOwner(this).ownerInjection(), {
      title: 'collection-title',
      type: 'collection',
      status: ''
    })
  );

  this.render(
    hbs`{{cards/gru-independent-card location=location performance=performance}}`
  );

  const $component = this.$(); //component dom element
  const $card = $component.find('.gru-independent-card');
  assert.notOk(
    $card.find('.panel-heading span.check').length,
    'Check icon should not'
  );
  assert.ok(
    $card.find('.information .activity .not-applicable').length,
    'N/A should not appear'
  );
  assert.notOk(
    $card.find('.information .activity .collection-report').length,
    'Collection report should not appear'
  );
  assert.notOk(
    $card.find('.information .activity .current-activity').length,
    'Current activity should not appear'
  );
});
