import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import QuestionResult from 'gooru-web/models/result/question';
import Ember from 'ember';

moduleForComponent(
  'reports/assessment/gru-questions',
  'Integration | Component | reports/assessment/gru questions',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Questions Layout-non open ended', function(assert) {
  const questionResults = Ember.A([
    QuestionResult.create({
      correct: true,
      resource: Ember.Object.create({
        text: 'This is a question 1',
        questionType: 'MC',
        order: 1,
        isOpenEnded: false,
        answers: Ember.A([])
      }),
      reaction: 4,
      timeSpent: 2096,
      userAnswer: 'Student Multiple Choice answer 1'
    }),
    QuestionResult.create({
      correct: true,
      resource: Ember.Object.create({
        text: 'This is a question 2',
        questionType: 'MC',
        order: 3, //not consecutive
        isOpenEnded: false,
        answers: Ember.A([])
      }),
      reaction: 4,
      timeSpent: 2096,
      userAnswer: 'Student Multiple Answer answer 2'
    })
  ]);

  this.set('questionResults', questionResults);
  this.set('isAnswerKeyHidden', undefined);

  this.render(hbs`
    {{reports/assessment/gru-questions
      isAnswerKeyHidden=isAnswerKeyHidden
      results=questionResults
      showReactionBar=true
    }}`);
  const $component = this.$('.reports.assessment.gru-questions');
  assert.ok(
    $component.hasClass('performance-view'),
    'Performance view set by default'
  );
  assert.notOk(
    $component.hasClass('key-hidden'),
    'Answer key hidden by default'
  );

  T.exists(assert, $component, 'Missing questions component');
  var title = $component.find('.title h4');
  T.exists(assert, title, 'Missing questions title');
  assert.equal(T.text(title), 'Questions', 'Wrong title text');
  T.exists(assert, $component.find('.btn-group'), 'Missing btn-group section');
  T.exists(
    assert,
    $component.find('table th.header.number'),
    'Missing number header'
  );
  T.exists(
    assert,
    $component.find('table th.header.question'),
    'Missing question header'
  );
  T.exists(
    assert,
    $component.find('table th.header.answer'),
    'Missing answer header'
  );
  T.exists(
    assert,
    $component.find('table th.header.score'),
    'Missing score header'
  );
  T.exists(
    assert,
    $component.find('table th.header.time-spent'),
    'Missing time spent header'
  );
  T.exists(
    assert,
    $component.find('table thead th.header.reaction'),
    'Missing reaction header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.report'),
    'report header should not be visible'
  );
  T.exists(
    assert,
    $component.find('table tbody td.number-question'),
    'Missing number column'
  );
  assert.equal(
    T.text($component.find('table tbody td.number-question:eq(1)')),
    '3',
    'Wrong question number for question 2'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-text'),
    'Missing text column'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-answer'),
    'Missing answer column'
  );
  T.exists(
    assert,
    $component.find(
      'table tbody td.question-answer:eq(0) .gru-multiple-choice'
    ),
    'Missing gru-multiple-choice component'
  );
  T.exists(
    assert,
    $component.find(
      'table tbody td.question-answer:eq(1) .gru-multiple-choice'
    ),
    'Missing gru-multiple-choice component'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-score'),
    'Missing score column'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-score .correct'),
    'Missing score column for question 1'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-time'),
    'Missing time spent column'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-reaction'),
    'Missing reaction column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-report'),
    'question report column should no be visible'
  );
  T.exists(
    assert,
    $component.find('.question-cards.visible-xs'),
    'Missing mobile question cards'
  );
  assert.equal(
    $component.find('table tbody tr').length,
    2,
    'Incorrect number of rows'
  );

  this.set('isAnswerKeyHidden', true);
  assert.ok($component.hasClass('key-hidden'), 'Answer key class');
});

test('Questions Layout-open ended', function(assert) {
  const questionResults = Ember.A([
    QuestionResult.create({
      correct: true,
      resource: Ember.Object.create({
        text: 'This is a question 1',
        questionType: 'OE',
        order: 1,
        isOpenEnded: true
      }),
      reaction: 4,
      timeSpent: 2096,
      userAnswer: 'Student Open Ended answer 1',
      isGraded: true
    }),
    QuestionResult.create({
      correct: true,
      resource: Ember.Object.create({
        text: 'This is a question 2',
        questionType: 'OE',
        order: 3, //not consecutive
        isOpenEnded: true
      }),
      reaction: 4,
      timeSpent: 2096,
      userAnswer: 'Student Open Ended answer 2',
      isGraded: true
    })
  ]);

  this.set('questionResults', questionResults);
  this.set('isAnswerKeyHidden', undefined);

  this.render(hbs`
    {{reports/assessment/gru-questions
      isAnswerKeyHidden=isAnswerKeyHidden
      results=questionResults
      viewMode='open-ended'
    }}`);
  const $component = this.$('.reports.assessment.gru-questions');

  T.exists(assert, $component, 'Missing questions component');
  var title = $component.find('.title h4');
  T.exists(assert, title, 'Missing questions title');
  assert.equal(T.text(title), 'Free Response Questions', 'Wrong title text');
  T.notExists(
    assert,
    $component.find('table th.header.score'),
    'score header should not be visible'
  );
  T.exists(
    assert,
    $component.find('table th.header.report'),
    'report header should be visible'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-answer:eq(0) .gru-open-ended'),
    'Missing gru-open-ended component'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-answer:eq(1) .gru-open-ended'),
    'Missing gru-open-ended component'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-score'),
    'score column should not be visible'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-report'),
    'Missing question report column'
  );
  assert.equal(
    $component.find('table tbody tr').length,
    2,
    'Incorrect number of rows'
  );
});

