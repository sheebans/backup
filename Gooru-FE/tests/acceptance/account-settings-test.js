import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | account-settings', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'account-settings-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/account-settings/pochita');

  andThen(function() {
    assert.equal(currentURL(), '/account-settings/pochita');

    const $accountSettingsContainer = find('.controller.account-settings');
    T.exists(
      assert,
      $accountSettingsContainer,
      'Missing account-settings container'
    );
    T.exists(
      assert,
      $accountSettingsContainer.find('article'),
      'Missing article'
    );

    const $accountSettingsHeader = $accountSettingsContainer.find('header');
    T.exists(assert, $accountSettingsHeader, 'Missing header');
    T.exists(
      assert,
      $accountSettingsHeader.find('h1'),
      'Missing account settings title'
    );
    T.exists(
      assert,
      $accountSettingsHeader.find('.actions'),
      'Missing header actions'
    );

    assert.equal(
      $accountSettingsHeader.find('.actions > button').length,
      1,
      'Number of header actions'
    );
    assert.ok($accountSettingsHeader.find('> nav').length, 'Header navigation');
    assert.equal(
      $accountSettingsHeader.find('> nav > a').length,
      2,
      'Number of header navigation links'
    );

    assert.equal(
      $accountSettingsContainer.find('section').length,
      2,
      'Number of account settings sections'
    );

    const $accountInformation = $accountSettingsContainer.find(
      'section#accountInformation'
    );
    assert.ok($accountInformation.length, 'account Information section');
    assert.ok(
      $accountInformation.find('h2').length,
      'account Information title'
    );
    assert.ok(
      $accountInformation.find('.email').length,
      'account Information email'
    );
    assert.ok(
      $accountInformation.find('.password').length,
      'account Information password'
    );

    const $privateInformation = $accountSettingsContainer.find(
      'section#privateInformation'
    );
    assert.ok($privateInformation.length, 'private Information section');
    assert.ok(
      $privateInformation.find('h2').length,
      'private Information title'
    );
    assert.ok(
      $privateInformation.find('.gender').length,
      'private Information gender'
    );
    assert.ok(
      $privateInformation.find('.dateOfBirth').length,
      'private Information dateOfBirth'
    );
  });
});
