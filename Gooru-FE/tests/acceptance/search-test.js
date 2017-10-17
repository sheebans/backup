import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | Search page', {
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
  visit('/search');

  andThen(function() {
    assert.equal(currentURL(), '/search');

    assert.ok(find('header.gru-header').length, 'Header component not found');

    const $searchContainer = find('.controller.search');
    assert.ok($searchContainer.length, 'Missing search container');

    const $categoryOptions = $searchContainer.find('.category-options');
    assert.ok($categoryOptions.length, 'Missing category options');

    assert.ok(
      $categoryOptions.find('.courses').length,
      'Missing Courses category'
    );
    assert.ok(
      $categoryOptions.find('.collections').length,
      'Missing Collections category'
    );
    assert.ok(
      $categoryOptions.find('.assessments').length,
      'Missing Assessments category'
    );
    assert.ok(
      $categoryOptions.find('.resources').length,
      'Missing Resources category'
    );
    assert.ok(
      $categoryOptions.find('.rubrics').length,
      'Missing Rubrics category'
    );
  });
});
