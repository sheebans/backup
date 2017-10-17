import { moduleFor, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import Class from 'gooru-web/models/content/class';
import Ember from 'ember';

moduleFor(
  'controller:teacher/class/class-activities',
  'Unit | Controller | teacher/class/class-activities',
  {
    integration: true
  }
);

test('viewMore', function(assert) {
  let activities = [
    Ember.Object.create({ id: 10 }),
    Ember.Object.create({ id: 20 })
  ];

  let controller = this.subject({
    activities,
    classController: Ember.Object.create({
      class: Class.create({ id: 1 })
    }),
    classActivities: [],
    year: 2020,
    month: 10,
    classActivityService: {
      findClassActivities: () => {
        return Ember.RSVP.resolve(activities);
      }
    }
  });

  assert.expect(4);

  controller.send('viewMore');
  return wait().then(function() {
    assert.equal(
      controller.get('classActivities').length,
      1,
      'Should have one daily activity'
    );
    assert.equal(controller.get('month'), 9, 'Incorrect month');

    controller.set('month', 0);
    controller.send('viewMore');
    return wait().then(function() {
      assert.equal(controller.get('month'), 11, 'Incorrect month');
      assert.equal(controller.get('year'), 2019, 'Incorrect year');
    });
  });
});

test('removeClassActivity', function(assert) {
  let activities = Ember.A([
    Ember.Object.create({
      id: 'classActivity-id',
      collection: Ember.Object.create({
        collectionType: 'collection'
      })
    })
  ]);

  let controller = this.subject({
    activities,
    classController: Ember.Object.create({
      class: Class.create({ id: 'class-id' })
    }),
    classActivities: Ember.A([
      Ember.Object.create({
        classActivities: Ember.A([
          Ember.Object.create({
            id: 'classActivity-id',
            collection: Ember.Object.create({
              collectionType: 'collection'
            })
          })
        ])
      })
    ]),
    year: 2020,
    month: 10,
    classActivityService: Ember.Object.create({
      removeClassActivity: (currentClassId, activityId) => {
        assert.ok(currentClassId, 'class-id', 'Incorrect Class Id');
        assert.ok(activityId, 'classActivity-id', 'Incorrect Activity Id');
        return Ember.RSVP.resolve(true);
      },
      findClassActivities: () => {
        return Ember.RSVP.resolve(activities);
      }
    })
  });

  let done = assert.async();
  controller.set('actions.showModal', function(componentName, model) {
    assert.equal(
      componentName,
      'content.modals.gru-remove-class-activity',
      'Component name should match'
    );
    model.callback.success();
    done();
  });

  let activityToDelete = Ember.Object.create({
    id: 'classActivity-id',
    collection: Ember.Object.create({
      collectionType: 'collection'
    })
  });

  assert.equal(
    controller.get('classActivities').length,
    1,
    'Should have only one class activity section'
  );
  controller.send('viewMore');
  return wait().then(function() {
    assert.equal(
      controller.get('classActivities').length,
      2,
      'Should have  2 class activity sections (today and month)'
    );
    assert.equal(
      controller.get('classActivities')[0].classActivities.length,
      1,
      'Should have one class activity today'
    );
    assert.equal(
      controller.get('classActivities')[1].classActivities.length,
      1,
      'Should have 1 month daily activity after view more'
    );
    controller.send('removeClassActivity', activityToDelete);
    return wait().then(function() {
      assert.equal(
        controller.get('classActivities')[0].classActivities.length,
        0,
        'Should removed today activity'
      );
      assert.equal(
        controller.get('classActivities')[1].classActivities.length,
        0,
        'Should removed month activity'
      );
    });
  });
});
