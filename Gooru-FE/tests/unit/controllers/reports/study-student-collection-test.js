import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'controller:reports/study-student-collection',
  'Unit | Controller | reports/study student collection',
  {
    integration: false
  }
);
test('next with content', function(assert) {
  assert.expect(4);
  let done = assert.async();
  let mapLocation = Ember.Object.create({
    context: Ember.Object.create({
      classId: 'class-id',
      courseId: 'course-id'
    }),
    hasContent: true
  });
  let controller = this.subject({
    mapLocation,
    transitionToRoute: (transition, courseId, { queryParams }) => {
      assert.equal(transition, 'study-player', 'Transition route should match');
      assert.equal(queryParams.classId, 'class-id', 'Class id should match');
      assert.equal(courseId, 'course-id', 'Course id should match');
      done();
    },
    navigateMapService: {
      getStoredNext: () => {
        assert.ok(true, 'getStoredNext was called');
        return Ember.RSVP.resolve(mapLocation);
      }
    }
  });
  controller.send('next');
});

test('next without content', function(assert) {
  assert.expect(5);
  let done = assert.async();
  let mapLocation = Ember.Object.create({
    context: Ember.Object.create({
      classId: 'class-id',
      courseId: 'course-id'
    }),
    hasContent: false
  });
  let controller = this.subject({
    mapLocation,
    transitionToRoute: (transition, courseId, { queryParams }) => {
      assert.equal(transition, 'study-player', 'Transition route should match');
      assert.equal(queryParams.classId, 'class-id', 'Class id should match');
      assert.equal(courseId, 'course-id', 'Course id should match');
      done();
    },
    navigateMapService: {
      getStoredNext: () => {
        assert.ok(true, 'getStoredNext was called');
        return Ember.RSVP.resolve(mapLocation);
      },
      next: () => {
        assert.ok(true, 'next was called');
        return Ember.RSVP.resolve(mapLocation);
      }
    }
  });
  controller.send('next');
});

test('playPostTestSuggestion', function(assert) {
  assert.expect(8);
  let done = assert.async();
  let suggestionResource = Ember.Object.create({
    isResource: true,
    id: 'suggestion-id'
  });
  let actualContext = Ember.Object.create({
    classId: 'class-id',
    courseId: 'course-id'
  });
  let mapLocation = Ember.Object.create({
    context: actualContext,
    postTestSuggestion: suggestionResource,
    hasContent: false
  });
  let controller = this.subject({
    mapLocation,
    transitionToRoute: (transition, classId, courseId, id) => {
      assert.equal(
        transition,
        'resource-player',
        'Transition route should match'
      );
      assert.equal(classId, 'class-id', 'Class id should match');
      assert.equal(courseId, 'course-id', 'Course id should match');
      assert.equal(id, 'suggestion-id', 'Suggestion id should match');
      done();
    },
    courseMapService: {
      createNewPath: (context, suggestion) => {
        assert.deepEqual(
          suggestion,
          suggestionResource,
          'Suggestion should match'
        );
        assert.deepEqual(context, actualContext, 'Context should match');
        return Ember.RSVP.resolve(true);
      }
    },
    navigateMapService: {
      getStoredNext: () => {
        assert.ok(true, 'getStoredNext was called');
        return Ember.RSVP.resolve(mapLocation);
      },
      next: () => {
        assert.ok(true, 'next was called');
        return Ember.RSVP.resolve(mapLocation);
      }
    }
  });
  controller.send('playPostTestSuggestion');
});

test('playBackFillSuggestion', function(assert) {
  let done = assert.async();
  let suggestionResource = Ember.Object.create({
    isResource: true,
    id: 'suggestion-id'
  });
  let actualContext = Ember.Object.create({
    classId: 'class-id',
    courseId: 'course-id'
  });
  let mapLocation = Ember.Object.create({
    context: actualContext,
    backFillSuggestion: suggestionResource,
    hasContent: false
  });
  let controller = this.subject({
    mapLocation,
    transitionToRoute: (transition, classId, courseId, id) => {
      assert.equal(
        transition,
        'resource-player',
        'Transition route should match'
      );
      assert.equal(classId, 'class-id', 'Class id should match');
      assert.equal(courseId, 'course-id', 'Course id should match');
      assert.equal(id, 'suggestion-id', 'Suggestion id should match');
      done();
    },
    courseMapService: {
      createNewPath: (context, suggestion) => {
        assert.deepEqual(
          suggestion,
          suggestionResource,
          'Suggestion should match'
        );
        assert.deepEqual(context, actualContext, 'Context should match');
        return Ember.RSVP.resolve(true);
      }
    },
    navigateMapService: {
      getStoredNext: () => {
        assert.ok(true, 'getStoredNext was called');
        return Ember.RSVP.resolve(mapLocation);
      },
      next: () => {
        assert.ok(true, 'next was called');
        return Ember.RSVP.resolve(mapLocation);
      }
    }
  });
  controller.send('playBackFillSuggestion');
});

test('playResourceSuggestion', function(assert) {
  let done = assert.async();
  let suggestionResource = Ember.Object.create({
    isResource: true,
    id: 'suggestion-id'
  });
  let actualContext = Ember.Object.create({
    classId: 'class-id',
    courseId: 'course-id'
  });
  let mapLocation = Ember.Object.create({
    context: actualContext,
    resourceSuggestion: suggestionResource,
    hasContent: false
  });
  let controller = this.subject({
    mapLocation,
    transitionToRoute: (transition, classId, courseId, id) => {
      assert.equal(
        transition,
        'resource-player',
        'Transition route should match'
      );
      assert.equal(classId, 'class-id', 'Class id should match');
      assert.equal(courseId, 'course-id', 'Course id should match');
      assert.equal(id, 'suggestion-id', 'Suggestion id should match');
      done();
    },
    courseMapService: {
      createNewPath: (context, suggestion) => {
        assert.deepEqual(
          suggestion,
          suggestionResource,
          'Suggestion should match'
        );
        assert.deepEqual(context, actualContext, 'Context should match');
        return Ember.RSVP.resolve(true);
      }
    },
    navigateMapService: {
      getStoredNext: () => {
        assert.ok(true, 'getStoredNext was called');
        return Ember.RSVP.resolve(mapLocation);
      },
      next: () => {
        assert.ok(true, 'next was called');
        return Ember.RSVP.resolve(mapLocation);
      }
    }
  });
  controller.send('playResourceSuggestion');
});
