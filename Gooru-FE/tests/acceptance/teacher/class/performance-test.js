import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | teacher/class/performance', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'teacher-class-performance-token',
      user: {
        /* using a pochita, @see classes/class-for-pochita-as-teacher-200-response.js */
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout at course level', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/performance');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');

    T.exists(
      assert,
      $performanceContainer.find('.gru-grade-items'),
      'Missing gru-grade-items component'
    );

    T.exists(
      assert,
      $performanceContainer.find('.gru-metrics-table'),
      'Missing metrics table component'
    );

    const $actions = $performanceContainer.find('.actions');
    assert.equal(
      $actions.find('.radio-button').length,
      2,
      'Incorrect number of radio buttons'
    );
    assert.ok($actions.find('.report-btn').length, 'Missing download button');

    const $options = $performanceContainer.find('.options');
    const $dataPicker = $options.find('.data-picker .gru-data-picker');
    assert.ok($dataPicker.length, 'Missing data picker');

    const $info = $performanceContainer.find('.info');
    const $breadcrumb = $info.find('.teacher-breadcrumb');
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
    const $legend = $performanceContainer.find('.info .grading-scale-legend');
    assert.ok($legend.length, 'Missing grading scale legend');
  });
});

test('Navigate to unit', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/performance');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');
    const $metricTable = $performanceContainer.find('.gru-metrics-table');

    click($metricTable.find('thead tr:eq(0) th:eq(1)'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/teacher/class/class-for-pochita-as-teacher/performance?unitId=first-unit-id'
      );
    });
  });
});

test('Test data picker options selected', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/performance');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance'
    );
    const $performanceContainer = find('.controller.teacher.class.performance');

    const $options = $performanceContainer.find('.options');
    const $dataPicker = $options.find('.data-picker .gru-data-picker');
    click($dataPicker.find('ul input:eq(1)')); //click on completion
    andThen(function() {
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
      T.notExists(
        assert,
        $performanceInformation.find('.completion'),
        'Completion should not appear at course level'
      );
      T.exists(
        assert,
        $performanceInformation.find('.study-time'),
        'Missing study time picker at course level'
      );

      click($metricTable.find('thead tr:eq(0) th:eq(1)'));
      andThen(function() {
        assert.equal(
          currentURL(),
          '/teacher/class/class-for-pochita-as-teacher/performance?unitId=first-unit-id'
        );

        const $unitPerformanceContainer = find(
          '.controller.teacher.class.performance'
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

        T.notExists(
          assert,
          $unitPerformanceInformation.find('.completion'),
          'Completion data picker should not appear at unit level'
        );
        T.exists(
          assert,
          $unitPerformanceInformation.find('.study-time'),
          'Missing study time picker at unit level'
        );
      });
    });
  });
});

test('Test collections filter radio button selected', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/performance');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');
    const $actions = $performanceContainer.find('.actions');
    const $collectionRadioButton = $actions.find(
      '.radios-container .collection input'
    );

    click($collectionRadioButton); //click on collections filter radio button
    andThen(function() {
      assert.equal(
        currentURL(),
        '/teacher/class/class-for-pochita-as-teacher/performance?filterBy=collection'
      );
    });
  });
});

test('Layout at unit level', function(assert) {
  visit(
    '/teacher/class/class-for-pochita-as-teacher/performance?unitId=first-unit-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance?unitId=first-unit-id'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');
    T.exists(
      assert,
      $performanceContainer.find('.gru-metrics-table'),
      'Missing metrics table component'
    );

    const $actions = $performanceContainer.find('.actions');
    assert.equal(
      $actions.find('.radio-button').length,
      2,
      'Incorrect number of radio buttons'
    );
    assert.ok($actions.find('.report-btn').length, 'Missing report button');

    const $options = $performanceContainer.find('.options');
    const $dataPicker = $options.find('.data-picker .gru-data-picker');
    assert.ok($dataPicker.length, 'Missing data picker');

    //assert breadcrumb text
    const $info = $performanceContainer.find('.info');
    const $breadcrumb = $info.find('.teacher-breadcrumb');
    const $breadcrumbItems = $breadcrumb.find('.item');
    assert.equal(
      $breadcrumbItems.length,
      2,
      'Incorrect number of breadcrumb items'
    );
    assert.equal(
      T.text($breadcrumb.find('.item:last-child button')),
      'U1: Food',
      'Wrong breadcrumb item label'
    );
    const $legend = $performanceContainer.find('.info .grading-scale-legend');
    assert.ok($legend.length, 'Missing grading scale legend');
  });
});

