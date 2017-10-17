import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Question from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'player/qz-navigator',
  'Unit | Component | player/qz navigator',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('remixCollection', function(assert) {
  const component = this.subject();
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onRemixCollection', 'Action sent should match');
  });
  component.send('remixCollection');
});

test('closePlayer', function(assert) {
  const component = this.subject();
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onClosePlayer', 'Action sent should match');
  });
  component.send('closePlayer');
});
