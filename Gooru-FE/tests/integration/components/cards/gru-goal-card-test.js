import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleForComponent(
  'cards/gru-goal-card',
  'Integration | Component | cards/gru goal card',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

var mockGoal = Ember.Object.create({
  id: 'goal-id',
  title: 'My Fitness Goal',
  description: 'This is Description to Goal',
  start_date: 1409175049,
  end_date: 1409175049,
  status: 'not_started',
  reflection: 'need to do better'
});

test('Goal Card Layout', function(assert) {
  this.set('goal', mockGoal);

  this.render(hbs`{{cards/gru-goal-card goal=goal}}`);

  var $component = this.$(); //component dom element

  const $goalCard = $component.find('.gru-goal-card.collapsed');
  const $panel = $goalCard.find('.panel');
  const $panelHeading = $panel.find('.panel-heading');
  const $panelBody = $panel.find('.panel-body');
  const $panelFooter = $panel.find('.panel-footer');

  T.exists(assert, $goalCard, 'Missing collapsed goal card section');
  T.exists(assert, $panel, 'Missing goal card panel');
  T.exists(assert, $panelHeading, 'Missing goal card panel heading');
  T.exists(assert, $panelBody, 'Missing goal card panel body');
  T.exists(assert, $panelFooter, 'Missing goal card panel footer');

  T.exists(assert, $panelHeading.find('.icon'), 'Missing goal icon title');
  T.exists(assert, $panelHeading.find('.title'), 'Missing goal title');
  assert.equal(
    T.text($panelHeading.find('.title')),
    'My Fitness Goal',
    'Wrong text title'
  );

  T.exists(assert, $panelBody.find('.date'), 'Missing goal icon date');
  T.exists(assert, $panelBody.find('.status'), 'Missing goal status');
  T.notExists(
    assert,
    $panelBody.find('.reflection'),
    'Reflection should not be visible'
  );

  assert.notEqual(T.text($panelBody.find('.date')), '', 'date not empty');
  assert.equal(
    T.text($panelBody.find('.status')),
    'Status - Not Started',
    'Wrong text status'
  );

  T.exists(
    assert,
    $panelFooter.find('.expand-collapse i.keyboard_arrow_down'),
    'Missing expand icon'
  );
  T.exists(assert, $panelFooter.find('.actions'), 'Missing goal actions');
  T.exists(
    assert,
    $panelFooter.find('.actions .edit-item'),
    'Missing goal edit action'
  );
  T.exists(
    assert,
    $panelFooter.find('.actions .delete-item'),
    'Missing goal delete action'
  );
});

test('Goal Card Layout - expanded', function(assert) {
  this.set('goal', mockGoal);

  this.render(hbs`{{cards/gru-goal-card goal=goal expanded=true}}`);

  var $component = this.$(); //component dom element

  const $goalCard = $component.find('.gru-goal-card.expanded');
  const $panel = $goalCard.find('.panel');
  const $panelBody = $panel.find('.panel-body');
  const $panelFooter = $panel.find('.panel-footer');

  T.exists(assert, $goalCard, 'Missing expanded goal card section');
  T.exists(assert, $panel, 'Missing goal card panel');
  T.exists(assert, $panelBody, 'Missing goal card panel body');
  T.exists(assert, $panelFooter, 'Missing goal card panel footer');

  T.exists(assert, $panelBody.find('.reflection'), 'Missing reflection');
  T.exists(
    assert,
    $panelFooter.find('.expand-collapse i.keyboard_arrow_up'),
    'Missing collapse icon'
  );
});

test('Goal Card - expand collapse', function(assert) {
  this.set('goal', mockGoal);

  this.render(hbs`{{cards/gru-goal-card goal=goal}}`);

  var $component = this.$(); //component dom element

  const $goalCard = $component.find('.gru-goal-card.collapsed');

  T.exists(assert, $goalCard, 'Missing collapsed goal card section');
  T.notExists(
    assert,
    $goalCard.find('.reflection'),
    'Reflection should not be visible'
  );
  T.exists(
    assert,
    $goalCard.find('.expand-collapse i.keyboard_arrow_down'),
    'Missing expand icon'
  );

  $goalCard.find('.expand-collapse').click(); //click the arrow

  return wait().then(function() {
    T.exists(
      assert,
      $component.find('.gru-goal-card.expanded'),
      'Missing expanded goal card'
    );
    T.exists(assert, $goalCard.find('.reflection'), 'Missing reflection');
    T.exists(
      assert,
      $goalCard.find('.expand-collapse i.keyboard_arrow_up'),
      'Missing collapse icon'
    );

    $goalCard.find('> .collapse').click(); //click at the blue bar
    return wait().then(function() {
      T.exists(
        assert,
        $component.find('.gru-goal-card.collapsed'),
        'Missing collapsed goal card section'
      );
      T.notExists(
        assert,
        $goalCard.find('.reflection'),
        'Reflection should not be visible'
      );
      T.exists(
        assert,
        $goalCard.find('.expand-collapse i.keyboard_arrow_down'),
        'Missing expand icon'
      );
    });
  });
});

test('Goal Card - delete goal', function(assert) {
  assert.expect(1);

  this.set('goal', mockGoal);
  this.on('deleteGoal', function(goal) {
    assert.equal(goal.get('id'), 'goal-id', 'Wrong id');
  });

  this.render(hbs`{{cards/gru-goal-card goal=goal onDelete='deleteGoal'}}`);
  var $component = this.$(); //component dom element

  const $goalCard = $component.find('.gru-goal-card.collapsed');

  $goalCard.find('.delete-item').click(); //click the arrow

  return wait();
});
