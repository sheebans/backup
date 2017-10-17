import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | class/analytics/performance/teacher/lesson', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-analytics-performance-teacher-lesson-token',
      user: {
        /* using a pochita, @see classes/class-for-pochita-as-teacher-200-response.js */
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher-lesson'
    );
    T.exists(
      assert,
      $performanceContainer.find('.gru-metrics-table'),
      'Missing metrics table component'
    );

    const $classMenu = find(
      '.controller.class .gru-class-navigation .class-menu'
    );
    T.exists(
      assert,
      $classMenu.find('.analytics.selected'),
      'Missing selected analytics item'
    );

    //assert breadcrumb text
    const $breadcrumb = find('.controller.class .gru-breadcrumb');
    const $breadcrumbItems = $breadcrumb.find('.item');
    assert.equal(
      $breadcrumbItems.length,
      3,
      'Incorrect number of breadcrumb items'
    );
    assert.equal(
      T.text($breadcrumb.find('.item:last-child button')),
      'Release Day Quiz',
      'Wrong breadcrumb item label'
    );
    const $filters = find('.controller.class .gru-filters');
    T.exists(assert, $filters, 'Filters should be visible');
  });
});

test('Navigate to collection', function(assert) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher-lesson'
    );
    const $metricTable = $performanceContainer.find('.gru-metrics-table');

    click($metricTable.find('thead tr:eq(0) th:eq(1)'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id/collection/first-assessment-id'
      );
      //menu is still selected
      const $classMenu = find(
        '.controller.class .gru-class-navigation .class-menu'
      );
      T.exists(
        assert,
        $classMenu.find('.analytics.selected'),
        'Missing selected analytics item'
      );
    });
  });
});

test('Navigate to student report and go back to data', function(assert) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher-lesson'
    );
    const $metricTable = $performanceContainer.find('.gru-metrics-table');

    click($metricTable.find('tbody tr:eq(2) td:eq(1) .report'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
      );
      //menu is still selected
      const $container = find(
        '.controller .analytics-performance-teacher-lesson'
      );
      T.exists(assert, $container, 'Missing container');
    });
  });
});
