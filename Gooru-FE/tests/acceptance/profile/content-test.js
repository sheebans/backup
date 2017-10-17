import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';
import { KEY_CODES } from 'gooru-web/config/config';

moduleForAcceptance('Acceptance | profile content', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      'token-api3': 'content-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/id-for-pochita/content/');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/');

    const $contentContainer = find('.controller.profile .content');
    T.exists(assert, $contentContainer, 'Missing content container');

    const $contentNavContainer = find(
      '.controller.profile .content .content-navigation'
    );
    T.exists(
      assert,
      $contentNavContainer,
      'Missing content navigator container'
    );

    T.exists(
      assert,
      $contentNavContainer.find('li.courses'),
      'Missing courses link'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.collections'),
      'Missing collections link'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.assessments'),
      'Missing assessments link'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.resources'),
      'Missing resources link'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.questions'),
      'Missing questions link'
    );

    const $addToBtn = $contentNavContainer.find('.btn-group');
    T.exists(assert, $addToBtn, 'Missing add to button group');
  });
});

test('\'Add\' button not present in others profile', function(assert) {
  visit('/param-123/content');
  andThen(function() {
    const $btnGroup = find(
      '.controller.profile .content .content-navigation .btn-group'
    );
    assert.notOk($btnGroup.length, '\'Add\' button present on other\'s profile');
  });
});

test('Navigation links', function(assert) {
  visit('/id-for-pochita/content/');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/');

    const $contentNavContainer = find(
      '.controller.profile .content .content-navigation'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.courses'),
      'Missing courses link'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.collections'),
      'Missing collections link'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.assessments'),
      'Missing assessments link'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.resources'),
      'Missing resources link'
    );
    T.exists(
      assert,
      $contentNavContainer.find('li.questions'),
      'Missing questions link'
    );

    click($contentNavContainer.find('li.courses'));
    andThen(function() {
      assert.equal(currentURL(), '/id-for-pochita/content/courses');
      click($contentNavContainer.find('li.collections'));
      andThen(function() {
        assert.equal(currentURL(), '/id-for-pochita/content/collections');
        click($contentNavContainer.find('li.assessments'));
        andThen(function() {
          assert.equal(currentURL(), '/id-for-pochita/content/assessments');
          click($contentNavContainer.find('li.resources'));
          andThen(function() {
            assert.equal(currentURL(), '/id-for-pochita/content/resources');
            click($contentNavContainer.find('li.questions'));
            andThen(function() {
              assert.equal(currentURL(), '/id-for-pochita/content/questions');
            });
          });
        });
      });
    });
  });
});

test('Navigate to course edit by clicking course title', function(assert) {
  visit('/id-for-pochita/content/courses');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/courses');
    var $courseTitle = find(
      '.gru-collection-card:first-child .title-section a'
    );
    click($courseTitle);
    andThen(function() {
      assert.equal(currentRouteName(), 'content.courses.edit');
    });
  });
});

test('Navigate to course edit by clicking course image', function(assert) {
  visit('/id-for-pochita/content/courses');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/courses');
    var $courseTitle = find('.gru-collection-card:first-child .image a');
    click($courseTitle);
    andThen(function() {
      assert.equal(currentRouteName(), 'content.courses.edit');
    });
  });
});

test('Navigate to collection edit by clicking collection title', function(
  assert
) {
  visit('/id-for-pochita/content/collections');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections');
    var $collectionTitle = find(
      '.gru-collection-card .collection-info .title-section a'
    ).eq(0);
    click($collectionTitle);
    andThen(function() {
      assert.equal(currentRouteName(), 'content.collections.edit');
    });
  });
});

test('Navigate to collection edit by clicking collection image', function(
  assert
) {
  visit('/id-for-pochita/content/collections');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections');
    var $collectionImage = find('.gru-collection-card .image a').eq(0);
    click($collectionImage);
    andThen(function() {
      assert.equal(currentRouteName(), 'content.collections.edit');
    });
  });
});

test('Navigate to question edit by clicking question title', function(assert) {
  visit('/id-for-pochita/content/questions');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/questions');
    var $questionTitle = find(
      '.gru-resource-card:first-of-type .resource-info .title-section h6'
    );
    click($questionTitle);
    andThen(function() {
      assert.equal(currentRouteName(), 'content.questions.edit');
    });
  });
});

test('Navigate to question edit by clicking question image', function(assert) {
  visit('/id-for-pochita/content/questions');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/questions');
    var $questionImage = find('.gru-resource-card:first-of-type  .image a');
    click($questionImage);
    andThen(function() {
      assert.equal(currentRouteName(), 'content.questions.edit');
    });
  });
});

test('Navigate to resource edit by clicking resource title', function(assert) {
  visit('/id-for-pochita/content/resources');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/resources');
    var $resourceTitle = find(
      '.gru-resource-card .resource-info .title-section h6'
    ).eq(0);
    click($resourceTitle);
    andThen(function() {
      assert.equal(currentRouteName(), 'content.resources.edit');
    });
  });
});

test('Navigate to resource edit by clicking resource image', function(assert) {
  visit('/id-for-pochita/content/resources');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/resources');
    var $resourceImage = find('.gru-resource-card .image a').eq(0);
    click($resourceImage);
    andThen(function() {
      assert.equal(currentRouteName(), 'content.resources.edit');
    });
  });
});

