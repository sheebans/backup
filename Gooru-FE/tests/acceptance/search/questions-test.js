import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import T from 'gooru-web/tests/helpers/assert';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | search/questions', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'questions-token',
      user: {
        gooruUId: 'questions-token-user-id'
      }
    });
  }
});

test('Layout', function(assert) {
  assert.expect(5); //making sure all asserts are called
  visit('/search/questions?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/questions?term=any');
    T.exists(
      assert,
      find('.gru-question-options'),
      'Missing gru-question-options menu'
    );
    T.exists(
      assert,
      find('.gru-taxonomy-tag-list'),
      'Missing gru-taxonomy-tag-list'
    );
    T.exists(
      assert,
      find('.gru-resource-results'),
      'Missing gru-resource-results'
    );
    assert.equal(
      find('.gru-header .search-input').val(),
      'any',
      'Wrong input value'
    );
  });
});

test('Apply filters', function(assert) {
  assert.expect(5); //making sure all asserts are called
  visit('/search/questions?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/questions?term=any');
    T.exists(
      assert,
      find('.gru-question-options'),
      'Missing gru-question-options menu'
    );
    T.exists(
      assert,
      find('.gru-resource-results'),
      'Missing gru-resource-results'
    );
    assert.equal(
      find('.gru-header .search-input').val(),
      'any',
      'Wrong input value'
    );

    click(find('.gru-question-options .multiple-choice'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/search/questions?selectedOptionTypes=%5B%22MC%22%5D&term=any'
      );
    });
  });
});

test('Changing term should filter the current result without changing the root url', function(
  assert
) {
  assert.expect(2); //making sure all asserts are called
  visit('/search/questions?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/questions?term=any');

    const $appHeader = find('.gru-header');
    const $searchInput = find('.gru-header .search-input');

    fillIn($searchInput, 'europe');
    $searchInput.val('europe');
    $searchInput.change();
    $appHeader.find('form').submit();
    andThen(function() {
      assert.equal(currentURL(), '/search/questions?term=europe');
    });
  });
});

test('Apply taxonomy filter', function(assert) {
  visit(
    '/search/questions?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/search/questions?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any'
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
    '/search/questions?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      '/search/questions?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any'
    );

    const $taxonomyTags = find('.gru-taxonomy-tag-list .gru-taxonomy-tag');

    assert.equal($taxonomyTags.length, 2, 'Number of tags rendered');

    $taxonomyTags.eq(0).find('button.remove').click();

    andThen(function() {
      const $taxonomyTags = find('.gru-taxonomy-tag-list .gru-taxonomy-tag');

      assert.equal($taxonomyTags.length, 1, 'One tag should be removed');
    });
  });
});
