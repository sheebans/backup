import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Context from 'quizzes-addon/models/context/context';
import Collection from 'quizzes-addon/models/collection/collection';

moduleForComponent(
  'player/qz-player-confirmation',
  'Integration | Component | player/qz player confirmation',
  {
    integration: true
  }
);

test('Player confirmation Layout No more attempts', function(assert) {
  assert.expect(8);
  const attempts = 2;
  const collection = Collection.create({
    settings: {
      attempts: 2
    },
    isAssessment: true
  });
  const context = Context.create({
    title: 'context-title'
  });

  this.on('closePlayer', function() {
    assert.ok(true, 'Back should be called');
  });

  this.set('attempts', attempts);
  this.set('context', context);
  this.set('collection', collection);
  this.render(
    hbs`{{player/qz-player-confirmation attempts=attempts collection=collection context=context onClosePlayer='closePlayer'}}`
  );
  var $component = this.$();
  const $back = $component.find(
    '.qz-player-confirmation .panel-body .actions .back'
  );
  assert.ok(
    $component.find('.qz-player-confirmation').length,
    'Player confirmation component should appear'
  );
  assert.ok(
    $component.find('.qz-player-confirmation .panel-heading h3').length,
    'Missing title'
  );
  assert.ok(
    $component.find('.qz-player-confirmation .panel-body .description').length,
    'Missing description'
  );
  assert.ok(
    $component.find('.qz-player-confirmation .panel-body .no-more-attempts')
      .length,
    'Missing no more attempts lead'
  );
  assert.ok($back.length, 'Back button should appear');
  assert.notOk(
    $component.find('.qz-player-confirmation .panel-body .actions .start')
      .length,
    'Start button should not appear'
  );
  assert.notOk(
    $component.find('.qz-player-confirmation .panel-body .actions .continue')
      .length,
    'Continue button should not appear'
  );
  $back.click();
});

test('Player confirmation Layout has more attempts', function(assert) {
  assert.expect(5);
  const attempts = 2;
  const collection = Collection.create({
    settings: {
      attempts: 4
    },
    isAssessment: true
  });
  const context = Context.create({
    title: 'context-title'
  });
  this.set('attempts', attempts);
  this.set('context', context);
  this.set('collection', collection);
  this.on('closePlayer', function() {
    assert.ok(true, 'Cancel should be called');
  });
  this.render(
    hbs`{{player/qz-player-confirmation attempts=attempts collection=collection context=context onClosePlayer='closePlayer'}}`
  );
  var $component = this.$();
  const $cancel = $component.find(
    '.qz-player-confirmation .panel-body .actions button.cancel'
  );
  assert.notOk(
    $component.find('.qz-player-confirmation .panel-body .no-more-attempts')
      .length,
    'Missing no more attempts lead'
  );
  assert.equal(
    $component
      .find('.qz-player-confirmation .panel-body .actions button')
      .prop('disabled'),
    false,
    'Start button should not be disabled'
  );
  assert.ok($cancel.length, 'Cancel button should be displayed');
  assert.notOk(
    $component.find('.qz-player-confirmation .panel-body .actions .back')
      .length,
    'Back button should not appear'
  );
  $cancel.click();
});

test('Player confirmation Layout Not bidirectional', function(assert) {
  const attempts = 2;
  const collection = Collection.create({
    settings: {
      attempts: 4,
      bidirectional: false
    },
    isAssessment: true
  });
  const context = Context.create({
    title: 'context-title'
  });
  this.set('attempts', attempts);
  this.set('context', context);
  this.set('collection', collection);
  this.render(
    hbs`{{player/qz-player-confirmation attempts=attempts collection=collection context=context}}`
  );
  var $component = this.$();
  assert.notOk(
    $component.find('.qz-player-confirmation p.bidirectional').length,
    'Bidirectional lead should not appear'
  );
  assert.ok(
    $component.find('.qz-player-confirmation p.not-bidirectional').length,
    'Not bidirectional lead should appear'
  );
});
