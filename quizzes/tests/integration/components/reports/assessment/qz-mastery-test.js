import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import LearningTargetResult from 'quizzes-addon/models/result/learning-target';
import Ember from 'ember';

moduleForComponent(
  'reports/assessment/qz-mastery',
  'Integration | Component | reports/assessment/qz mastery',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Mastery Layout', function(assert) {
  assert.expect(4);

  const learningTargets = Ember.A([
    LearningTargetResult.create({
      label: 'Option A',
      value: 'some-value'
    }),
    LearningTargetResult.create({
      label: 'Option B',
      value: 'some-value'
    })
  ]);

  const assessmentResult = Ember.Object.create({
    id: 501,
    averageReaction: 2,
    totalTimeSpent: 1695,
    correctPercentage: 67,
    correctAnswers: 2,

    questionResults: [
      Ember.Object.create({
        id: 602,
        resource: Ember.Object.create({
          order: 2
        }),
        correct: true,
        score: 10,
        reaction: 4,
        timeSpent: 28,
        userAnswer: '3'
      })
    ],
    selectedAttempt: 3,
    title: 'Test Assessment Name',
    totalAttempts: 4
  });

  this.set('learningTargets', learningTargets);
  this.set('assessmentResult', assessmentResult);

  this.render(
    hbs`{{reports/assessment/qz-mastery learningTargets=learningTargets assessmentResult=assessmentResult}}`
  );

  const $component = this.$(); //component dom element
  const $mastery = $component.find('.qz-mastery');

  T.exists(assert, $mastery, 'Missing mastery component');
  T.exists(assert, $mastery.find('h4'), 'Missing mastery title');
  T.exists(
    assert,
    $mastery.find('.grading-scale-legend'),
    'Missing grading scale legend'
  );
  T.exists(
    assert,
    $mastery.find('.qz-learning-target'),
    'Missing learning target component'
  );
});
