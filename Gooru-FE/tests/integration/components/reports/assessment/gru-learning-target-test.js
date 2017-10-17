import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'reports/assessment/gru-learning-target',
  'Integration | Component | reports/assessment/gru learning target',
  {
    integration: true
  }
);

test('Learning Target Layout', function(assert) {
  assert.expect(7);

  const learningTarget = Ember.Object.create({
    description:
      'I will understand how to create a ruler and with 1 inch, 1/2 inch, 1/4 inch intervals and generate' +
      'measurement data',
    mastery: 75,
    relatedQuestions: [601, 602],
    standard: '3.MD.7',
    suggestedResources: [
      Ember.Object.create({
        resource: {
          title: 'Learn the MEAN Stack',
          resourceType: 'video/youtube'
        },
        reaction: 2,
        timeSpent: 2841
      })
    ]
  });

  const assessmentResult = Ember.Object.create({
    id: 501,
    averageReaction: 2,
    totalTimeSpent: 1695,
    correctPercentage: 67,
    correctAnswers: 2,

    questionResults: [
      Ember.Object.create({
        id: 601,
        resource: Ember.Object.create({
          order: 1
        }),
        correct: false,
        score: 10,
        reaction: 2,
        timeSpent: 28,
        userAnswer: '1'
      }),

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

  this.set('learningTarget', learningTarget);
  this.set('assessmentResult', assessmentResult);
  this.render(
    hbs`{{reports/assessment/gru-learning-target learningTarget=learningTarget assessmentResult=assessmentResult}}`
  );
  const $component = this.$(); //component dom element
  const $learningTarget = $component.find('.gru-learning-target');

  T.exists(assert, $learningTarget, 'Missing learning target component');
  T.exists(
    assert,
    $learningTarget.find('.learning-target'),
    'Missing learning target wrapper'
  );
  T.exists(
    assert,
    $learningTarget.find('.header-content'),
    'Missing learning target header'
  );
  T.exists(assert, $learningTarget.find('.score'), 'Missing score box');
  T.exists(
    assert,
    $learningTarget.find('.learning-target-description'),
    'Missing learning target'
  );
  T.exists(assert, $learningTarget.find('.questions'), 'Missing questions');
  T.exists(
    assert,
    $learningTarget.find('.resource-cards-section'),
    'Missing resource card section'
  );
});
