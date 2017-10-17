import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'player/gru-study-header',
  'Unit | Component | player/gru study header',
  {
    integration: false
  }
);

test('barChartData', function(assert) {
  let component;
  let aClass = Ember.Object.create({
    id: 'class-1',
    title: 'MPM-Data Analytics Class'
  });
  let classPerformanceSummary = [
    Ember.Object.create({
      id: 'class-1',
      classId: 'class-1',
      score: 80,
      timeSpent: 3242209,
      total: 10,
      totalCompleted: 5
    })
  ];
  let suggestedResources = [
    Ember.Object.create({
      id: 'resource-1',
      title: 'resource1',
      format: 'video'
    }),
    Ember.Object.create({
      id: 'resource-2',
      title: 'resource2',
      format: 'image'
    })
  ];
  Ember.run(
    () =>
      (component = this.subject({
        classId: 'class-1',
        session: {
          userId: 'user-id'
        },
        collection: {
          id: 'collection-id'
        },
        classService: {
          readClassInfo: classId => {
            assert.equal(classId, 'class-1', 'Class id should match');
            return Ember.RSVP.resolve(aClass);
          }
        },
        performanceService: {
          findClassPerformanceSummaryByStudentAndClassIds: (
            userId,
            classId
          ) => {
            assert.equal(classId[0], 'class-1', 'Class id should match');
            return Ember.RSVP.resolve(classPerformanceSummary);
          }
        },
        suggestService: {
          suggestResourcesForCollection: (userId, collectionId) => {
            assert.equal(userId, 'user-id', 'User id should match');
            assert.equal(
              collectionId,
              'collection-id',
              'Collection id should match'
            );
            return Ember.RSVP.resolve(suggestedResources);
          }
        }
      }))
  );

  assert.equal(
    component.get('barChartData.firstObject.percentage'),
    50,
    'Incorrect performance percentage'
  );
});

test('playSuggested', function(assert) {
  let component;
  let classId = 'class-id';
  let courseId = 'course-id';
  let resource = { id: 'resource-id' };
  let aClass = Ember.Object.create({
    id: 'class-1',
    title: 'MPM-Data Analytics Class'
  });
  let classPerformanceSummary = [
    Ember.Object.create({
      id: 'class-1',
      classId: 'class-1',
      score: 80,
      timeSpent: 3242209,
      total: 10,
      totalCompleted: 5
    })
  ];
  let suggestedResources = [
    Ember.Object.create({
      id: 'resource-1',
      title: 'resource1',
      format: 'video'
    }),
    Ember.Object.create({
      id: 'resource-2',
      title: 'resource2',
      format: 'image'
    })
  ];
  Ember.run(
    () =>
      (component = this.subject({
        classId,
        courseId,
        session: {
          userId: 'user-id'
        },
        classService: {
          readClassInfo: classId => {
            assert.equal(classId, 'class-id', 'Class id should match');
            return Ember.RSVP.resolve(aClass);
          }
        },
        performanceService: {
          findClassPerformanceSummaryByStudentAndClassIds: (
            userId,
            classId
          ) => {
            assert.equal(classId[0], 'class-id', 'Class id should match');
            return Ember.RSVP.resolve(classPerformanceSummary);
          }
        },
        suggestService: {
          suggestResourcesForCollection: (userId, collectionId) => {
            assert.equal(userId, 'user-id', 'User id should match');
            assert.equal(
              collectionId,
              'collection-id',
              'Collection id should match'
            );
            return Ember.RSVP.resolve(suggestedResources);
          }
        },
        collectionUrl: 'collection-url',
        router: {
          transitionTo(route, classParam, courseParam) {
            assert.equal(classParam, classId, 'Incorrect Class id');
            assert.equal(courseParam, courseId, 'Incorrect Course id');
            assert.equal(route, 'resource-player', 'Incorrect route');
          }
        }
      }))
  );
  component.send('playSuggested', resource);
});
