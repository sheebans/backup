import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | partner-library', {
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

test('Partner Library Layout', function(assert) {
  assert.expect(7);
  visit('/library/1');

  andThen(function() {
    assert.equal(currentURL(), '/library/1/content/courses');

    const $partnerLibraryContainer = find('.partner-library');
    T.exists(
      assert,
      $partnerLibraryContainer,
      'Missing partner library container'
    );
    T.exists(
      assert,
      $partnerLibraryContainer.find('.side-panel'),
      'Missing partner library side panel'
    );

    const $partnerLibraryInfo = $partnerLibraryContainer.find(
      '.side-panel .partner-library-info'
    );
    T.exists(
      assert,
      $partnerLibraryInfo.find('.partner-library-img'),
      'Missing partner library image'
    );
    T.exists(
      assert,
      $partnerLibraryInfo.find('.partner-library-name'),
      'Missing partner library title'
    );

    const $partnerLibraryMenu = $partnerLibraryContainer.find(
      '.partner-library-menu'
    );
    T.exists(
      assert,
      $partnerLibraryMenu.find('.content'),
      'Missing content option in partner library menu'
    );
    assert.ok(
      $partnerLibraryMenu.find('.content').hasClass('selected'),
      'Menu option \'content\' should be selected by default'
    );
  });
});

test('Partner Library Layout - with short name', function(assert) {
  assert.expect(7);
  visit('/library/defaultLib');

  andThen(function() {
    assert.equal(currentURL(), '/library/defaultLib/content/courses');

    const $partnerLibraryContainer = find('.partner-library');
    T.exists(
      assert,
      $partnerLibraryContainer,
      'Missing partner library container'
    );
    T.exists(
      assert,
      $partnerLibraryContainer.find('.side-panel'),
      'Missing partner library side panel'
    );

    const $partnerLibraryInfo = $partnerLibraryContainer.find(
      '.side-panel .partner-library-info'
    );
    T.exists(
      assert,
      $partnerLibraryInfo.find('.partner-library-img'),
      'Missing partner library image'
    );
    T.exists(
      assert,
      $partnerLibraryInfo.find('.partner-library-name'),
      'Missing partner library title'
    );

    const $partnerLibraryMenu = $partnerLibraryContainer.find(
      '.partner-library-menu'
    );
    T.exists(
      assert,
      $partnerLibraryMenu.find('.content'),
      'Missing content option in partner library menu'
    );
    assert.ok(
      $partnerLibraryMenu.find('.content').hasClass('selected'),
      'Menu option \'content\' should be selected by default'
    );
  });
});
