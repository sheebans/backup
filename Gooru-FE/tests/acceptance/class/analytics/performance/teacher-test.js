import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | class/analytics/performance/teacher', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-analytics-performance-teacher-token',
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
      '.controller.class .controller.analytics-performance-teacher'
    );
    T.exists(assert, $performanceContainer, 'Missing performance container');

    T.exists(
      assert,
      $performanceContainer.find('.navigation .performance'),
      'Missing performance navigation tab'
    );
    T.exists(
      assert,
      $performanceContainer.find('.navigation .mastery'),
      'Missing mastery navigation tab'
    );
    T.exists(
      assert,
      $performanceContainer.find('.controls .teacher-breadcrumb'),
      'Missing performance breadcrumb'
    );
    T.exists(
      assert,
      $performanceContainer.find('.controls .teacher-actions'),
      'Missing performance actions'
    );
    T.exists(
      assert,
      $performanceContainer.find('.gru-filters .data-picker'),
      'Missing data picker'
    );
    T.exists(
      assert,
      $performanceContainer.find('.gru-filters .data-picker .gru-data-picker'),
      'Missing data picker'
    );
    T.exists(
      assert,
      $performanceContainer.find('.gru-filters .performance-scale'),
      'Missing performance scale area'
    );
    T.exists(
      assert,
      $performanceContainer.find(
        '.gru-filters .performance-scale .grading-scale-legend'
      ),
      'Missing grading-scale-legend helper'
    );
    T.exists(
      assert,
      $performanceContainer.find('.gru-content'),
      'Missing performance content'
    );
    T.exists(
      assert,
      $performanceContainer.find(
        '.controls .teacher-breadcrumb .gru-breadcrumb'
      ),
      'Missing performance breadcrumb component'
    );
    T.exists(
      assert,
      $performanceContainer.find('.controls .teacher-actions .gru-actions-bar'),
      'Missing performance actions component'
    );

    const $classMenu = find(
      '.controller.class .gru-class-navigation .class-menu'
    );
    T.exists(
      assert,
      $classMenu.find('.analytics.selected'),
      'Missing selected analytics item'
    );

    const $betterExperience = find('div.better-experience.visible-xs');
    T.exists(assert, $betterExperience, 'Missing better experience alert');
    T.exists(
      assert,
      $betterExperience.find('button.close'),
      'Missing close button'
    );
    assert.equal(
      T.text($betterExperience.find('span.better-experience-message')),
      'For a better Gooru experience, view full Classroom Analytics in tablet or desktop.',
      'Incorrect message'
    );
  });
});

test('Navigating from class navigation', function(assert) {
  visit('/class/class-for-pochita-as-teacher');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher');

    const $overviewMenuItem = find('.navigation .class-menu .analytics');

    click($overviewMenuItem);
    andThen(function() {
      //making sure it goes to the teacher view
      assert.equal(
        currentURL(),
        '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
      );
    });
  });
});

