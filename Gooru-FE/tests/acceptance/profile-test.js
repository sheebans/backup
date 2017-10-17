import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | profile', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'profile-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/id-for-pochita');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/courses');

    const $profileContainer = find('.controller.profile');
    T.exists(assert, $profileContainer, 'Missing profile container');
    T.exists(
      assert,
      $profileContainer.find('> .navigation'),
      'Missing profile navigation'
    );
    T.exists(
      assert,
      $profileContainer.find('> .navigation .profile-info .actions .btn'),
      'Missing profile action button'
    );
    T.exists(
      assert,
      $profileContainer.find('> .content'),
      'Missing profile content'
    );
  });
});

test('menu option \'about\' is selected when navigating directly to profile.about', function(
  assert
) {
  visit('/id-for-pochita/about');

  andThen(function() {
    var $menu = find('.controller.profile > .navigation .profile-menu');

    assert.equal(currentURL(), '/id-for-pochita/about');
    assert.ok(
      $menu.find('.about').hasClass('selected'),
      'Menu option \'about\' should be selected'
    );
  });
});

test('menu option \'content/courses \' is selected when navigating directly to profile.content', function(
  assert
) {
  visit('/id-for-pochita/content/courses');

  andThen(function() {
    var $menu = find('.controller.profile > .navigation .profile-menu');

    assert.equal(currentURL(), '/id-for-pochita/content/courses');
    assert.ok(
      $menu.find('.content').hasClass('selected'),
      'Menu option \'content\' should be selected'
    );
  });
});

test('menu option \'network\' is selected when navigating directly to profile.network', function(
  assert
) {
  visit('/id-for-pochita/network');

  andThen(function() {
    var $menu = find('.controller.profile > .navigation .profile-menu');

    assert.equal(currentURL(), '/id-for-pochita/network');
    assert.ok(
      $menu.find('.network').hasClass('selected'),
      'Menu option \'network\' should be selected'
    );
  });
});

test('menu option selection updates when navigating between sections', function(
  assert
) {
  visit('/id-for-pochita/about');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/about');

    andThen(function() {
      var $menu = find('.controller.profile > .navigation .profile-menu');

      assert.equal(currentURL(), '/id-for-pochita/about');
      assert.ok(
        $menu.find('.about').hasClass('selected'),
        'Menu option \'about\' should be selected'
      );

      click($menu.find('.network'));
      andThen(function() {
        assert.equal(currentURL(), '/id-for-pochita/network/following');
        assert.ok(
          !$menu.find('.about').hasClass('selected'),
          'Menu option \'about\' should no longer be selected'
        );
        assert.ok(
          $menu.find('.network').hasClass('selected'),
          'Menu option \'network\' should now be selected'
        );
      });
    });
  });
});

test('follow button appears by default', function(assert) {
  visit('/param-123/about');
  andThen(function() {
    assert.equal(currentURL(), '/param-123/about');
    andThen(function() {
      var $actions = find('.controller.profile .profile-info .actions');
      assert.ok(
        $actions.find('.btn.follow').length,
        'Follow button is missing'
      );
    });
  });
});

test('click follow button', function(assert) {
  visit('/param-123/about');
  andThen(function() {
    assert.equal(currentURL(), '/param-123/about');
    andThen(function() {
      var $actions = find('.controller.profile .profile-info .actions');
      var $button = $actions.find('.follow');
      $button.on('click', function() {
        assert.ok(true, 'follow button was clicked!');
      });
    });
  });
});

test('click unfollow button', function(assert) {
  visit('/param-123/about');
  andThen(function() {
    assert.equal(currentURL(), '/param-123/about');
    andThen(function() {
      var $actions = find('.controller.profile .profile-info .actions');
      var $button = $actions.find('.unfollow');
      $button.on('click', function() {
        assert.ok(true, 'unfollow button was clicked!');
      });
    });
  });
});

test('Take A Tour', function(assert) {
  assert.expect(2);
  visit('/library');
  andThen(function() {
    let $tooltip;
    click('.app-container .gru-take-tour button.start-tour');
    andThen(function() {
      $tooltip = $('div.introjs-tooltip');

      T.exists(
        assert,
        $tooltip,
        'First step of the tour should display a tooltip'
      );
      assert.equal(
        T.text($tooltip.find('.tour-header h2')),
        'Welcome!',
        'First step title should be "Welcome!"'
      );
    });
  });
});
