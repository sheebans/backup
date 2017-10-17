import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | student independent', {
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
  visit('/student/course/course-for-pochita-as-student');

  andThen(function() {
    assert.ok(
      currentURL().includes('/student/course/course-for-pochita-as-student')
    );

    const $courseContainer = find('.student-independent-container');
    T.exists(assert, $courseContainer, 'Missing course container');

    const $classHeader = $courseContainer.find('.header');
    T.exists(assert, $classHeader, 'Missing class header');
    T.exists(
      assert,
      $classHeader.find('.go-back-container .back-to'),
      'Missing back link'
    );

    T.exists(
      assert,
      $courseContainer.find('.gru-class-navigation'),
      'Missing navigation'
    );
    T.exists(assert, $courseContainer.find('.content'), 'Missing content');
  });
});

test('Click on back link', function(assert) {
  visit('/student/course/course-for-pochita-as-student');
  andThen(function() {
    assert.ok(
      currentURL().includes('/student/course/course-for-pochita-as-student')
    );

    const $classContainer = find('.student-independent-container');
    const $classHeader = $classContainer.find('.header');

    click($classHeader.find('.go-back-container .back-to'));
    andThen(function() {
      assert.equal(currentURL(), '/student-independent-learning/courses');
    });
  });
});
