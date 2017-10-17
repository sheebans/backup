import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:email', 'Unit | Validator | email', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
