import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | class/analytics/performance/teacher/course', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-analytics-performance-teacher-course-token',
      user: {
        /* using a pochita, @see classes/class-for-pochita-as-teacher-200-response.js */
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher-course'
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
      1,
      'Incorrect number of breadcrumb items'
    );
    assert.equal(
      T.text($breadcrumb.find('.item:last-child button')),
      'Release time! - Course 1',
      'Wrong breadcrumb item label'
    );

    const $filters = find('.controller.class .gru-filters');
    assert.equal($filters.length, 1, 'Filters should be visible');
  });
});

test('Navigate to unit', function(assert) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher-course'
    );
    const $metricTable = $performanceContainer.find('.gru-metrics-table');

    click($metricTable.find('thead tr:eq(0) th:eq(1)'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id'
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

test('Test data picker options selected', function(assert) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
    );

    const $dataPicker = find('.controller.class .gru-data-picker:eq(0)'); //click the desktop version of the data picker
    click($dataPicker.find('ul input:eq(1)')); //click on completion
    andThen(function() {
      const $performanceContainer = find(
        '.controller.class .controller.analytics-performance-teacher-course'
      );
      const $metricTable = $performanceContainer.find('.gru-metrics-table');
      const $performanceInformation = $metricTable.find(
        '.gru-metrics-performance-information'
      );

      //data picker score item is selected by default
      T.exists(
        assert,
        $performanceInformation.find('.score'),
        'Missing data picker score information at course level'
      );
      T.exists(
        assert,
        $performanceInformation.find('.completion'),
        'Missing  data picker completion information at course level'
      );
      T.notExists(
        assert,
        $performanceInformation.find('.study-time'),
        'Study time item shouldnt be selected at course level'
      );

      click($metricTable.find('thead tr:eq(0) th:eq(1)'));
      andThen(function() {
        assert.equal(
          currentURL(),
          '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id'
        );

        const $unitPerformanceContainer = find(
          '.controller.class .controller.analytics-performance-teacher-unit'
        );
        const $unitMetricTable = $unitPerformanceContainer.find(
          '.gru-metrics-table'
        );
        const $unitPerformanceInformation = $unitMetricTable.find(
          '.gru-metrics-performance-information'
        );

        //data picker score item is selected by default
        T.exists(
          assert,
          $unitPerformanceInformation.find('.score'),
          'Missing  data picker score information at unit level'
        );

        T.exists(
          assert,
          $unitPerformanceInformation.find('.completion'),
          'Missing  data picker completion information at unit level'
        );
        T.notExists(
          assert,
          $unitPerformanceInformation.find('.study-time'),
          'Study time item shouldnt be selected at unit level'
        );
      });
    });
  });
});

test('Test collections/assessments filter button selected', function(assert) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
    );

    const $actionsBar = find('.controller.class .gru-actions-bar');
    const $assessmentButton = $actionsBar.find('button.assessment');
    const $collectionButton = $actionsBar.find('button.collection');
    assert.ok(
      $assessmentButton.hasClass('selected'),
      'assessment button should be selected by default'
    );

    click($collectionButton); //click on collections filter button

    andThen(function() {
      assert.ok(
        $collectionButton.hasClass('selected'),
        'collection button should be selected'
      );
      assert.ok(
        !$assessmentButton.hasClass('selected'),
        'assessment button should not be selected'
      );
      assert.equal(
        currentURL(),
        '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course?filterBy=collection'
      );

      click($assessmentButton); //click on assessments filter button
      andThen(function() {
        assert.ok(
          !$collectionButton.hasClass('selected'),
          'collection button should not be selected'
        );
        assert.ok(
          $assessmentButton.hasClass('selected'),
          'assessment button should be selected'
        );

        assert.equal(
          currentURL(),
          '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
        );
      });
    });
  });
});
