import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | Manage Goals page', {
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
  visit('/goals/manage');

  andThen(function() {
    assert.equal(currentURL(), '/goals/manage');

    T.exists(assert, find('header.gru-header'), 'Header component not found');

    const $userContainer = find('.controller.manage-goals');
    T.exists(assert, $userContainer, 'Missing manage goals container');

    T.exists(assert, $userContainer.find('.greetings'), 'Missing title');

    const $goalsNavigator = $userContainer.find('.goals-navigator');
    T.exists(assert, $goalsNavigator, 'Missing navigator');
    T.exists(
      assert,
      $goalsNavigator.find('.add-goal'),
      'Missing Add Goal button'
    );

    const $goalsList = $userContainer.find('.list-goals');
    T.exists(assert, $goalsList, 'Missing list of goals');

    const cards = $goalsList.find('.gru-goal-card');
    assert.equal(cards.length, 2, 'Missing cards');

    click($goalsNavigator.find('.add-goal'));
    andThen(function() {
      const $goalsContainer = $userContainer.find('.form-goal-container');
      T.exists(assert, $goalsContainer, 'Missing form goal container');

      const $formComponent = $goalsContainer.find('.gru-goal-form');
      T.exists(assert, $formComponent, 'Missing create goal form component');
    });
  });
});

test('It shows an error message if the Goal field is left blank', function(
  assert
) {
  visit('/goals/manage');

  andThen(function() {
    assert.equal(currentURL(), '/goals/manage');

    const $userContainer = find('.controller.manage-goals');
    const $goalsNavigator = $userContainer.find('.goals-navigator');

    click($goalsNavigator.find('.add-goal'));
    andThen(function() {
      const $goalsContainer = $userContainer.find('.form-goal-container');
      const $goalFormContainer = $goalsContainer.find('.gru-goal-form');

      const $panel = $goalFormContainer.find('.panel-form');
      const $form = $panel.find('#createGoalForm');
      const $titleField = $form.find('.form-group.title');

      //invalid
      $titleField.find('input').val('');
      $titleField.find('input').blur();

      return wait().then(function() {
        assert.ok(
          $titleField.find('.error-messages .error').length,
          'Title error message is visible'
        );
        assert.equal(
          T.text($titleField.find('.error-messages .error')),
          'Please enter the Goal',
          'Title error message is correct'
        );

        //valid
        $titleField.find('input').val('Title test');
        $titleField.find('input').blur();
        return wait().then(function() {
          T.notExists(
            assert,
            $titleField.find('.error-messages span.error'),
            'Error message for title should not be visible'
          );
        });
      });
    });
  });
});

test('It shows an error message if the Start Date field is left blank', function(
  assert
) {
  visit('/goals/manage');

  andThen(function() {
    assert.equal(currentURL(), '/goals/manage');

    const $userContainer = find('.controller.manage-goals');
    const $goalsNavigator = $userContainer.find('.goals-navigator');

    click($goalsNavigator.find('.add-goal'));
    andThen(function() {
      const $goalsContainer = $userContainer.find('.form-goal-container');
      const $goalFormContainer = $goalsContainer.find('.gru-goal-form');

      const $panel = $goalFormContainer.find('.panel-form');
      const $form = $panel.find('#createGoalForm');
      const $startDateField = $form.find('.form-group.start-date');

      //invalid
      click($form.find('.create-goal'));
      andThen(function() {
        assert.ok(
          $startDateField.find('.error-messages .error').length,
          'Start Date error message is visible'
        );
        assert.equal(
          T.text($startDateField.find('.error-messages .error')),
          'Please enter the Start Date',
          'Start Date error message is correct'
        );
      });
    });
  });
});

test('It shows an error message if the End Date field is left blank', function(
  assert
) {
  visit('/goals/manage');

  andThen(function() {
    assert.equal(currentURL(), '/goals/manage');

    const $userContainer = find('.controller.manage-goals');
    const $goalsNavigator = $userContainer.find('.goals-navigator');

    click($goalsNavigator.find('.add-goal'));
    andThen(function() {
      const $goalsContainer = $userContainer.find('.form-goal-container');
      const $goalFormContainer = $goalsContainer.find('.gru-goal-form');

      const $panel = $goalFormContainer.find('.panel-form');
      const $form = $panel.find('#createGoalForm');
      const $endDateField = $form.find('.form-group.end-date');

      //invalid
      click($form.find('.create-goal'));
      andThen(function() {
        assert.ok(
          $endDateField.find('.error-messages .error').length,
          'End Date error message is visible'
        );
        assert.equal(
          T.text($endDateField.find('.error-messages .error')),
          'Please enter the End Date',
          'Start Date error message is correct'
        );
      });
    });
  });
});

test('It shows an error message if the Start Date is greater than End Date', function(
  assert
) {
  visit('/goals/manage');

  andThen(function() {
    assert.equal(currentURL(), '/goals/manage');

    const $userContainer = find('.controller.manage-goals');
    const $goalsNavigator = $userContainer.find('.goals-navigator');

    click($goalsNavigator.find('.add-goal'));
    andThen(function() {
      const $goalsContainer = $userContainer.find('.form-goal-container');
      const $goalFormContainer = $goalsContainer.find('.gru-goal-form');

      const $panel = $goalFormContainer.find('.panel-form');
      const $form = $panel.find('#createGoalForm');
      const $startDateField = $form.find('.form-group.start-date');
      const $endDateField = $form.find('.form-group.end-date');

      $startDateField.find('input.datepicker').val('02/15/2017');
      $endDateField.find('input.datepicker').val('02/01/2017');

      click($form.find('.create-goal'));
      andThen(function() {
        assert.ok(
          $startDateField.find('.error-messages .error').length,
          'Error message of wrong order is visible'
        );
      });
    });
  });
});

test('It shows an error message if the Status field is not selected', function(
  assert
) {
  visit('/goals/manage');

  andThen(function() {
    assert.equal(currentURL(), '/goals/manage');

    const $userContainer = find('.controller.manage-goals');
    const $goalsNavigator = $userContainer.find('.goals-navigator');

    click($goalsNavigator.find('.add-goal'));
    andThen(function() {
      const $goalsContainer = $userContainer.find('.form-goal-container');
      const $goalFormContainer = $goalsContainer.find('.gru-goal-form');

      const $panel = $goalFormContainer.find('.panel-form');
      const $form = $panel.find('#createGoalForm');
      const $statusField = $form.find('.form-group.status');

      //invalid
      click($form.find('.create-goal'));
      andThen(function() {
        assert.ok(
          $statusField.find('.error-messages .error').length,
          'Status error message is visible'
        );
        assert.equal(
          T.text($statusField.find('.error-messages .error')),
          'Please select the Goal Status',
          'Status error message is correct'
        );

        //valid
        $statusField.find('.selectpicker').val('completed').change();
        click($form.find('.create-goal'));
        andThen(function() {
          T.notExists(
            assert,
            $statusField.find('.error-messages span.error'),
            'Error message for status should not be visible'
          );
        });
      });
    });
  });
});
