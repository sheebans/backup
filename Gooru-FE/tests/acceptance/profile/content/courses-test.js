import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | profile content courses', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'course-content-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/id-for-pochita/content/courses');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/courses');

    const $contentCourseContainer = find('.controller.profile-courses');
    T.exists(
      assert,
      $contentCourseContainer,
      'Missing content courses container'
    );
    T.exists(
      assert,
      $contentCourseContainer.find(
        '.course-content >div.gru-collection-card:first-child'
      ),
      'Missing first course card'
    );
    assert.equal(
      T.text(
        $contentCourseContainer.find(
          '.course-content >div.gru-collection-card:first-child .title-section h3'
        )
      ),
      'Test Course',
      'Incorrect course card title text'
    );
  });
});

test('Add to classroom', function(assert) {
  visit('/id-for-pochita/content/courses');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/courses');
    const $contentCourseContainer = find('.controller.profile-courses');
    let $addToClassroom = $contentCourseContainer.find(
      '.course-content >div.gru-collection-card:first-child .actions .add-btn'
    );
    click($addToClassroom);
    andThen(function() {
      assert.ok(
        find('.gru-add-to-classroom').length,
        'Missing add to classroom modal'
      );
    });
  });
});
