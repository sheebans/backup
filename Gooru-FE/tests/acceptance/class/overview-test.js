import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | class/overview', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-overview-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout as a student', function(assert) {
  visit('/class/class-for-pochita-as-student/overview');
  andThen(function() {
    assert.equal(
      currentURL(),
      '/class/class-for-pochita-as-student/overview?location=first-unit-id%2Bfirst-lesson-id%2Bfirst-assessment-id'
    );

    const $overviewContainer = find('.controller.class .controller.overview');
    assert.ok($overviewContainer.length, 'Missing overview container');

    const $overviewOption = find('.class-menu');
    assert.ok(
      $overviewOption.find(
        '.list-group .list-group-item.class-menu-item.overview.selected'
      ),
      'Overview option should be selected'
    );

    const $overviewHeader = find('.overview-header', $overviewContainer);
    assert.ok($overviewHeader.length, 'Missing overview header');

    assert.ok($overviewHeader.find('h3').length, 'Missing title');
    assert.ok(
      $overviewHeader.find('button.locate').length,
      'Missing locate button'
    );
    assert.ok(
      !$overviewHeader.find('button.edit-content').length,
      'Edit Content button should not be present'
    );
    // The course map should be expanded all the way to the resource of the user's current location
    // Per /app/services/api-sdk/course-location#findOneByUser,
    // the user current location is: second unit, first lesson, second resource
    const $expandedUnits = find(
      '.gru-accordion-unit.expanded',
      $overviewContainer
    );
    assert.equal(
      $expandedUnits.length,
      1,
      'Wrong number of unit accordions expanded'
    );

    const $expandedLessons = find(
      '.gru-accordion-lesson.expanded',
      $overviewContainer
    );
    assert.equal(
      $expandedLessons.length,
      1,
      'Wrong number of lesson accordions expanded'
    );

    var $accordion = find('.gru-accordion-unit:eq(0)', $overviewContainer);
    assert.ok($accordion.hasClass('expanded'), 'First unit should be expanded');

    $accordion = find('.gru-accordion-lesson:eq(2)', $accordion);
    assert.ok(
      $accordion.hasClass('expanded'),
      '3rd lesson in the second unit should be expanded'
    );

    var $resource = find('.collections .panel:eq(0)', $accordion);
    assert.ok(
      $resource.hasClass('selected'),
      'First collection should be marked as selected'
    );

    var $resourceTitle = $resource.find('.panel-title .title');
    assert.notOk(
      $resourceTitle.hasClass('disabled'),
      'Second resource should not be disabled'
    );
  });
});

// TODO: Test opening the accordions using the Locate button
/*
test('Layout as a teacher', function (assert) {
  visit('/class/class-for-pochita-as-teacher/overview');
  andThen(function () {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/overview');

    const $overviewContainer = find('.controller.class .controller.overview');
    assert.ok($overviewContainer.length, 'Missing overview container');

    const $overviewHeader = find('.overview-header', $overviewContainer);
    assert.ok($overviewHeader.length, 'Missing overview header');

    assert.ok($overviewHeader.find('h3').length, 'Missing title');
    assert.ok($overviewHeader.find('button.edit-content').length, 'Missing edit content button');
    assert.ok(!$overviewHeader.find('button.locate').length, 'Locate button should not be present');

    const $expandedUnits = find('.gru-accordion-unit.expanded', $overviewContainer);
    assert.ok(!$expandedUnits.length, 'None of the unit accordions should be expanded');
  });
});

test('Clicking on a collection in the accordions should open the player with said collection', function (assert) {
  visit('/class/class-10/overview');
  andThen(function () {

    assert.equal(currentURL(), '/class/class-10/overview?location=second-unit-id%2B27f0bc24-c2b5-40d8-bb8f-e6ec939ad553%2B567399f336d4a8e75eb10661');
    const $unitAccordions = find('.gru-accordion-course .gru-accordion-unit');

    // Click on the last unit
    click($unitAccordions.last().find('.panel-title a'));
    andThen(() => {

      const $lessonAccordions = find('.gru-accordion-lesson', $unitAccordions.last());

      // Click on the last lesson
      click($lessonAccordions.last().find('.panel-title a'));
      andThen(() => {

        const $collections = find('.collections .collection', $lessonAccordions.last());

        //Click on the first collection
        click($collections.first().find('.panel-title a'));
        andThen(() => {
          var pathName = currentURL().split('?')[0];

          assert.equal(currentRouteName(), 'context-player');
          assert.equal(pathName, '/player/class/90d82226-5d0d-4673-a85d-f93aa0cbddf2/course/75366215-f9d5-424c-8a90-2cabdfeb3ffa/unit/21654d76-45e7-45e9-97ab-5f96a14da137/lesson/third-lesson-id/collection/all-question-types-assessment-id', 'Incorrect path name');
        });
      });
    });
  });
});

test('Clicking on an assessment in the accordions should open the player with said assessment', function (assert) {
  visit('/class/class-for-pochita-as-student/overview');
  andThen(function() {

    assert.equal(currentURL(), '/class/class-for-pochita-as-student/overview?location=second-unit-id%2B27f0bc24-c2b5-40d8-bb8f-e6ec939ad553%2B567399f336d4a8e75eb10661');
    const $unitAccordions = find('.gru-accordion-course .gru-accordion-unit');

    // Click on the last unit
    var $lastUnit = $unitAccordions.last();
    click($lastUnit.find('.panel-title a.title'));
    return wait().then(function() {

      const $lessonAccordions = find('.gru-accordion-lesson', $lastUnit);

      //Click on the last lesson
      const $lastLesson = $lessonAccordions.last();
      click($lastLesson.find('.panel-title a.title'));
      return wait().then(function() {

        const $assessments = find('.collections', $lastLesson);
        assert.ok($assessments.length, '1 button should not be present');
        const $as = find('.collection', $assessments.last());
        assert.ok($as.length, 'Loc2ate button should not be present');
        const $sd = $assessments.first();
        click($assessments.first());
        //click($assessments.first().find('.panel panel-title a'));
        andThen(() => {
          //var pathName = currentURL().split('?')[0];
        //
          assert.equal(currentRouteName(), 'context-player');
        //  //assert.equal(pathName, '/player/class/90d82226-5d0d-4673-a85d-f93aa0cbddf2/course/75366215-f9d5-424c-8a90-2cabdfeb3ffa/unit/21654d76-45e7-45e9-97ab-5f96a14da137/lesson/third-lesson-id/collection/all-question-types-assessment-id', 'Incorrect path name');
        //  assert.equal(pathName, '/player/class/class-for-pochita-as-stfudent/course/75366215-f9d5-424c-8a90-2cabdfeb3ffa/unit/dfc99db4-d331-4733-ac06-35358cee5c64/lesson/third-lesson-id/collection/all-question-types-assessment-id?resourceId=46d4a6d4-991b-4c51-a656-f694e037dd68', 'Incorrect path name');
        });
      });
    });
  });
});
*/
