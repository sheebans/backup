import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | Student Home Landing page', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      'token-api3': 'user-token',
      user: {
        gooruUId: 'param-123'
      }
    });
    window.localStorage.setItem('param-123_logins', 1);
  }
});

test('Layout', function(assert) {
  window.localStorage.setItem('param-123_logins', 3);
  visit('/student-home');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');

    T.exists(assert, find('header.gru-header'), 'Header component not found');

    const $userContainer = find('.controller.student-landing');
    T.exists(assert, $userContainer, 'Missing student container');

    const $leftUserContainer = $userContainer.find('.student-left-panel');
    T.exists(
      assert,
      $leftUserContainer.find('.greetings'),
      'Missing student greetings'
    );
    T.exists(
      assert,
      $leftUserContainer.find('.greetings .title'),
      'Missing student name'
    );
    assert.equal(
      $leftUserContainer.find('.greetings .title span').text(),
      'Hello, Student!',
      'Incorrect student name text'
    );
    T.exists(
      assert,
      $leftUserContainer.find('.greetings .featured-courses'),
      'Missing student name'
    );

    const $featuredCourses = $leftUserContainer.find(
      '.student-featured-courses'
    );
    T.exists(assert, $featuredCourses, 'Missing featured courses component');

    const $navigatorContainer = $leftUserContainer.find('.student-navigator');
    T.exists(assert, $navigatorContainer, 'Missing student navigator');
    T.exists(
      assert,
      $navigatorContainer.find('.actions .join-class-cta'),
      'Missing join class button'
    );

    assert.ok(
      $('.active-classes').hasClass('active'),
      'Active classes should be visible'
    );

    const $tabContent = $leftUserContainer.find('.tab-content');
    assert.equal(
      $tabContent.find('.gru-student-class-card').length,
      7,
      'Wrong number of class cards'
    );
  });
});

test('Will disappear next login', function(assert) {
  window.localStorage.setItem('param-123_logins', 5);
  visit('/student-home');

  andThen(function() {
    const $userContainer = find('.controller.student-landing');
    const $leftUserContainer = $userContainer.find('.student-left-panel');
    T.exists(
      assert,
      $leftUserContainer.find('.greetings .featured-courses'),
      'Missing student name'
    );
    const $featuredCourses = $leftUserContainer.find(
      '.student-featured-courses'
    );
    T.exists(assert, $featuredCourses, 'Missing featured courses component');
  });
});

test('Layout without feature courses', function(assert) {
  window.localStorage.setItem('param-123_logins', 6);
  visit('/student-home');

  andThen(function() {
    const $userContainer = find('.controller.student-landing');
    const $leftUserContainer = $userContainer.find('.student-left-panel');
    T.notExists(
      assert,
      $leftUserContainer.find('.greetings .featured-courses'),
      'Missing student name'
    );
    const $featuredCourses = $leftUserContainer.find(
      '.student-featured-courses'
    );
    T.notExists(assert, $featuredCourses, 'Missing featured courses component');
  });
});

test('Go to library from featured-courses panel', function(assert) {
  visit('/student-home');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    const $featuredCourses = find('.featured-courses');

    const $featuredCoursesLink = $featuredCourses.find('a');

    click($featuredCoursesLink);
    andThen(function() {
      assert.equal(currentURL(), '/library', 'Wrong route');
    });
  });
});

test('Take A Tour', function(assert) {
  assert.expect(2);
  visit('/student-home');
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
        'Take a Tour',
        'First step title should be "Take a Tour"'
      );
    });
  });
});

test('Go to course map from class card', function(assert) {
  visit('/student-home');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    const $card = find('.gru-student-class-card:eq(0)  a');
    click($card);
    andThen(function() {
      assert.equal(
        currentURL(),
        '/student/class/class-for-pochita-as-student/course-map?location=first-unit-id%2Bfirst-lesson-id%2Bfirst-assessment-id',
        'Wrong route'
      );
    });
  });
});

test('Valid bubble chart when the class does not has performance', function(
  assert
) {
  visit('/student-home');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    let $chart = find(
      '.gru-student-class-card:eq(1) .gru-bubble-chart .bubble-circle'
    );
    assert.equal(
      $chart.attr('style'),
      'background-color:#949A9F',
      'Incorrect chart color'
    );
    assert.equal($chart.find('span').text(), '--', 'Incorrect score');
  });
});

test('Valid bubble chart when the class has performance', function(assert) {
  visit('/student-home');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    let $chart = find(
      '.gru-student-class-card:eq(0) .gru-bubble-chart .bubble-circle'
    );
    assert.equal(
      $chart.attr('style'),
      'background-color:#F46360',
      'Incorrect chart color'
    );
    assert.equal($chart.find('span').text(), '0%', 'Incorrect score');
  });
});

test('Valid completed chart when the class has started', function(assert) {
  visit('/student-home');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    let $chart = find(
      '.gru-student-class-card:eq(0) .gru-radial-chart .radial-svg .labels'
    );
    assert.equal($chart.text(), '33%', 'Incorrect label');
  });
});

test('Valid completed chart when the class has not started', function(assert) {
  visit('/student-home');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    let $chart = find(
      '.gru-student-class-card:eq(1) .gru-radial-chart .radial-svg .labels'
    );
    assert.equal($chart.text(), '--', 'Incorrect label');
  });
});

test('Class order', function(assert) {
  visit('/student-home');

  andThen(function() {
    assert.equal(currentURL(), '/student-home');
    let $title = find('.gru-student-class-card:eq(0) h5');
    assert.equal(
      $title.text().trim(),
      'First Class Pochita as Student',
      'Incorrect first class'
    );
  });
});
