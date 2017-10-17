import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | partner-library content assessments', {
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

test('Partner Library Assessments Layout', function(assert) {
  visit('/library/1/content/assessments');

  andThen(function() {
    assert.equal(currentURL(), '/library/1/content/assessments');

    const $assessmentsContainer = find('.content-assessments');
    T.exists(assert, $assessmentsContainer, 'Missing assessments container');

    const cards = $assessmentsContainer.find('.assessments .card');
    assert.equal(cards.length, 1, 'Missing cards');
  });
});
