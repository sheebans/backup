import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | home', {
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
  visit('/home');

  andThen(function() {
    assert.equal(currentURL(), '/home');

    const $userContainer = find('.controller.home');
    T.exists(assert, $userContainer, 'Missing user container');

    T.exists(
      assert,
      $userContainer.find('.greetings'),
      'Missing user greetings'
    );

    const $navigatorContainer = $userContainer.find('.home-navigator');
    T.exists(assert, $navigatorContainer, 'Missing user navigator');

    T.exists(
      assert,
      $navigatorContainer.find('.actions .create-class-cta'),
      'Missing create class button'
    );

    T.exists(
      assert,
      $navigatorContainer.find('.actions .join-class-cta'),
      'Missing join class button'
    );

    T.exists(assert, $userContainer.find('.content'), 'Missing user content');
  });
});

test('Show archived/active classes', function(assert) {
  visit('/home');

  andThen(function() {
    assert.equal(currentURL(), '/home');

    assert.ok(
      $('#active-classes').hasClass('active'),
      'Active classes should be visible'
    );
    assert.ok(
      !$('#archived-classes').hasClass('active'),
      'Archived classes should not be visible'
    );

    click('li.archived-classes a');
    andThen(function() {
      assert.ok(
        $('#archived-classes').hasClass('active'),
        'Archived classes should be visible'
      );
      assert.ok(
        !$('#active-classes').hasClass('active'),
        'Active classes should not be visible'
      );
      click('li.active-classes a');
      andThen(function() {
        assert.ok(
          $('#active-classes').hasClass('active'),
          'Active classes should be visible'
        );
        assert.ok(
          !$('#archived-classes').hasClass('active'),
          'Archived classes should not be visible'
        );
      });
    });
  });
});
