import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | class/edit', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-edit-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Teacher Layout', function(assert) {
  visit('/class/class-for-pochita-as-teacher/edit');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/edit');

    const $editContainer = find('.controller.class .controller.edit');
    T.exists(assert, $editContainer, 'Missing edit container');

    const $editDescription = $editContainer.find('.class-edit h3');
    T.exists(assert, $editDescription, 'Edit Description should be visible');

    const $editButtons = $editContainer.find('.edit-btns');
    T.exists(
      assert,
      $editButtons.find('div.edit-save-section.show'),
      'Cancel and Save buttons should be visible'
    );
    T.exists(assert, $editButtons.find('.cancel'), 'Missing Cancel Link');
    T.exists(assert, $editButtons.find('.save-btn'), 'Missing Save Button');

    const $editPanel = $editContainer.find('.basic-info .panel');
    T.exists(assert, $editPanel.find('.gru-input.title'), 'Missing name field');
    T.exists(
      assert,
      $editPanel.find('.gru-textarea.greeting'),
      'Missing greeting textarea'
    );

    const $courseMapPanel = $editContainer.find('.course-map .panel');
    T.exists(
      assert,
      $courseMapPanel.find('.gru-input-number.minScore'),
      'Missing min score field'
    );
    T.exists(
      assert,
      $courseMapPanel.find('.gru-course-card'),
      'Missing course card'
    );
  });
});

test('it shows an error message if the name field is left blank', function(
  assert
) {
  visit('/class/class-for-pochita-as-teacher/edit');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/edit');

    const $editContainer = find('.controller.class .controller.edit');
    const $editPanel = $editContainer.find('.panel');

    const $titleField = $editPanel.find('.gru-input.title');

    assert.ok(
      !$titleField.find('.error-messages .error').length,
      'Title error message not visible'
    );

    $titleField.find('input').val(' ');
    $titleField.find('input').blur();

    // Try submitting without filling in data
    var $saveBtn = $editContainer.find('button.save-btn');

    click($saveBtn);

    return wait().then(function() {
      assert.ok(
        $titleField.find('.error-messages .error').length,
        'Title error message visible'
      );
      // Fill in the input field
      $titleField.find('input').val('Title');
      $titleField.find('input').blur();

      return wait().then(function() {
        assert.ok(
          !$titleField.find('.error-messages .error').length,
          'Title error message was hidden'
        );
      });
    });
  });
});
