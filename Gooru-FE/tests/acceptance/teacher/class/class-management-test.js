import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';
import { KEY_CODES } from 'gooru-web/config/config';

moduleForAcceptance('Acceptance | teacher/class/class-management', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'teacher-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/class-management');
  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/class-management'
    );

    const $container = find(
      '.teacher.class .controller.teacher.class.class-management'
    );
    assert.ok($container.length, 'Missing class management tab container');

    assert.ok($container.find('.class-panel').length, 'Missing class panel');
    assert.ok($container.find('.course-panel').length, 'Missing course panel');

    const $classPanel = $container.find('.class-panel');
    const $classPanelHeader = $classPanel.find('.panel-header');

    assert.ok(
      $classPanelHeader.find('h5').length,
      'Missing class information title'
    );
    assert.ok(
      $classPanelHeader.find('.actions').length,
      'Missing class actions panel'
    );
    assert.ok(
      $classPanelHeader.find('.actions .delete-btn').length,
      'Missing delete btn'
    );
    assert.ok(
      $classPanelHeader.find('.actions .archive-btn').length,
      'Missing archive btn'
    );

    const $classPanelBody = $classPanel.find('.panel-body');
    assert.ok(
      $classPanelBody.find('.class-name p').length,
      'Missing class name label'
    );
    assert.ok(
      $classPanelBody.find('.class-name .edit-text span').length,
      'Missing class title to edit'
    );
    assert.ok(
      $classPanelBody.find('.class-name .edit-text i').length,
      'Missing class title edit icon'
    );

    assert.ok(
      $classPanelBody.find('.class-code p').length,
      'Missing class code label'
    );
    assert.ok(
      $classPanelBody.find('.class-code .gru-copy-value').length,
      'Missing class code copy component'
    );
    assert.ok(
      $classPanelBody.find('.class-code .gru-switch').length,
      'Missing attend class switch component'
    );

    const $coursePanel = $container.find('.course-panel');
    const $coursePanelHeader = $coursePanel.find('.panel-header');

    assert.ok(
      $coursePanelHeader.find('h5').length,
      'Missing course information title'
    );

    const $coursePanelBody = $coursePanel.find('.panel-body');
    assert.ok(
      $coursePanelBody.find('.course-information p').length,
      'Missing course information label'
    );
    assert.ok(
      $coursePanelBody.find('.course-information .gru-course-card.small')
        .length,
      'Missing small course card'
    );
    assert.ok(
      $coursePanelBody.find('.assessment-min-score p').length,
      'Missing course assessment-min-score label'
    );
    assert.ok(
      $coursePanelBody.find('.assessment-min-score .edit-text span').length,
      'Missing assessment min score to edit'
    );
    assert.ok(
      $coursePanelBody.find('.assessment-min-score .edit-text i').length,
      'Missing assessment min score edit icon'
    );

    const $studentsPanel = $container.find('.students-panel');
    assert.ok(
      $studentsPanel.find('.panel-heading').length,
      'Missing student panel heading'
    );
    assert.equal(
      $studentsPanel.find('.panel-heading div').length,
      3,
      'The student panel must have 3 columns'
    );
    assert.ok(
      $studentsPanel.find('.panel-body').length,
      'Missing student panel body'
    );
    assert.equal(
      $studentsPanel.find('.panel-body tr').length,
      7,
      'The students panel must have 7 students'
    );
  });
});

test('If a blank name is saved it is not updated', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/class-management');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/class-management'
    );

    const $container = find(
      '.teacher.class .controller.teacher.class.class-management'
    );
    assert.ok($container.length, 'Missing class management tab container');

    const $classPanel = $container.find('.class-panel');
    const $classPanelBody = $classPanel.find('.panel-body');
    const $editNameIcon = $classPanelBody.find(
      '.class-name .edit-text .edit-icon'
    );

    click($editNameIcon);

    return wait().then(function() {
      const $titleInput = $classPanelBody.find(
        '.class-name .edit-text .gru-input.title input'
      );
      $titleInput.val('');
      $titleInput.blur();
      return wait().then(function() {
        assert.equal(
          T.text($classPanelBody.find('.class-name .edit-text .class-title')),
          'Pochita As Teacher - With Course'
        );
      });
    });
  });
});

test('If a diferent name is saved it is updated', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/class-management');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/class-management'
    );

    const $container = find(
      '.teacher.class .controller.teacher.class.class-management'
    );
    assert.ok($container.length, 'Missing class management tab container');

    const $classPanel = $container.find('.class-panel');
    const $classPanelBody = $classPanel.find('.panel-body');
    var $editNameIcon = $classPanelBody.find(
      '.class-name .edit-text .edit-icon'
    );

    click($editNameIcon);

    return wait().then(function() {
      const $titleInput = $classPanelBody.find(
        '.class-name .edit-text .gru-input.title input'
      );
      $titleInput.val('Teacher Class');
      $titleInput.blur();
      return wait().then(function() {
        assert.equal(
          T.text($classPanelBody.find('.class-name .edit-text .class-title')),
          'Teacher Class'
        );
      });
    });
  });
});

