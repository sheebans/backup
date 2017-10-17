import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import T from 'dummy/tests/helpers/assert';

moduleForAcceptance('Acceptance | reports/student-context');

test('Layout', function(assert) {
  assert.expect(8);
  visit('/reports/student-context/context-simple-id');

  andThen(function() {
    assert.equal(currentURL(), '/reports/student-context/context-simple-id');
    const $studentReport = find('.reports.qz-student-report');
    T.exists(assert, $studentReport, 'Missing report');
    assert.equal(
      $studentReport.find('.summary-container .percentage').text(),
      '67%',
      'Wrong grade'
    );
    assert.equal(
      $studentReport.find('.bubbles-list').children().length,
      2,
      'Wrong length of questions'
    );
    const $questions = $studentReport.find('.qz-questions.performance-view');
    T.exists(
      assert,
      $questions.find('table tr:first-child .question-score .incorrect'),
      'Wrong score value for first answer'
    );
    T.exists(
      assert,
      $questions.find('table tr:last-child .question-score .correct'),
      'Wrong score value for last answer'
    );

    const $mastery = $studentReport.find('.qz-assessment-report .qz-mastery');
    T.exists(assert, $mastery, 'Missing Mastery Section');
    assert.equal(
      $mastery.find('.qz-learning-target').length,
      1,
      'Incorrect number of learning targets'
    );
  });
});
