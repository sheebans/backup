import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | partner-library content courses', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      'token-api3': 'user-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/library/1/content/courses');

  andThen(function() {
    assert.equal(currentURL(), '/library/1/content/courses');

    const $coursesContainer = find('.profile-courses');
    T.exists(assert, $coursesContainer, 'Missing courses container');
    T.exists(
      assert,
      $coursesContainer.find(
        '.course-content >div.gru-collection-card:first-child'
      ),
      'Missing first course card'
    );
    assert.equal(
      T.text(
        $coursesContainer.find(
          '.course-content >div.gru-collection-card:first-child .title-section h3'
        )
      ),
      'Test Course - 1',
      'Incorrect course card title text'
    );
  });
});
