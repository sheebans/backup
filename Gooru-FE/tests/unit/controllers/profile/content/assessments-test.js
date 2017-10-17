import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'controller:profile/content/assessments',
  'Unit | Controller | profile/content/assessments'
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

test('activeClasses', function(assert) {
  let controller = this.subject({
    appController: {
      myClasses: {
        getTeacherActiveClasses: () => [
          {
            courseId: null
          },
          {
            courseId: 'course-id'
          }
        ]
      }
    },
    sessionProfile: { id: 'profile-id' }
  });
  assert.equal(
    controller.get('activeClasses').length,
    2,
    'Wrong active classes'
  );
});

test('activeClasses with anonymous', function(assert) {
  let controller = this.subject({
    appController: { myClasses: null },
    sessionProfile: { id: 'profile-id' }
  });
  assert.equal(
    controller.get('activeClasses').length,
    0,
    'Wrong active classes'
  );
});
