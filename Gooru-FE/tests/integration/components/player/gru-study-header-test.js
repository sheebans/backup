import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'gooru-web/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Class from 'gooru-web/models/content/class';
import Resource from 'gooru-web/models/content/resource';
import Collection from 'gooru-web/models/collection/collection';
import { NU_COURSE_VERSION } from 'gooru-web/config/config';

const classServiceStub = Ember.Service.extend({
  readClassInfo: function() {
    const aClassInfo = Class.create(Ember.getOwner(this).ownerInjection(), {
      id: 'class-1',
      title: 'MPM-Data Analytics Class',
      code: 'CZHAMO3'
    });

    return new Ember.RSVP.resolve(aClassInfo);
  }
});

const performanceServiceStub = Ember.Service.extend({
  findClassPerformanceSummaryByStudentAndClassIds: function() {
    const aClassPerformance = Class.create({
      id: 'class-1',
      classId: 'class-1',
      score: 80,
      timeSpent: 3242209,
      total: 10,
      totalCompleted: 5
    });

    return new Ember.RSVP.resolve([aClassPerformance]);
  }
});

const suggestServiceStub = Ember.Service.extend({
  suggestResourcesForCollection: function() {
    const suggestedResources = [
      Resource.create({
        id: 'resource-1',
        title: 'resource1',
        format: 'video'
      }),
      Resource.create({
        id: 'resource-2',
        title: 'resource2',
        format: 'image'
      })
    ];

    return new Ember.RSVP.resolve(suggestedResources);
  }
});

moduleForComponent(
  'player/gru-study-header',
  'Integration | Component | player/gru study header',
  {
    integration: true,
    beforeEach: function() {
      this.i18n = this.container.lookup('service:i18n');
      this.i18n.set('locale', 'en');
      this.register('service:api-sdk/class', classServiceStub);
      this.inject.service('api-sdk/class');
      this.register('service:api-sdk/performance', performanceServiceStub);
      this.inject.service('api-sdk/performance');
      this.register('service:api-sdk/suggest', suggestServiceStub);
      this.inject.service('api-sdk/suggest');
    }
  }
);

test('Layout', function(assert) {
  this.set('session', {
    userId: 'user-id'
  });

  let resourceA = Ember.Object.create({
    id: 1,
    sequence: 1,
    title: 'resource1',
    format: 'image_resource'
  });

  let resourceB = Ember.Object.create({
    id: 2,
    sequence: 2,
    title: 'resource1',
    format: 'video_resource'
  });

  this.set(
    'collection',
    Collection.create({
      id: 'collection-id',
      isCollection: true,
      resources: Ember.A([resourceA, resourceB])
    })
  );


  this.set('classId', 'class-1');

  this.set('courseTitle', 'Marine Biology');

  this.set('actualResource', resourceA);
  this.set('resourceSequence', resourceA.get('sequence'));

  this.render(
    hbs`{{player/gru-study-header classId=classId collection=collection  session=session courseTitle=courseTitle}}`
  );

  var $component = this.$(); //component dom element
  const $header = $component.find('.gru-study-header');
  T.exists(assert, $header, 'Missing header section');

  const $courseInfo = $header.find('.course-info');
  T.exists(assert, $courseInfo, 'Missing course-info');

  assert.equal(
    T.text($courseInfo.find('.title')),
    'Marine Biology',
    'Wrong course title text'
  );


  const $performanceCompletionInfo = $header.find('.performance-completion-info');
  T.exists(assert, $performanceCompletionInfo, 'Missing performance completion info.');
  const $score = $performanceCompletionInfo.find('.completion .score');
  T.exists(assert, $score, 'Missing completion score value.');
  T.exists(
    assert,
    $performanceCompletionInfo.find('.completion .label'),
    'Missing performance completion label text'
  );
  assert.equal(
    T.text($performanceCompletionInfo.find('.performance .score')),
    '80%',
    'Wrong score text'
  );

  T.exists(
    assert,
    $header.find('.bar-charts .completion-chart .gru-x-bar-chart'),
    'Missing completion chart'
  );

  const $suggestions = $header.find('.suggest-player');
  T.exists(assert, $suggestions, 'Missing suggestions.');

  T.exists(
    assert,
    $suggestions.find('.slider-inner-container'),
    'Missing suggestions slider'
  );

});

test('Study player | NU Course : Completion metrics', function(assert) {
  let classObj = Ember.Object.create({
    courseCompetencyCompletion: Ember.Object.create({
      completedCount: 2,
      totalCount: 5
    })
  });
  this.set('courseVersion', NU_COURSE_VERSION);
  this.set('class', classObj);
  this.render(
    hbs`{{player/gru-study-header  courseVersion=courseVersion class=class}}`
  );
  var $component = this.$(); //component dom element
  assert.equal(
    T.text(
      $component.find('.performance-completion-info .completion .score')
    ),
    '2/5',
    'Wrong completion count!!'
  );
});

test('Study player | Non NU Course : Completion metrics', function(assert) {
  let classObj = Ember.Object.create({
    performanceSummary: Ember.Object.create({
      totalCompleted: 4,
      total: 5
    })
  });
  this.set('class', classObj);
  this.render(hbs`{{player/gru-study-header  class=class}}`);
  var $component = this.$(); //component dom element
  assert.equal(
    T.text(
      $component.find('.performance-completion-info .completion .score')
    ),
    '4/5',
    'Wrong completion count!!'
  );
});
