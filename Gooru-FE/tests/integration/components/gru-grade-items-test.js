import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';

moduleForComponent(
  'gru-grade-items',
  'Integration | Component | gru grade items',
  {
    integration: true
  }
);

test('Layout', function(assert) {
  const questionItems = Ember.A([
    {
      unitPrefix: 'U1',
      lessonPrefix: 'L1',
      collection: Ember.Object.create({
        title: 'First Assessment'
      }),
      question: Ember.Object.create({
        title: 'Rubric OP Question'
      }),
      studentCount: 10
    },
    {
      unitPrefix: 'U2',
      lessonPrefix: 'L2',
      collectionName: 'First Collection',
      questionName: 'Collection OP Question',
      studentCount: 20
    }
  ]);

  this.set('questionItems', questionItems);
  this.render(hbs`{{gru-grade-items questionItems=questionItems}}`);

  const $component = this.$();

  assert.ok($component.find('.item').length, 2, 'Missing grade items');
  assert.ok(
    $component.find('.item:first-child .context').length,
    'Missing context'
  );
  assert.ok(
    $component.find('.item:first-child .question').length,
    'Missing question'
  );
  assert.ok(
    $component.find('.item:first-child .students').length,
    'Missing student count'
  );
  assert.equal(
    T.text($component.find('.item:eq(0) .context .unit-prefix')),
    'U1',
    'Wrong unit prefix'
  );
  assert.equal(
    T.text($component.find('.item:eq(0) .context .lesson-prefix')),
    'L1',
    'Wrong lesson prefix'
  );
  assert.equal(
    T.text($component.find('.item:eq(0) .context .collection-name')),
    'First Assessment',
    'Wrong collection-name'
  );
  assert.equal(
    T.text($component.find('.item:eq(0) .question .question-name')),
    'Rubric OP Question',
    'Wrong question name'
  );
  assert.equal(
    T.text($component.find('.item:eq(0) .students')),
    '(10 students)',
    'Wrong students count'
  );
});
