import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | index-student', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      'token-api3': 'user-token',
      user: {
        gooruUId: 'param-123'
      }
    });
  }
});

test('logged in as a student and home-link button navigation', function(
  assert
) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    const $navMenu = find('.gru-header .menu-navbar');
    click($navMenu.find('.profile-link a.profile'));

    andThen(function() {
      assert.equal(currentURL(), '/param-123/content/courses');
      const $navHeader = find('.gru-header .navbar-header');
      click($navHeader.find('.home-link'));

      andThen(function() {
        assert.equal(currentURL(), '/student-home');
      });
    });
  });
});

test('logged in as a student and go to my performance', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    const $navMenu = find('.gru-header .menu-navbar');
    click($navMenu.find('.performance-link a'));

    andThen(function() {
      assert.equal(currentURL(), '/student/performance');
    });
  });
});
