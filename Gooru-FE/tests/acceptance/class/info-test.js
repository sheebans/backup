import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';
import { KEY_CODES } from 'gooru-web/config/config';

moduleForAcceptance('Acceptance | class/info', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-info-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Student Layout', function(assert) {
  visit('/class/class-for-pochita-as-student/info');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-student/info');

    const $overviewContainer = find('.controller.class .controller.info');
    T.exists(assert, $overviewContainer, 'Missing overview container');

    const $classInfo = $overviewContainer.find('.class-info');
    T.exists(assert, $classInfo, 'Missing class info section');
    T.exists(assert, $classInfo.find('h3'), 'Missing Class Info Title');
    assert.equal(
      T.text($classInfo.find('h3')),
      'Classroom Information',
      'Incorrect Class Info text'
    );
    T.exists(
      assert,
      $classInfo.find('.info-details'),
      'Missing Class Info details'
    );

    const $classCode = $overviewContainer.find('.code');
    T.exists(assert, $classCode, 'Missing Class Code Box');
    assert.equal(
      T.text($classCode.find('.class-code')),
      'I4BYYQZ',
      'Incorrect Class Code'
    );

    const $teachers = $overviewContainer.find('.teachers-section');
    T.exists(assert, $teachers.find('h5'), 'Missing teachers section');
    T.exists(assert, $teachers.find('.teachers'), 'Missing teachers list');
    T.exists(
      assert,
      $teachers.find('li.profile-card'),
      'Missing profile cards for teachers'
    );
    T.exists(
      assert,
      $teachers.find('div.invite-collaborator.hide'),
      'Invite Collaborator button should be hidden'
    );

    const $students = $overviewContainer.find('.students-section');
    T.exists(assert, $students.find('h5'), 'Missing students section');
    T.exists(assert, $students.find('.students'), 'Missing students list');
    T.exists(
      assert,
      $students.find('li.profile-card'),
      'Missing profile cards for students'
    );
    T.exists(
      assert,
      $students.find('div.invite-student.hide'),
      'Invite Student button should be hidden'
    );

    const $infoButtons = $overviewContainer.find('.info-btns');
    T.exists(
      assert,
      $infoButtons.find('div.edit-actions-section.hide'),
      'Edit and Action buttons should be hidden'
    );
  });
});
test('Teacher Layout', function(assert) {
  visit('/class/class-for-pochita-as-teacher/info');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/info');

    const $overviewContainer = find('.controller.class .controller.info');
    T.exists(assert, $overviewContainer, 'Missing overview container');

    const $teachers = $overviewContainer.find('.teachers-section');
    T.exists(
      assert,
      $teachers.find('div.invite-collaborator.show'),
      'Should be visible'
    );
    T.exists(
      assert,
      $teachers.find('div.invite-collaborator.show button'),
      'Missing invite collaborator button'
    );

    const $students = $overviewContainer.find('.students-section');
    T.exists(
      assert,
      $students.find('div.invite-student.show'),
      'Should be visible'
    );
    T.exists(
      assert,
      $students.find('div.invite-student.show button'),
      'Missing invite student button'
    );

    const $infoButtons = $overviewContainer.find('.info-btns');
    T.exists(
      assert,
      $infoButtons.find('div.edit-actions-section.show'),
      'Edit and Action buttons should be visible'
    );
    T.exists(assert, $infoButtons.find('.edit-btn'), 'Missing Edit Button');
    T.exists(
      assert,
      $infoButtons.find('.info-actions.dropdown'),
      'Missing Info Actions dropdown'
    );
  });
});
test('Remove student', function(assert) {
  visit('/class/class-for-pochita-as-teacher/info');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/info');

    const $infoContainer = find('.controller.class .controller.info');
    const $student = $infoContainer.find(
      '.students-section ul.students li:nth-child(1)'
    );
    const $removeButton = $student.find('.remove');
    click($removeButton);
    andThen(function() {
      var $deleteContentModal = find('.gru-modal .gru-remove-student');
      var $check1 = $deleteContentModal.find('ul li:eq(0) input');
      click($check1);
      andThen(function() {
        var $check2 = $deleteContentModal.find('ul li:eq(1) input');
        click($check2);
        andThen(function() {
          var $check3 = $deleteContentModal.find('ul li:eq(2) input');
          click($check3);
          andThen(function() {
            var $input = $deleteContentModal.find('.delete-input');
            $input.val('delete');
            $input.blur();
            keyEvent($input, 'keyup', KEY_CODES.ENTER);
            andThen(function() {
              var $deleteButton = $deleteContentModal.find('button.delete');
              click($deleteButton);
              andThen(function() {
                assert.equal(
                  T.text($infoContainer.find('.students-section h5')),
                  'Students (6)'
                );
                const $navigation = find(
                  '.controller.class .navigation .gru-class-navigation'
                );
                assert.equal(
                  T.text($navigation.find('.members p')),
                  '6 Students'
                );
              });
            });
          });
        });
      });
    });
  });
});