test('Search content by term', function(assert) {
  assert.expect(2); //making sure all asserts are called
  visit('/id-for-pochita/content/collections');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections');

    const $searchInput = find('.search-keyword .gru-input input');

    fillIn($searchInput, 'any');
    $searchInput.val('any');
    $searchInput.change();
    keyEvent($searchInput, 'keyup', KEY_CODES.ENTER);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/id-for-pochita/content/collections?term=any'
      );
    });
  });
});

test('Changing term should filter the current result without changing the root url', function(
  assert
) {
  assert.expect(2); //making sure all asserts are called
  visit('/id-for-pochita/content/collections?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections?term=any');

    const $searchInput = find('.search-keyword .gru-input input');

    fillIn($searchInput, 'europe');
    $searchInput.val('europe');
    $searchInput.change();
    keyEvent($searchInput, 'keyup', KEY_CODES.ENTER);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/id-for-pochita/content/collections?term=europe'
      );
    });
  });
});

test('Search content by term and navigate into profile content options', function(
  assert
) {
  assert.expect(5); //making sure all asserts are called
  visit('/id-for-pochita/content/collections');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections');
    const $searchInput = find('.search-keyword .gru-input input');

    fillIn($searchInput, 'any');
    $searchInput.val('any');
    $searchInput.change();
    keyEvent($searchInput, 'keyup', KEY_CODES.ENTER);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/id-for-pochita/content/collections?term=any'
      );
      const $contentNavContainer = find(
        '.controller.profile .content .content-navigation'
      );
      click($contentNavContainer.find('li.assessments'));
      andThen(function() {
        assert.equal(
          currentURL(),
          '/id-for-pochita/content/assessments?term=any'
        );
        click($contentNavContainer.find('li.resources'));
        andThen(function() {
          assert.equal(
            currentURL(),
            '/id-for-pochita/content/resources?term=any'
          );
          click($contentNavContainer.find('li.questions'));
          andThen(function() {
            assert.equal(
              currentURL(),
              '/id-for-pochita/content/questions?term=any'
            );
          });
        });
      });
    });
  });
});

test('Filter content by most recent and descending/Filter content by most recent and ascending', function(
  assert
) {
  assert.expect(3); //making sure all asserts are called
  visit('/id-for-pochita/content/collections?order=desc&sortOn=updated_at');
  andThen(function() {
    assert.equal(
      currentURL(),
      '/id-for-pochita/content/collections?order=desc&sortOn=updated_at'
    );
    const $filterDateButton = find('.filter-date');
    click($filterDateButton);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/id-for-pochita/content/collections?order=asc'
      );
      click($filterDateButton);
      andThen(function() {
        assert.equal(currentURL(), '/id-for-pochita/content/collections');
      });
    });
  });
});

test('Sort by Alphanumeric and ascending/Sort by Alphanumeric and descending', function(
  assert
) {
  assert.expect(3); //making sure all asserts are called
  visit('/id-for-pochita/content/collections?order=desc&sortOn=updated_at');
  andThen(function() {
    assert.equal(
      currentURL(),
      '/id-for-pochita/content/collections?order=desc&sortOn=updated_at'
    );
    const $filterDateButton = find('.filter-date');
    click($filterDateButton);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/id-for-pochita/content/collections?order=asc'
      );
      click($filterDateButton);
      andThen(function() {
        assert.equal(currentURL(), '/id-for-pochita/content/collections');
      });
    });
  });
});

test('Sort by Alphanumeric and navigate into profile content options', function(
  assert
) {
  assert.expect(4); //making sure all asserts are called
  visit('/id-for-pochita/content/collections?order=asc&sortOn=title');
  andThen(function() {
    assert.equal(
      currentURL(),
      '/id-for-pochita/content/collections?order=asc&sortOn=title'
    );
    const $contentNavContainer = find(
      '.controller.profile .content .content-navigation'
    );
    click($contentNavContainer.find('li.assessments'));
    andThen(function() {
      assert.equal(
        currentURL(),
        '/id-for-pochita/content/assessments?order=asc&sortOn=title'
      );
      click($contentNavContainer.find('li.resources'));
      andThen(function() {
        assert.equal(
          currentURL(),
          '/id-for-pochita/content/resources?order=asc&sortOn=title'
        );
        click($contentNavContainer.find('li.questions'));
        andThen(function() {
          assert.equal(
            currentURL(),
            '/id-for-pochita/content/questions?order=asc&sortOn=title'
          );
        });
      });
    });
  });
});

test('Search content by term and clear term', function(assert) {
  assert.expect(3);
  visit('/id-for-pochita/content/collections');
  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections');
    const $searchInput = find('.search-keyword .gru-input input');

    fillIn($searchInput, 'any');
    $searchInput.val('any');
    $searchInput.change();
    keyEvent($searchInput, 'keyup', KEY_CODES.ENTER);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/id-for-pochita/content/collections?term=any'
      );
      const $clearButton = find('span.clear');
      click($clearButton);
      andThen(function() {
        assert.equal(currentURL(), '/id-for-pochita/content/collections?term=');
      });
    });
  });
});
