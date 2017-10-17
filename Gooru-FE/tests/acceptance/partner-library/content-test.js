import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | partner-library content', {
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

test('Partner Library Content Layout', function(assert) {
  assert.expect(8);
  visit('/library/1/content');

  andThen(function() {
    assert.equal(currentURL(), '/library/1/content');

    const $contentContainer = find('.partner-library .content');
    T.exists(assert, $contentContainer, 'Missing content container');

    const $contentOptions = $contentContainer.find(
      '.partner-library-content .category-options'
    );
    T.exists(assert, $contentOptions, 'Missing content options');

    T.exists(
      assert,
      $contentOptions.find('li.courses'),
      'Missing courses link'
    );
    T.exists(
      assert,
      $contentOptions.find('li.collections'),
      'Missing collections link'
    );
    T.exists(
      assert,
      $contentOptions.find('li.assessments'),
      'Missing assessments link'
    );
    T.exists(
      assert,
      $contentOptions.find('li.resources'),
      'Missing resources link'
    );
    T.exists(
      assert,
      $contentOptions.find('li.questions'),
      'Missing questions link'
    );
  });
});

test('Partner Library Navigation links', function(assert) {
  //assert.expect(6);
  visit('/library/1/content');

  andThen(function() {
    assert.equal(currentURL(), '/library/1/content');

    const $contentContainer = find('.partner-library .content');
    const $contentOptions = $contentContainer.find(
      '.partner-library-content .category-options'
    );

    click($contentOptions.find('li.courses'));
    andThen(function() {
      assert.equal(currentURL(), '/library/1/content/courses');
      click($contentOptions.find('li.collections'));
      andThen(function() {
        assert.equal(currentURL(), '/library/1/content/collections');
        click($contentOptions.find('li.assessments'));
        andThen(function() {
          assert.equal(currentURL(), '/library/1/content/assessments');
          click($contentOptions.find('li.resources'));
          andThen(function() {
            assert.equal(currentURL(), '/library/1/content/resources');
            click($contentOptions.find('li.questions'));
            andThen(function() {
              assert.equal(currentURL(), '/library/1/content/questions');
            });
          });
        });
      });
    });
  });
});
