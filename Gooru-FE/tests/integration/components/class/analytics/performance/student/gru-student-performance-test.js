import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'class/analytics/performance/student/gru-student-performance',
  'Integration | Component | class/analytics/performance/student/gru performance summary',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Test for student performance', function(assert) {
  const performances = Ember.Object.create(
    {
      id: 'cualquierId',
      title: 'Quiz :: Indian History',
      type: 'performance/performance',
      score: 75,
      completionDone: 0,
      completionTotal: 1,
      timeSpent: 4852359,
      ratingScore: 0,
      attempts: 2,
      isCompleted: true
    },
    {
      id: 'cualquierId2',
      title: 'Quiz :: Indian History 2',
      type: 'performance/performance',
      score: 75,
      completionDone: 0,
      completionTotal: 1,
      timeSpent: 4852359,
      ratingScore: 0,
      attempts: 2,
      isCompleted: true
    }
  );
  const classObj = Ember.Object.create({
    id: '111-333-555',
    course: '222-444-666'
  });
  this.set('userId', 'any-user-id');
  this.set('classObj', classObj);
  this.set('performances', performances);

  this.render(hbs`{{class.analytics.performance.student.gru-student-performance
        performances=performances
        classObj=classObj
        userId=userId}}`);

  const $component = this.$(); //component dom element

  const $studentContainer = $component.find(
    '.gru-student-performance-container'
  );

  T.exists(assert, $studentContainer, 'Missing student Container');
});
