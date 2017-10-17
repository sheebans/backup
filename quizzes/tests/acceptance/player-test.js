import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import T from 'dummy/tests/helpers/assert';

moduleForAcceptance('Acceptance | player');

test('Layout', function(assert) {
  assert.expect(5);
  visit('/player/context-simple-id');

  andThen(function() {
    assert.equal(currentURL(), '/player/context-simple-id');
    const $continue = find('.qz-player-confirmation button.continue');
    click($continue);
    andThen(function() {
      const $playerContainer = find('.component.player');
      T.exists(assert, $playerContainer, 'Missing player');
      T.exists(
        assert,
        $playerContainer.find('.qz-main .qz-navigation'),
        'Missing player navigation'
      );
      T.exists(
        assert,
        $playerContainer.find('.qz-main .qz-viewer'),
        'Missing player viewer'
      );
      T.exists(
        assert,
        $playerContainer.find('.qz-aside .qz-navigator'),
        'Missing player navigator'
      );
    });
  });
});

test('Collection - Navigate', function(assert) {
  assert.expect(3);
  visit('/player/context-simple-id');
  andThen(function() {
    const $continue = find('.qz-player-confirmation button.continue');
    click($continue);
    andThen(function() {
      const $playerContainer = find('.component.player');
      //last visited resource is displayed
      assert.equal(currentURL(), '/player/context-simple-id');
      T.exists(
        assert,
        $playerContainer.find('.qz-viewer .qz-question-viewer .qz-true-false'),
        'Missing single choice question component'
      );
      click($playerContainer.find('.qz-navigator .list-group-item:eq(1)')); // navigating to question
      andThen(function() {
        T.exists(
          assert,
          $playerContainer.find(
            '.qz-viewer .qz-question-viewer .qz-single-choice'
          ),
          'Missing true/false question component'
        );
      });
    });
  });
});

test('selectNavigatorItem & closeNavigator: When moving to another resource the navigator should be closed', function(
  assert
) {
  assert.expect(6);
  visit('/player/context-simple-id');
  andThen(function() {
    const $continue = find('.qz-player-confirmation button.continue');
    click($continue);
    andThen(function() {
      const $playerContainer = find('.component.player');
      const $appContainer = find('.app-container');

      T.exists(assert, $playerContainer, 'Missing player');
      T.exists(assert, $appContainer, 'Missing app container');

      assert.ok(
        !$appContainer.hasClass('navigator-on'),
        'Shouldn\'t have navigator-on class'
      );
      T.exists(
        assert,
        $playerContainer.find('.qz-navigation .navigation-bar span'),
        'Missing navigation hamburger icon'
      );

      click($playerContainer.find('.qz-navigation .navigation-bar span'));

      andThen(function() {
        assert.ok(
          $appContainer.hasClass('navigator-on'),
          'Should have navigator-on class'
        );
        click($playerContainer.find('.qz-navigator .list-group-item:eq(1)'));
        andThen(function() {
          assert.ok(
            !$appContainer.hasClass('navigator-on'),
            'Shouldn\'t have navigator-on class'
          );
        });
      });
    });
  });
});

test('openNavigator & closeNavigator: When opening and closing the navigator', function(
  assert
) {
  assert.expect(6);
  visit('/player/context-simple-id');
  andThen(function() {
    const $continue = find('.qz-player-confirmation button.continue');
    click($continue);
    andThen(function() {
      const $appContainer = find('.app-container'),
        $playerContainer = find('.component.player');
      T.exists(assert, $appContainer, 'Missing app container');
      assert.ok(
        !$appContainer.hasClass('navigation-on'),
        'Shouldn\'t have navigator-on class'
      );
      T.exists(assert, $playerContainer, 'Missing player');

      //open navigator
      T.exists(
        assert,
        $playerContainer.find('.qz-navigation .navigation-bar span'),
        'Missing navigation hamburger icon'
      );
      click($playerContainer.find('.qz-navigation .navigation-bar span'));
      andThen(function() {
        assert.ok(
          $appContainer.hasClass('navigator-on'),
          'Should have navigator-on class'
        );

        //close navigator
        click($playerContainer.find('.qz-navigator .hamburger-icon'));
        andThen(function() {
          assert.ok(
            !$appContainer.hasClass('navigator-on'),
            'Shouldn\'t have navigator-on class'
          );
        });
      });
    });
  });
});
