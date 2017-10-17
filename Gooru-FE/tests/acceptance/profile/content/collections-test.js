import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | profile content collections', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'collections-content-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/id-for-pochita/content/collections');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections');

    const $contentCourseContainer = find('.controller.content-collections');
    T.exists(
      assert,
      $contentCourseContainer,
      'Missing content collections container'
    );

    const cards = $contentCourseContainer.find('.collections .card');
    assert.equal(cards.length, 5, 'Missing cards');
  });
});

test('Add to daily class activities', function(assert) {
  visit('/id-for-pochita/content/collections');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections');

    const $contentCollectionsContainer = find(
      '.controller.content-collections'
    );
    T.exists(
      assert,
      $contentCollectionsContainer,
      'Missing content collections container'
    );

    const $addTo = $contentCollectionsContainer.find(
      '.collections .card:nth-child(1) .add-btn'
    );
    click($addTo);
    andThen(function() {
      assert.ok(
        find('.gru-add-to-classroom').length,
        'Missing add to classroom modal'
      );
    });
  });
});
