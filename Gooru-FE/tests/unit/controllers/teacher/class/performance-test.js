import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import Class from 'gooru-web/models/content/class';

moduleFor(
  'controller:teacher/class/performance',
  'Unit | Controller | teacher/class/performance',
  {
    integration: true
  }
);

test('showPerformanceData - No performance data, no course id', function(
  assert
) {
  let component = this.subject({
    performanceDataMatrix: [],
    class: Class.create(Ember.getOwner(this).ownerInjection(), {
      title: 'Class 1'
    })
  });
  assert.notOk(component.get('showPerformanceData'), 'It should return false');
});

test('showPerformanceData - No performance data, but with course id', function(
  assert
) {
  let component = this.subject({
    performanceDataMatrix: [],
    class: Class.create(Ember.getOwner(this).ownerInjection(), {
      title: 'Class 123',
      courseId: 'course-123'
    })
  });
  assert.notOk(component.get('showPerformanceData'), 'It should return false');
});

test('showPerformanceData - Performance data (length=1) and course id', function(
  assert
) {
  let component = this.subject({
    performanceDataMatrix: ['data-1'],
    class: Class.create(Ember.getOwner(this).ownerInjection(), {
      title: 'Class 123',
      courseId: 'course-123'
    })
  });
  assert.notOk(component.get('showPerformanceData'), 'It should return false');
});

test('showPerformanceData - With enough performance data and course id', function(
  assert
) {
  let component = this.subject({
    performanceDataMatrix: ['data-1', 'data-2', 'data-3'],
    class: Class.create(Ember.getOwner(this).ownerInjection(), {
      title: 'Class 123',
      courseId: 'course-123'
    })
  });
  assert.ok(component.get('showPerformanceData'), 'It should return true');
});
