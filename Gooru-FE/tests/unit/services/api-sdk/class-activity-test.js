import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';

moduleForService(
  'service:api-sdk/class-activity',
  'Unit | Service | api-sdk/class-activity',
  {}
);

test('addActivityToClass', function(assert) {
  const service = this.subject();

  assert.expect(5);

  service.set(
    'classActivityAdapter',
    Ember.Object.create({
      addActivityToClass: function(classId, contentId, contentType, context) {
        assert.equal(classId, 123, 'Wrong class id');
        assert.equal(contentId, 321, 'Wrong content id');
        assert.equal(contentType, 'assessment', 'Wrong content type');
        assert.equal(context, 'any context', 'Wrong context');
        return Ember.RSVP.resolve(true);
      }
    })
  );

  var done = assert.async();
  service
    .addActivityToClass(123, 321, 'assessment', 'any context')
    .then(function(response) {
      assert.ok(response, 'fake-response', 'Wrong response');
      done();
    });
});

test('enableClassActivity', function(assert) {
  const service = this.subject();

  assert.expect(4);

  service.set(
    'classActivityAdapter',
    Ember.Object.create({
      enableClassActivity: function(classId, classActivityId, activationDate) {
        assert.equal(classId, 123, 'Wrong class id');
        assert.equal(classActivityId, 321, 'Wrong class activity id');
        assert.equal(
          activationDate,
          'any activation date',
          'Wrong activation date'
        );
        return Ember.RSVP.resolve(true);
      }
    })
  );

  var done = assert.async();
  service
    .enableClassActivity(123, 321, 'any activation date')
    .then(function(response) {
      assert.ok(response, 'fake-response', 'Wrong response');
      done();
    });
});

test('findClassActivities', function(assert) {
  assert.expect(10);

  const service = this.subject({
    findClassActivitiesPerformanceSummary: function(
      classId,
      classActivities,
      startDate,
      endDate
    ) {
      assert.equal(classId, 123, 'Wrong class id');
      assert.equal(startDate, 'fake-start-date', 'Wrong start date');
      assert.equal(endDate, 'fake-end-date', 'Wrong end date');
      assert.deepEqual(classActivities, [1, 2, 3], 'Wrong class activities');
      return Ember.RSVP.resolve(classActivities);
    }
  });

  service.set(
    'classActivityAdapter',
    Ember.Object.create({
      findClassActivities: function(classId, contentType, startDate, endDate) {
        assert.equal(classId, 123, 'Wrong class id');
        assert.equal(contentType, 'any content type', 'Wrong content type');
        assert.equal(startDate, 'fake-start-date', 'Wrong start date');
        assert.equal(endDate, 'fake-end-date', 'Wrong end date');
        return Ember.RSVP.resolve('fake-payload');
      }
    })
  );

  service.set(
    'classActivitySerializer',
    Ember.Object.create({
      normalizeFindClassActivities: function(payload) {
        assert.equal(payload, 'fake-payload', 'Wrong payload');
        return [1, 2, 3];
      }
    })
  );

  var done = assert.async();
  service
    .findClassActivities(
      123,
      'any content type',
      'fake-start-date',
      'fake-end-date'
    )
    .then(function(response) {
      assert.deepEqual(response, [1, 2, 3], 'Wrong response');
      done();
    });
});

test('findClassActivitiesPerformanceSummary', function(assert) {
  assert.expect(11);

  const service = this.subject();

  service.set(
    'performanceService',
    Ember.Object.create({
      findClassActivityPerformanceSummaryByIds: function(
        classId,
        activityIds,
        activityType,
        startDate,
        endDate
      ) {
        //this method is called twice, one for assessment and one for collection
        assert.equal(classId, 123, 'Wrong class id');
        assert.equal(startDate, 'fake-start-date', 'Wrong start date');
        assert.equal(endDate, 'fake-end-date', 'Wrong end date');

        let performanceItems = [];
        if (activityType === 'assessment') {
          assert.deepEqual(
            activityIds,
            [1, 2],
            'Wrong activity|assessment ids'
          );
          performanceItems = [
            //activity performance summary items
            Ember.Object.create({
              date: 'fake-date-1',
              collectionPerformanceSummary: Ember.Object.create({
                collectionId: 1,
                score: 100
              })
            }),
            Ember.Object.create({
              date: 'fake-date-2',
              collectionPerformanceSummary: Ember.Object.create({
                collectionId: 2,
                score: 50
              })
            })
          ];
        } else {
          assert.deepEqual(activityIds, [3], 'Wrong collection ids');
          performanceItems = [
            //activity performance summary items
            Ember.Object.create({
              date: 'fake-date-3',
              collectionPerformanceSummary: Ember.Object.create({
                collectionId: 3,
                score: 25
              })
            })
          ];
        }
        return Ember.RSVP.resolve(performanceItems);
      }
    })
  );

  const classActivities = [
    Ember.Object.create({
      collection: Ember.Object.create({ isAssessment: true, id: 1 })
    }),
    Ember.Object.create({
      collection: Ember.Object.create({ isAssessment: true, id: 2 })
    }),
    Ember.Object.create({
      collection: Ember.Object.create({ isCollection: true, id: 3 })
    })
  ];
  var done = assert.async();
  service
    .findClassActivitiesPerformanceSummary(
      123,
      classActivities,
      'fake-start-date',
      'fake-end-date'
    )
    .then(function(response) {
      const classActivity = response[0];
      assert.ok(
        classActivity.get('activityPerformanceSummary'),
        'Missing activity performance summary'
      );
      assert.equal(
        classActivity.get('activityPerformanceSummary.date'),
        'fake-date-1',
        'Wrong date'
      );
      assert.equal(
        classActivity.get(
          'activityPerformanceSummary.collectionPerformanceSummary.score'
        ),
        100,
        'Wrong score'
      );
      done();
    });
});