test('Navigate to lesson', function(assert) {
  visit(
    '/teacher/class/class-for-pochita-as-teacher/performance?unitId=first-unit-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance?unitId=first-unit-id'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');
    const $metricTable = $performanceContainer.find('.gru-metrics-table');

    click($metricTable.find('thead tr:eq(0) th:eq(3)'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/teacher/class/class-for-pochita-as-teacher/performance?lessonId=first-lesson-id&unitId=first-unit-id'
      );
    });
  });
});

test('Layout for lesson', function(assert) {
  visit(
    '/teacher/class/class-for-pochita-as-teacher/performance?lessonId=first-lesson-id&unitId=first-unit-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance?lessonId=first-lesson-id&unitId=first-unit-id'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');
    T.exists(
      assert,
      $performanceContainer.find('.gru-metrics-table'),
      'Missing metrics table component'
    );

    const $options = $performanceContainer.find('.options');
    const $dataPicker = $options.find('.data-picker .gru-data-picker');
    assert.ok($dataPicker.length, 'Missing data picker');

    //assert breadcrumb text
    const $info = $performanceContainer.find('.info');
    const $breadcrumb = $info.find('.teacher-breadcrumb');
    const $breadcrumbItems = $breadcrumb.find('.item');
    assert.equal(
      $breadcrumbItems.length,
      3,
      'Incorrect number of breadcrumb items'
    );
    assert.equal(
      T.text($breadcrumb.find('.item:last-child button')),
      'L3: Release Day Quiz',
      'Wrong breadcrumb item label'
    );
    const $legend = $performanceContainer.find('.info .grading-scale-legend');
    assert.ok($legend.length, 'Missing grading scale legend');
  });
});

test('Navigate to collection', function(assert) {
  visit(
    '/teacher/class/class-for-pochita-as-teacher/performance?lessonId=first-lesson-id&unitId=first-unit-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance?lessonId=first-lesson-id&unitId=first-unit-id'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');
    const $metricTable = $performanceContainer.find('.gru-metrics-table');

    click($metricTable.find('thead tr:eq(0) th:eq(1)'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/teacher/class/class-for-pochita-as-teacher/unit/first-unit-id/lesson/first-lesson-id/collection/first-assessment-id'
      );
    });
  });
});

test('Navigate to student report and go back to data', function(assert) {
  visit(
    '/teacher/class/class-for-pochita-as-teacher/performance?lessonId=first-lesson-id&unitId=first-unit-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/performance?lessonId=first-lesson-id&unitId=first-unit-id'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');
    const $metricTable = $performanceContainer.find('.gru-metrics-table');

    click($metricTable.find('tbody tr:eq(2) td:eq(1) .report span'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/reports/student-collection-analytics?classId=462bcc67-1717-4140-bdc0-672e7bf4cdb1&collectionId=first-assessment-id&courseId=course-123&lessonId=first-lesson-id&role=teacher&type=assessment&unitId=first-unit-id&userId=c4176d77-2507-4bd0-b1a1-308ad98526e5'
      );
      //menu is still selected
      const $container = find('.controller.analytics.collection.student');
      T.exists(assert, $container, 'Missing container');
    });
  });
});

test('Show message when there is no performance data', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher-no-course/performance');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher-no-course/performance'
    );

    const $performanceContainer = find('.controller.teacher.class.performance');
    T.notExists(assert, $performanceContainer, 'Should not be visible');

    const $noContentMessage = find('.no-content');
    T.exists(
      assert,
      $noContentMessage,
      'No content message should be displayed'
    );
    assert.equal(
      $noContentMessage.text(),
      'Your students have not yet started studying a course.',
      'Correct no content message'
    );
  });
});
