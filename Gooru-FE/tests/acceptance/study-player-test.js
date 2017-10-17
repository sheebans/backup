import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | study-player', {
  beforeEach: function() {
    window.localStorage.setItem(
      'id-for-pochita_next',
      JSON.stringify({
        context: {
          collection_id: 'first-assessment-id',
          class_id: 'class-for-pochita-as-student',
          course_id: 'course-123',
          unit_id: 'first-unit-id',
          lesson_id: 'first-lesson-id',
          current_item_id: 'first-assessment-id'
        },
        suggestions: []
      })
    );
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'player-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  },
  afterEach: function() {
    window.localStorage.clear();
  }
});

test('Layout - default to collection since parameter is not sent', function(
  assert
) {
  visit(
    '/study-player/course/course-123?unitId=first-unit-id&lessonId=first-lesson-id&collectionId=first-assessment-id&classId=class-for-pochita-as-student'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/study-player/course/course-123?classId=class-for-pochita-as-student&collectionId=first-assessment-id&lessonId=first-lesson-id&resourceId=image-resource-id&role=teacher&type=assessment&unitId=first-unit-id'
    );

    const $playerHeader = find('.gru-study-header');
    T.exists(assert, $playerHeader, 'Missing study player header');

    const $playerContainer = find('.player-container .qz-player');
    T.exists(assert, $playerContainer, 'Missing quizzes player component');
  });
});

test('Take A Tour button hidden', function(assert) {
  assert.expect(2);
  visit(
    '/study-player/course/course-123?unitId=first-unit-id&lessonId=first-lesson-id&collectionId=first-assessment-id&classId=class-for-pochita-as-student'
  );
  andThen(function() {
    assert.equal(
      currentURL(),
      '/study-player/course/course-123?classId=class-for-pochita-as-student&collectionId=first-assessment-id&lessonId=first-lesson-id&resourceId=image-resource-id&role=teacher&type=assessment&unitId=first-unit-id'
    );

    const $showConfirmationContainer = find(
      '.app-container .show-confirmation'
    );
    const $takeTourButton = $showConfirmationContainer.find(
      '.gru-take-tour button.start-tour'
    );
    assert.notOk(
      $takeTourButton.length,
      'Take a tour button should not be displayed'
    );
  });
});