test('Remove class', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/class-management');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/class-management'
    );

    const $container = find(
      '.teacher.class .controller.teacher.class.class-management'
    );
    const $classPanel = $container.find('.class-panel');
    const $classPanelHeader = $classPanel.find('.panel-header');

    const $removeButton = $classPanelHeader.find('.actions .delete-btn');
    click($removeButton);
    andThen(function() {
      var $deleteContentModal = find('.gru-modal .gru-delete-class');
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
                assert.equal(currentURL(), '/teacher-home');
              });
            });
          });
        });
      });
    });
  });
});

test('Delete Student', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/class-management');
  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/class-management'
    );
    let $container = find(
      '.teacher.class .controller.teacher.class.class-management'
    );
    let $studentsPanel = $container.find('.students-panel .panel-body');
    let $delete = $studentsPanel.find(
      'table tbody tr:nth-child(1) .student-actions .delete-btn'
    );
    click($delete);
    andThen(function() {
      let $deleteModal = find('.gru-remove-student');
      var $check1 = $deleteModal.find('ul li:eq(0) input');
      click($check1);
      andThen(function() {
        var $check2 = $deleteModal.find('ul li:eq(1) input');
        click($check2);
        andThen(function() {
          var $check3 = $deleteModal.find('ul li:eq(2) input');
          click($check3);
          andThen(function() {
            var $input = $deleteModal.find('.delete-input');
            $input.val('delete');
            $input.blur();
            keyEvent($input, 'keyup', KEY_CODES.ENTER);
            andThen(function() {
              var $deleteButton = $deleteModal.find('button.delete');
              click($deleteButton);
              andThen(function() {
                assert.equal(
                  $studentsPanel.find('tr').length,
                  6,
                  'The students panel must have 6 students'
                );
              });
            });
          });
        });
      });
    });
  });
});

test('Sort Student by First Name', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/class-management');
  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/class-management'
    );
    let $container = find(
      '.teacher.class .controller.teacher.class.class-management'
    );
    let $studentsHeader = $container.find('.students-panel .panel-heading');
    let $studentsPanel = $container.find('.students-panel .panel-body');
    let $sortByFirstName = $studentsHeader.find('.sortable.first-name');
    click($sortByFirstName);
    andThen(function() {
      assert.equal(
        $studentsPanel.find('tr:first-child td.first-name').text(),
        'Yalu',
        'Incorrect first member'
      );
      assert.equal(
        $studentsPanel.find('tr:last-child td.first-name').text(),
        'Ashish',
        'Incorrect last member'
      );
      click($sortByFirstName);
      andThen(function() {
        assert.equal(
          $studentsPanel.find('tr:first-child td.first-name').text(),
          'Ashish',
          'Incorrect first member'
        );
        assert.equal(
          $studentsPanel.find('tr:last-child td.first-name').text(),
          'Yalu',
          'Incorrect last member'
        );
      });
    });
  });
});

test('Sort Student by Last Name', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/class-management');
  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/class-management'
    );
    let $container = find(
      '.teacher.class .controller.teacher.class.class-management'
    );
    let $studentsHeader = $container.find('.students-panel .panel-heading');
    let $studentsPanel = $container.find('.students-panel .panel-body');
    let $sortByLastName = $studentsHeader.find('.sortable.last-name');
    click($sortByLastName);
    andThen(function() {
      assert.equal(
        $studentsPanel.find('tr:first-child td.last-name').text(),
        'Ashish',
        'Incorrect first member'
      );
      assert.equal(
        $studentsPanel.find('tr:last-child td.last-name').text(),
        'Ye',
        'Incorrect last member'
      );
      click($sortByLastName);
      andThen(function() {
        assert.equal(
          $studentsPanel.find('tr:first-child td.last-name').text(),
          'Ye',
          'Incorrect first member'
        );
        assert.equal(
          $studentsPanel.find('tr:last-child td.last-name').text(),
          'Ashish',
          'Incorrect last member'
        );
      });
    });
  });
});

test('Archive Class', function(assert) {
  visit('/teacher/class/class-for-pochita-as-teacher/class-management');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/teacher/class/class-for-pochita-as-teacher/class-management'
    );

    const $container = find(
      '.teacher.class .controller.teacher.class.class-management'
    );
    const $classPanel = $container.find('.class-panel');
    const $classPanelHeader = $classPanel.find('.panel-header');
    const $archiveButton = $classPanelHeader.find('.actions .archive-btn');
    click($archiveButton);
    andThen(function() {
      const $archiveModal = find('.gru-modal .gru-archive-class');
      let $check1 = $archiveModal.find('ul li:eq(0) input');
      click($check1);
      andThen(function() {
        let $check2 = $archiveModal.find('ul li:eq(1) input');
        click($check2);
        andThen(function() {
          let $check3 = $archiveModal.find('ul li:eq(2) input');
          click($check3);
          andThen(function() {
            let $archiveButton = $archiveModal.find('button.archive');
            click($archiveButton);
            andThen(function() {
              assert.equal(currentURL(), '/teacher-home');
            });
          });
        });
      });
    });
  });
});
