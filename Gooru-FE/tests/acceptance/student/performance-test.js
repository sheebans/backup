import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | student performance', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'student-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/student/performance');

  andThen(function() {
    assert.equal(currentURL(), '/student/performance');

    const $performanceContainer = find('.student.performance');
    T.exists(assert, $performanceContainer, 'Missing performance container');

    T.exists(
      assert,
      $performanceContainer.find('.gru-performance-filter-panel'),
      'Missing gru-performance-filter-panel component'
    );

    const $performanceContent = $performanceContainer.find(
      '.performance-content '
    );
    T.exists(assert, $performanceContent, 'Missing performance content');

    const $header = $performanceContent.find('.panel-header');
    T.exists(assert, $header, 'Missing performance header');
    T.exists(assert, $header.find('h1'), 'Missing title');
    T.exists(assert, $header.find('p'), 'Missing primary text');
    T.exists(
      assert,
      $header.find('button.download'),
      'Missing download button'
    );

    const $filters = $performanceContent.find('.filters');
    T.exists(assert, $filters, 'Missing filters');
    T.exists(
      assert,
      $filters.find('.grading-scale-legend'),
      'Missing grading-scale-legend component'
    );
    T.exists(
      assert,
      $filters.find('.radios-container'),
      'Missing radio buttons container'
    );
    assert.equal(
      $filters.find('.radios-container input[type=radio]').length,
      2,
      'Missing assessment/collection filter radio buttons'
    );
    T.exists(
      assert,
      $performanceContent.find('.gru-performance-table'),
      'Missing gru-performance-table component'
    );
  });
});

test('Take A Tour', function(assert) {
  assert.expect(2);
  visit('/student/performance');
  andThen(function() {
    let $tooltip;
    click('.app-container .gru-take-tour button.start-tour');
    andThen(function() {
      $tooltip = $('div.introjs-tooltip');

      T.exists(
        assert,
        $tooltip,
        'First step of the tour should display a tooltip'
      );
      assert.equal(
        T.text($tooltip.find('.tour-header h2')),
        'Welcome!',
        'First step title should be "Welcome!"'
      );
    });
  });
});
