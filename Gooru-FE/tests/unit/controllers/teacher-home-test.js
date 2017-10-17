import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

var applicationController = Ember.Object.create({
  profile: Ember.Object.create({ id: 'profile-id' }),
  myClasses: {
    classes: [
      Ember.Object.create({
        id: 'class1',
        title: 'Class Archived 1',
        isArchived: true,
        startDate: '2017-04-19T21:30:56Z',
        isTeacher: function() {
          return true;
        }
      }),
      Ember.Object.create({
        id: 'class2',
        title: 'Class Archived 2',
        isArchived: true,
        startDate: '2016-04-19T21:30:56Z',
        isTeacher: function() {
          return true;
        }
      })
    ]
  },
  getLocalStorage: () => ({ getItem: () => null })
});
moduleFor('controller:teacher-home', 'Unit | Controller | teacher-home', {});
test('Sort Archived Classes by Date', function(assert) {
  let controller = this.subject({ applicationController });
  controller.send('filterByDate');
  assert.equal(
    controller.get('sortedArchivedClassrooms')[0].get('title'),
    'Class Archived 2',
    'Incorrect first class'
  );
  assert.equal(
    controller.get('sortedArchivedClassrooms')[1].get('title'),
    'Class Archived 1',
    'Incorrect last class'
  );
  controller.send('filterByDate');
  assert.equal(
    controller.get('sortedArchivedClassrooms')[0].get('title'),
    'Class Archived 1',
    'Incorrect first class'
  );
  assert.equal(
    controller.get('sortedArchivedClassrooms')[1].get('title'),
    'Class Archived 2',
    'Incorrect last class'
  );
});

test('Sort Archived Classes By Title', function(assert) {
  let controller = this.subject({ applicationController });
  controller.send('filterByTitle');
  assert.equal(
    controller.get('sortedArchivedClassrooms')[0].get('title'),
    'Class Archived 1',
    'Incorrect first class'
  );
  assert.equal(
    controller.get('sortedArchivedClassrooms')[1].get('title'),
    'Class Archived 2',
    'Incorrect last class'
  );
  controller.send('filterByTitle');
  assert.equal(
    controller.get('sortedArchivedClassrooms')[0].get('title'),
    'Class Archived 2',
    'Incorrect first class'
  );
  assert.equal(
    controller.get('sortedArchivedClassrooms')[1].get('title'),
    'Class Archived 1',
    'Incorrect last class'
  );
});