test('When view by both option is selected', function(assert) {
  // TODO Remove this assert and enable the commented code once integration is complete
  assert.ok(true, 'This is a temporal assert!!');

  /*
  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher/course');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course');

    const $performanceContainer = find('.controller.class .controller.analytics-performance-teacher');
    const $bothViewOption = $performanceContainer.find('.controls .gru-actions-bar .dropdown-menu .both a');

    click($bothViewOption);
    andThen(function() {
      assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course?filterBy=both');
    });
  });
  */
});
test('When view by assessment and collection option is selected for course level', function(
  assert
) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher'
    );
    const $metricsTable = find('.gru-metrics-table');

    assert.ok(
      $performanceContainer.find('.gru-filters').length,
      'The table should be visible'
    );

    assert.equal(
      $performanceContainer.find(
        '.gru-filters .data-picker.hidden-xs .gru-data-picker .list-inline li'
      ).length,
      3,
      'The data picker should have 3 options for desktop'
    );
    assert.equal(
      $performanceContainer.find(
        '.gru-filters .data-picker.visible-xs .gru-data-picker .list-inline li'
      ).length,
      3,
      'The data picker should have 3 options for mobile'
    );

    assert.equal(
      $metricsTable.find(
        '.sub-header.hidden-xs .gru-metrics-sub-header:eq(1) .metrics-sub-header .score'
      ).length,
      1,
      'The table should have selected the score filter'
    );

    const $collectionOption = $performanceContainer.find(
      '.controls .gru-actions-bar .btn.collection'
    );
    click($collectionOption);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course?filterBy=collection'
      );
      assert.equal(
        $performanceContainer.find(
          '.gru-filters .data-picker.hidden-xs .gru-data-picker .list-inline li'
        ).length,
        0,
        'The data picker should not appear for desktop'
      );
      assert.equal(
        $performanceContainer.find(
          '.gru-filters .data-picker.visible-xs .gru-data-picker .list-inline li'
        ).length,
        0,
        'The data picker should not appear for mobile'
      );
      assert.equal(
        $metricsTable.find(
          '.sub-header.hidden-xs th:eq(1) .gru-metrics-sub-header .metrics-sub-header'
        ).length,
        1,
        'The table should have one filter'
      );
      assert.equal(
        $metricsTable.find(
          '.sub-header.hidden-xs .gru-metrics-sub-header:eq(2) .metrics-sub-header .time-spent'
        ).length,
        1,
        'The table should filter by study time'
      );
    });
  });
});

test('When view by assessment and collection option is selected for unit level', function(
  assert
) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher'
    );
    const $metricsTable = find('.gru-metrics-table');

    assert.ok(
      $performanceContainer.find('.gru-filters').length,
      'The table should be visible'
    );

    assert.equal(
      $performanceContainer.find(
        '.gru-filters .data-picker.hidden-xs .gru-data-picker .list-inline li'
      ).length,
      3,
      'The data picker should have 3 options for desktop'
    );
    assert.equal(
      $performanceContainer.find(
        '.gru-filters .data-picker.visible-xs .gru-data-picker .list-inline li'
      ).length,
      3,
      'The data picker should have 3 options for mobile'
    );

    assert.equal(
      $metricsTable.find(
        '.sub-header.hidden-xs .gru-metrics-sub-header:eq(1) .metrics-sub-header .score'
      ).length,
      1,
      'The table should have selected the score filter'
    );

    const $collectionOption = $performanceContainer.find(
      '.controls .gru-actions-bar .btn.collection'
    );
    click($collectionOption);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id?filterBy=collection'
      );
      assert.equal(
        $performanceContainer.find(
          '.gru-filters .data-picker.hidden-xs .gru-data-picker .list-inline li'
        ).length,
        0,
        'The data picker should not appear for desktop'
      );
      assert.equal(
        $performanceContainer.find(
          '.gru-filters .data-picker.visible-xs .gru-data-picker .list-inline li'
        ).length,
        0,
        'The data picker should not appear for mobile'
      );
      assert.equal(
        $metricsTable.find(
          '.sub-header.hidden-xs th:eq(1) .gru-metrics-sub-header .metrics-sub-header'
        ).length,
        1,
        'The table should have one filter'
      );
      assert.equal(
        $metricsTable.find(
          '.sub-header.hidden-xs .gru-metrics-sub-header:eq(2) .metrics-sub-header .time-spent'
        ).length,
        1,
        'The table should filter by study time'
      );
    });
  });
});

