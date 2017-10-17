import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import T from 'gooru-web/tests/helpers/assert';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | search/assessments', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'assessments-token',
      user: {
        gooruUId: 'assessments-token-user-id'
      }
    });
  }
});

test('Layout', function(assert) {
  assert.expect(4); //making sure all asserts are called
  visit('/search/assessments?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/assessments?term=any');
    T.exists(
      assert,
      find('.gru-taxonomy-tag-list'),
      'Missing gru-taxonomy-tag-list'
    );
    T.exists(assert, find('.collection-results'), 'Missing collection-results');
    assert.equal(
      find('.gru-header .search-input').val(),
      'any',
      'Wrong input value'
    );
  });
});

test('Clicking card title should open the player', function(assert) {
  assert.expect(2); //making sure all asserts are called
  visit('/search/assessments?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/assessments?term=any');
    const $searchResults = find('.collection-results .results');
    const $firstResult = $searchResults.find('.gru-collection-card:eq(0)');
    const $cardHeader = $firstResult.find('.panel .panel-heading');
    const $cardTitle = $cardHeader.find(
      '.collection-info .title-section .play-content'
    );
    click($cardTitle);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/player/all-question-types-assessment-id?resourceId=image-resource-id&role=student&type=assessment'
      );
    });
  });
});

test('Clicking card image should open the player', function(assert) {
  assert.expect(2); //making sure all asserts are called
  visit('/search/assessments?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/assessments?term=any');
    const $searchResults = find('.collection-results .results');
    const $firstResult = $searchResults.find('.gru-collection-card:eq(0)');
    const $cardHeader = $firstResult.find('.panel .panel-heading');
    const $cardImage = $cardHeader.find('.image .play-content');
    click($cardImage);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/player/all-question-types-assessment-id?resourceId=image-resource-id&role=student&type=assessment'
      );
    });
  });
});

test('Changing term should filter the current result without changing the root url', function(
  assert
) {
  assert.expect(2); //making sure all asserts are called
  visit('/search/assessments?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/assessments?term=any');

    const $appHeader = find('.gru-header');
    const $searchInput = find('.gru-header .search-input');

    fillIn($searchInput, 'europe');
    $searchInput.val('europe');
    $searchInput.change();
    $appHeader.find('form').submit();
    andThen(function() {
      assert.equal(currentURL(), '/search/assessments?term=europe');
    });
  });
});

test('Apply taxonomy filter', function(assert) {
  visit(
    '/search/assessments?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/search/assessments?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any'
    );

    assert.equal(
      find('.gru-taxonomy-tag-list .gru-taxonomy-tag').length,
      2,
      'Number of tags rendered'
    );
  });
});

test('Apply taxonomy filter - Removing taxonomy tag', function(assert) {
  visit(
    '/search/assessments?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/search/assessments?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any'
    );

    const $taxonomyTags = find('.gru-taxonomy-tag-list .gru-taxonomy-tag');

    assert.equal($taxonomyTags.length, 2, 'Number of tags rendered');

    $taxonomyTags
      .eq(0)
      .find('button.remove')
      .click();

    andThen(function() {
      const $taxonomyTags = find('.gru-taxonomy-tag-list .gru-taxonomy-tag');

      assert.equal($taxonomyTags.length, 1, 'One tag should be removed');
    });
  });
});
