import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | partner-library content resources', {
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
  visit('/library/1/content/resources');

  andThen(function() {
    assert.equal(currentURL(), '/library/1/content/resources');

    const $resourcesContainer = find('.content-resources');
    T.exists(assert, $resourcesContainer, 'Missing resources container');

    const cards = $resourcesContainer.find('.resources .card');
    assert.equal(cards.length, 1, 'Missing cards');
  });
});
