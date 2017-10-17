import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Context from 'quizzes-addon/models/context/context';
import T from 'dummy/tests/helpers/assert';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleForComponent(
  'gru-timestamp-input',
  'Integration | Component | gru timestamp input',
  {
    integration: true
  }
);

test('Timestamp layout', function(assert) {
  assert.expect(4);

  const assignment = Context.create(Ember.getOwner(this).ownerInjection());
  this.set('assignment', assignment);

  this.render(
    hbs`{{gru-timestamp-input model=assignment valuePath='availableDate'  datePath='availableDay'  timePath='availableTime'}}`
  );
  var $timestampInput = this.$();
  assert.ok(
    $timestampInput.find('.gru-timestamp-input .date-picker .calendar').length,
    'Missing calendar icon'
  );
  assert.ok(
    $timestampInput.find('.gru-timestamp-input .date-picker input').length,
    'Missing date picker'
  );
  assert.ok(
    $timestampInput.find('.gru-timestamp-input .time-picker .clock').length,
    'Missing time icon'
  );
  assert.ok(
    $timestampInput.find('.gru-timestamp-input .time-picker input').length,
    'Missing time picker'
  );
});

test('Timestamp valuePath', function(assert) {
  assert.expect(2);

  const assignment = Context.create(Ember.getOwner(this).ownerInjection());
  this.set('assignment', assignment);

  this.render(
    hbs`{{gru-timestamp-input model=assignment valuePath='dueDate'  datePath='dueDay'  timePath='dueTime'}}`
  );
  var $timestampInputComponent = this.$();
  var $input = $timestampInputComponent.find('#date-dueDate');
  var $inputTime = $timestampInputComponent.find('#time-dueDate');

  T.exists(assert, $input, 'Due date input element not found');
  $input.val('10/21/2200');
  $input.blur();

  $inputTime.val('12:31 PM');
  $inputTime.blur();

  return wait().then(function() {
    assert.ok(assignment.get('dueDate'), 'Due date missing');
  });
});
