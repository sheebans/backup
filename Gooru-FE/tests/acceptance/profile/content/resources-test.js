import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | profile content resources', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'resources-content-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/id-for-pochita/content/resources');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/resources');

    const $contentCourseContainer = find('.controller.content-resources');
    T.exists(
      assert,
      $contentCourseContainer,
      'Missing content resources container'
    );

    const cards = $contentCourseContainer.find('.resources .card');
    assert.equal(cards.length, 5, 'Missing cards');
  });
});