test('Buttons Options', function(assert) {
  const questionResults = Ember.A([
    QuestionResult.create({
      correct: true,
      resource: Ember.Object.create({
        text: 'This is a question 1',
        questionType: 'MC',
        order: 1,
        isOpenEnded: false,
        answers: Ember.A([])
      }),
      reaction: 4,
      timeSpent: 2096,
      userAnswer: 'Student Multiple Choice answer 1'
    }),
    QuestionResult.create({
      correct: true,
      resource: Ember.Object.create({
        text: 'This is a question 2',
        questionType: 'MC',
        order: 3, //not consecutive
        isOpenEnded: false,
        answers: Ember.A([])
      }),
      reaction: 4,
      timeSpent: 2096,
      userAnswer: 'Student Multiple Answer answer 2'
    })
  ]);

  this.set('questionResults', questionResults);
  this.set('isAnswerKeyHidden', undefined);

  this.render(hbs`
    {{reports/assessment/gru-questions
      isAnswerKeyHidden=isAnswerKeyHidden
      results=questionResults
      showReactionBar=true
    }}`);
  const $component = this.$('.reports.assessment.gru-questions');

  const $correctAnswerButton = $component.find(
    '.btn-group button.correct-answer'
  );
  $correctAnswerButton.click(); //Show correct answer
  T.exists(
    assert,
    $component.find('table thead th.header.score.hide'),
    'Score header should be hide'
  );
  T.exists(
    assert,
    $component.find('table thead th.header.time-spent.hide'),
    'Time spent header should be hide'
  );
  T.exists(
    assert,
    $component.find('table thead th.header.reaction.hide'),
    'Reaction header should be hide'
  );
  T.exists(
    assert,
    $component.find('table thead th.header.correct-answer.visible'),
    'Correct answer header should be visible'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-score.hide'),
    'Score column should be hide'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-time.hide'),
    'Time spent column should be hide'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-reaction.hide'),
    'Reaction column should be hide'
  );
  T.exists(
    assert,
    $component.find('table tbody td.correct-answer.visible'),
    'Correct answer column should be visible'
  );
  T.exists(
    assert,
    $component.find(
      'table tbody td.correct-answer.visible:eq(0) .gru-multiple-choice'
    ),
    'Correct answer column should be visible'
  );

  const $performanceButton = $component.find('.btn-group button.performance');
  $performanceButton.click(); //Show performance
  T.exists(
    assert,
    $component.find('table th.header.score.visible'),
    'Score header should be visible'
  );
  T.exists(
    assert,
    $component.find('table th.header.time-spent.visible'),
    'Time spent header should be visible'
  );
  T.exists(
    assert,
    $component.find('table thead th.header.reaction.visible'),
    'Reaction header should be visible'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-score.visible'),
    'Score column should be visible'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-time.visible'),
    'Time spent column should be visible'
  );
  T.exists(
    assert,
    $component.find('table tbody td.question-reaction.visible'),
    'Reaction column should be visible'
  );

  this.set('isAnswerKeyHidden', true);
  assert.notOk(
    $component.find('.btn-group button.correct-answer').length,
    'Correct answer button not present'
  );
  assert.notOk(
    $component.find('.btn-group button.performance').length,
    'Performance button not present'
  );
  assert.notOk(
    $component.find('table thead th.header.correct-answer').length,
    'Correct answer header not present'
  );
  assert.notOk(
    $component.find('table tbody td.correct-answer').length,
    'Correct answer column not present'
  );
});

test('Questions Layout - do not show reaction bar', function(assert) {
  const questionResults = Ember.A([
    QuestionResult.create({
      correct: true,
      resource: Ember.Object.create({
        text: 'This is a question 1',
        questionType: 'MC',
        order: 1,
        isOpenEnded: false,
        answers: Ember.A([])
      }),
      reaction: 4,
      timeSpent: 2096,
      userAnswer: 'Student Multiple Choice answer 1'
    }),
    QuestionResult.create({
      correct: true,
      resource: Ember.Object.create({
        text: 'This is a question 2',
        questionType: 'MC',
        order: 3, //not consecutive
        isOpenEnded: false,
        answers: Ember.A([])
      }),
      reaction: 4,
      timeSpent: 2096,
      userAnswer: 'Student Multiple Answer answer 2'
    })
  ]);

  this.set('questionResults', questionResults);
  this.set('isAnswerKeyHidden', undefined);

  this.render(hbs`
    {{reports/assessment/gru-questions
      isAnswerKeyHidden=isAnswerKeyHidden
      results=questionResults
      showReactionBar=false
    }}`);
  const $component = this.$('.reports.assessment.gru-questions');

  T.notExists(
    assert,
    $component.find('table thead th.header.reaction'),
    'Reaction header should not be visible'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.question-reaction'),
    'Reaction column should not be visible'
  );
});
