import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | student class', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'student-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/student/class/class-for-pochita-as-student');

  andThen(function() {
    assert.equal(currentURL(), '/student/class/class-for-pochita-as-student');

    const $classContainer = find('.student.class');
    T.exists(assert, $classContainer, 'Missing class container');

    const $classHeader = $classContainer.find('.header');
    const $classroomInformation = $classHeader.find('.classroom-information');
    const $courseInfo = $classroomInformation.find('.course-info');
    const $graphics = $classroomInformation.find('.graphics');
    const $students = $classroomInformation.find('.students');

    T.exists(assert, $classHeader, 'Missing class header');
    T.exists(
      assert,
      $classroomInformation,
      'Missing classroom information panel'
    );
    T.exists(assert, $courseInfo, 'Missing course info section');
    T.exists(assert, $graphics, 'Missing graphics section');
    T.exists(assert, $students, 'Missing students section');

    T.exists(
      assert,
      $classHeader.find('.go-back-container .back-to'),
      'Missing back link'
    );
    T.exists(assert, $classHeader.find('h1'), 'Missing class title');
    assert.equal(
      T.text($classHeader.find('h1')),
      'Pochita As Student - With Course',
      'Incorrect class title text'
    );
    T.exists(assert, $classHeader.find('.code'), 'Missing class code');
    assert.equal(
      T.text($classHeader.find('.code')),
      'I4BYYQZ',
      'Incorrect class code text'
    );

    T.exists(
      assert,
      $classroomInformation.find('.panel-heading'),
      'Missing announcements panel-heading'
    );
    T.exists(
      assert,
      $classroomInformation.find('.panel-body'),
      'Missing announcements panel-body'
    );

    T.exists(assert, $courseInfo.find('.legend'), 'Missing course info legend');
    T.exists(
      assert,
      $courseInfo.find('.gru-course-card'),
      'Missing gru-course-card component'
    );

    assert.equal($graphics.find('.graphic').length, 2, 'Number of graphics');
    T.exists(
      assert,
      $graphics.find('.graphic.performance'),
      'Missing performance graphic'
    );
    T.exists(
      assert,
      $graphics.find('.graphic.performance .gru-bubble-chart'),
      'Missing performance gru-bubble-chart component'
    );
    T.exists(
      assert,
      $graphics.find('.graphic.performance .legend'),
      'Missing performance legend'
    );
    T.exists(
      assert,
      $graphics.find('.graphic.completed'),
      'Missing completed graphic'
    );
    T.exists(
      assert,
      $graphics.find('.graphic.completed .gru-radial-chart'),
      'Missing completed gru-radial-chart component'
    );
    T.exists(
      assert,
      $graphics.find('.graphic.completed .legend'),
      'Missing completed legend'
    );

    T.exists(
      assert,
      $students.find('.instructor'),
      'Missing course instructor'
    );
    T.exists(
      assert,
      $students.find('.instructor .legend'),
      'Missing course instructor legend'
    );
    T.exists(
      assert,
      $students.find('.instructor img'),
      'Missing course instructor image'
    );
    T.exists(
      assert,
      $students.find('.instructor .owner'),
      'Missing course instructor name'
    );
    T.exists(assert, $students.find('.members'), 'Missing course members');
    T.exists(
      assert,
      $students.find('.members .legend'),
      'Missing course members legend'
    );

    T.exists(
      assert,
      $classContainer.find('> .gru-class-navigation'),
      'Missing class navigation component'
    );
    T.exists(
      assert,
      $classContainer.find('> .content'),
      'Missing class content'
    );
  });
});

test('Take A Tour', function(assert) {
  assert.expect(2);
  visit('/student/class/class-for-pochita-as-student');
  andThen(function() {
    let $tooltip;
    click('.app-container .gru-take-tour button.start-tour');
    andThen(function() {
      $tooltip = $('div.introjs-tooltip');

      T.exists(
        assert,
        $tooltip,
        'First step of the tour should display a tooltip'
      );
      assert.equal(
        T.text($tooltip.find('.tour-header h2')),
        'Welcome!',
        'First step title should be "Welcome!"'
      );
    });
  });
});

test('Click on back link', function(assert) {
  visit('/student/class/class-for-pochita-as-student');
  andThen(function() {
    assert.equal(currentURL(), '/student/class/class-for-pochita-as-student');

    const $classContainer = find('.student.class');
    const $classHeader = $classContainer.find('.header');

    click($classHeader.find('.go-back-container .back-to'));
    andThen(function() {
      assert.equal(currentURL(), '/student-home');
    });
  });
});

test('Click the toggle button to collapse and expand header', function(assert) {
  assert.expect(2);
  visit('/student/class/class-for-pochita-as-student');
  andThen(function() {
    const $classContainer = find('.student.class');
    const $panels = $classContainer.find('.header .panel');
    const $toggle = $classContainer.find(
      '.gru-class-navigation .extra-buttons a.collapse-expand'
    );

    assert.ok(
      !$panels.css('display') || $panels.css('display') === 'block',
      'The panels should be visible'
    );
    $toggle.click();
    Ember.run.later(
      this,
      () => {
        assert.ok(
          $panels.css('display') === 'none',
          'The panels should be hidden'
        );
      },
      500
    );
  });
});