test('When view by assessment and collection option is selected for lesson level', function(
  assert
) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher'
    );
    const $metricsTable = find('.gru-metrics-table');

    assert.ok(
      $performanceContainer.find('.gru-filters').length,
      'The table should be visible'
    );

    assert.equal(
      $performanceContainer.find(
        '.gru-filters .data-picker.hidden-xs .gru-data-picker .list-inline li'
      ).length,
      3,
      'The data picker should have 3 options for desktop'
    );
    assert.equal(
      $performanceContainer.find(
        '.gru-filters .data-picker.visible-xs .gru-data-picker .list-inline li'
      ).length,
      3,
      'The data picker should have 3 options for mobile'
    );

    assert.equal(
      $metricsTable.find(
        '.sub-header.hidden-xs .gru-metrics-sub-header:eq(1) .metrics-sub-header .score'
      ).length,
      1,
      'The table should have selected the score filter'
    );

    const $collectionOption = $performanceContainer.find(
      '.controls .gru-actions-bar .btn.collection'
    );
    click($collectionOption);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id/lesson/first-lesson-id?filterBy=collection'
      );
      assert.equal(
        $performanceContainer.find(
          '.gru-filters .data-picker.hidden-xs .gru-data-picker .list-inline li'
        ).length,
        2,
        'The data picker should appear with 2 options for desktop'
      );
      assert.equal(
        $performanceContainer.find(
          '.gru-filters .data-picker.visible-xs .gru-data-picker .list-inline li'
        ).length,
        2,
        'The data picker should  appear with 2 options for mobile'
      );
      assert.equal(
        $metricsTable.find(
          '.sub-header.hidden-xs .gru-metrics-sub-header:eq(1) .metrics-sub-header'
        ).length,
        2,
        'The table should have one filter'
      );
      assert.equal(
        $metricsTable.find(
          '.sub-header.hidden-xs .gru-metrics-sub-header:eq(1) .metrics-sub-header .time-spent'
        ).length,
        1,
        'The table should filter by study time'
      );
      assert.equal(
        $metricsTable.find(
          '.sub-header.hidden-xs .gru-metrics-sub-header:eq(1) .metrics-sub-header .score'
        ).length,
        1,
        'The table should filter by score'
      );
    });
  });
});

test('View Full Screen and Exit Full Screen', function(assert) {
  visit(
    '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-teacher/analytics/performance/teacher/course'
    );

    const $performanceContainer = find(
      '.controller.class .controller.analytics-performance-teacher'
    );
    const $viewFullScreen = $performanceContainer.find(
      '.controls .gru-actions-bar .full-screen'
    );

    T.exists(
      assert,
      $performanceContainer.find(
        '.controls .gru-actions-bar button.full-screen.view-full-screen'
      ),
      'Button should be on view full screen mode'
    );

    click($viewFullScreen);

    andThen(function() {
      T.exists(
        assert,
        $performanceContainer.find('div.navigation.hide'),
        'Navigation should be hide'
      );

      T.exists(
        assert,
        $performanceContainer.find(
          '.controls .gru-actions-bar button.full-screen.exit-full-screen'
        ),
        'Button should be on exit full screen mode'
      );

      const $navigation = find(
        '.analytics-performance-teacher div.navigation.hide'
      );

      T.exists(assert, $navigation, 'Navigation Menu should be hide');

      click($viewFullScreen);

      andThen(function() {
        T.exists(
          assert,
          $performanceContainer.find('div.navigation.show'),
          'Navigation should be show'
        );
        T.exists(
          assert,
          $performanceContainer.find(
            '.controls .gru-actions-bar button.full-screen.view-full-screen'
          ),
          'Button should be on view full screen mode'
        );

        const $navigation = find(
          '.analytics-performance-teacher div.navigation.show'
        );

        T.exists(assert, $navigation, 'Navigation Menu should be show');

        click($viewFullScreen);
        andThen(function() {
          T.exists(
            assert,
            $performanceContainer.find(
              '.controls .gru-actions-bar button.full-screen.exit-full-screen'
            ),
            'Button should be on exit full screen mode'
          );
          click($navigation);
          andThen(function() {
            keyEvent($performanceContainer, 'keyup', 27);
            andThen(function() {
              T.exists(
                assert,
                $performanceContainer.find('div.navigation.show'),
                'Navigation should be show'
              );
              T.exists(
                assert,
                $performanceContainer.find(
                  '.controls .gru-actions-bar button.full-screen.view-full-screen'
                ),
                'Button should be on view full screen mode'
              );

              const $navigation = find(
                '.analytics-performance-teacher div.navigation.show'
              );

              T.exists(assert, $navigation, 'Navigation Menu should be show');
            });
          });
        });
      });
    });
  });
});