test('findStudentClassActivities', function(assert) {
  assert.expect(11);

  const service = this.subject({
    findStudentActivitiesPerformanceSummary: function(
      userId,
      classId,
      classActivities,
      startDate,
      endDate
    ) {
      assert.equal(userId, 321, 'Wrong user id');
      assert.equal(classId, 123, 'Wrong class id');
      assert.equal(startDate, 'fake-start-date', 'Wrong start date');
      assert.equal(endDate, 'fake-end-date', 'Wrong end date');
      assert.deepEqual(classActivities, [1, 2, 3], 'Wrong class activities');
      return Ember.RSVP.resolve(classActivities);
    }
  });

  service.set(
    'classActivityAdapter',
    Ember.Object.create({
      findClassActivities: function(classId, contentType, startDate, endDate) {
        assert.equal(classId, 123, 'Wrong class id');
        assert.equal(contentType, 'any content type', 'Wrong content type');
        assert.equal(startDate, 'fake-start-date', 'Wrong start date');
        assert.equal(endDate, 'fake-end-date', 'Wrong end date');
        return Ember.RSVP.resolve('fake-payload');
      }
    })
  );

  service.set(
    'classActivitySerializer',
    Ember.Object.create({
      normalizeFindClassActivities: function(payload) {
        assert.equal(payload, 'fake-payload', 'Wrong payload');
        return [1, 2, 3];
      }
    })
  );

  var done = assert.async();
  service
    .findStudentClassActivities(
      321,
      123,
      'any content type',
      'fake-start-date',
      'fake-end-date'
    )
    .then(function(response) {
      assert.deepEqual(response, [1, 2, 3], 'Wrong response');
      done();
    });
});

test('findStudentActivitiesPerformanceSummary', function(assert) {
  assert.expect(13);

  const service = this.subject();

  service.set(
    'performanceService',
    Ember.Object.create({
      findStudentActivityPerformanceSummaryByIds: function(
        userId,
        classId,
        activityIds,
        activityType,
        startDate,
        endDate
      ) {
        //this method is called twice, one for assessment and one for collection
        assert.equal(userId, 321, 'Wrong user id');
        assert.equal(classId, 123, 'Wrong class id');
        assert.equal(startDate, 'fake-start-date', 'Wrong start date');
        assert.equal(endDate, 'fake-end-date', 'Wrong end date');

        let performanceItems = [];
        if (activityType === 'assessment') {
          assert.deepEqual(
            activityIds,
            [1, 2],
            'Wrong activity|assessment ids'
          );
          performanceItems = [
            //activity performance summary items
            Ember.Object.create({
              date: 'fake-date-1',
              collectionPerformanceSummary: Ember.Object.create({
                collectionId: 1,
                score: 100
              })
            }),
            Ember.Object.create({
              date: 'fake-date-2',
              collectionPerformanceSummary: Ember.Object.create({
                collectionId: 2,
                score: 50
              })
            })
          ];
        } else {
          assert.deepEqual(activityIds, [3], 'Wrong collection ids');
          performanceItems = [
            //activity performance summary items
            Ember.Object.create({
              date: 'fake-date-3',
              collectionPerformanceSummary: Ember.Object.create({
                collectionId: 3,
                score: 25
              })
            })
          ];
        }
        return Ember.RSVP.resolve(performanceItems);
      }
    })
  );

  const classActivities = [
    Ember.Object.create({
      collection: Ember.Object.create({ isAssessment: true, id: 1 })
    }),
    Ember.Object.create({
      collection: Ember.Object.create({ isAssessment: true, id: 2 })
    }),
    Ember.Object.create({
      collection: Ember.Object.create({ isCollection: true, id: 3 })
    })
  ];
  var done = assert.async();
  service
    .findStudentActivitiesPerformanceSummary(
      321,
      123,
      classActivities,
      'fake-start-date',
      'fake-end-date'
    )
    .then(function(response) {
      const classActivity = response[0];
      assert.ok(
        classActivity.get('activityPerformanceSummary'),
        'Missing activity performance summary'
      );
      assert.equal(
        classActivity.get('activityPerformanceSummary.date'),
        'fake-date-1',
        'Wrong date'
      );
      assert.equal(
        classActivity.get(
          'activityPerformanceSummary.collectionPerformanceSummary.score'
        ),
        100,
        'Wrong score'
      );
      done();
    });
});

test('removeClassActivity', function(assert) {
  const expectedClassId = 'class-id';
  const expectedContentId = 'content-id';
  const service = this.subject();

  assert.expect(2);

  service.set(
    'classActivityAdapter',
    Ember.Object.create({
      removeClassActivity: function(classId, contentId) {
        assert.equal(classId, expectedClassId, 'Wrong class id');
        assert.equal(contentId, expectedContentId, 'Wrong content id');
        return Ember.RSVP.resolve();
      }
    })
  );

  var done = assert.async();
  service.removeClassActivity('class-id', 'content-id').then(function() {
    done();
  });
});
