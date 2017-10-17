import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:username', 'Unit | Validator | username', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
