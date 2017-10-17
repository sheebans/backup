import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | student/class/analytics/performance', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'student-class-analytics-performance-token',
      user: {
        /* Using pochita, but as a student in classes */
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/student/class/class-for-pochita-as-student/analytics/performance');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/student/class/class-for-pochita-as-student/analytics/performance'
    );

    const $performanceContainer = find(
      '.controller.analytics-performance-student'
    );
    T.exists(assert, $performanceContainer, 'Missing performance container');

    T.exists(
      assert,
      $performanceContainer.find('.student-actions'),
      'Missing performance actions'
    );
    T.exists(
      assert,
      $performanceContainer.find('.student-actions .gru-actions-bar'),
      'Missing performance actions component'
    );
    T.exists(
      assert,
      $performanceContainer.find('.performance-content'),
      'Missing performance content'
    );

    const $classMenu = find('.student.class .gru-class-navigation .nav');
    T.exists(
      assert,
      $classMenu.find('.performance.active'),
      'Missing selected performance'
    );
  });
});
test('Navigating from class navigation', function(assert) {
  visit('/student/class/class-for-pochita-as-student/analytics/performance');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/student/class/class-for-pochita-as-student/analytics/performance'
    );

    const $performanceMenuItem = find('.nav .performance a');

    click($performanceMenuItem);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/student/class/class-for-pochita-as-student/analytics/performance'
      );
    });
  });
});

test('When filtering by collection is  pre-selected', function(assert) {
  visit(
    '/student/class/class-for-pochita-as-student/analytics/performance?filterBy=collection'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/student/class/class-for-pochita-as-student/analytics/performance?filterBy=collection'
    );

    const $performanceContainer = find(
      '.controller.analytics-performance-student'
    );

    const $actions = $performanceContainer.find('.gru-actions-bar');

    //collection button selected
    T.exists(
      assert,
      $actions.find('.collection.selected'),
      'Missing selected collection button'
    );
    T.notExists(
      assert,
      $actions.find('.assessment.selected'),
      'assessment button should not be selected'
    );
  });
});
