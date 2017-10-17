import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'controller:profile/content/questions',
  'Unit | Controller | profile/content/questions',
  {}
);

test('default pagination', function(assert) {
  let controller = this.subject();
  assert.equal(controller.get('pagination.page'), 0, 'Wrong default page');
  assert.equal(
    controller.get('pagination.pageSize'),
    50,
    'Wrong default page size'
  );
});
