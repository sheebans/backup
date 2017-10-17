import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import ClassModel from 'gooru-web/models/content/resource';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

moduleForComponent(
  'cards/gru-teacher-class-card',
  'Integration | Component | cards/gru teacher class card',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
      this.inject.service('api-sdk/course');
    }
  }
);

var mockClass = ClassModel.create({
  id: 'class-id',
  creatorId: 'creator-id',
  title: 'My class - 1',
  description: 'This class is intended to make awareness of good habits',
  greeting: 'Hi! Welcome to my class',
  grade: [4, 5],
  classSharing: 'open',
  coverImage: 'cover.png',
  code: 'VZFMEWH',
  minScore: 75,
  endDate: '2016-12-31',
  courseId: 'course-123',
  collaborator: ['collaborator-1', 'collaborator-2'],
  creatorSystem: null,
  contentVisibility: null,
  isArchived: false,
  isTeacher: function() {
    return true;
  },
  performanceSummary: Ember.Object.create({
    classId: 'class-id',
    id: 'class-id',
    score: 90,
    timeSpent: 344680,
    total: 61,
    totalCompleted: 2
  }),
  course: Ember.Object.create({
    title: 'course-test'
  })
});

var classStudentCount = Ember.Object.create({
  'class-id': 4
});

test('Class Card Layout', function(assert) {
  this.set('class', mockClass);
  this.set('classStudentCount', classStudentCount);

  this.render(
    hbs`{{cards/gru-teacher-class-card class=class course=class.course classStudentCount=classStudentCount}}`
  );

  var $component = this.$(); //component dom element

  const $classCard = $component.find('.gru-teacher-class-card');
  const $panel = $classCard.find('.panel');
  const $panelHeading = $panel.find('.panel-heading');
  const $panelBody = $panel.find('.panel-body');

  T.exists(assert, $classCard, 'Missing teacher class card section');
  T.exists(assert, $panel, 'Missing class card panel');
  T.exists(assert, $panelHeading, 'Missing class card panel heading');
  T.exists(assert, $panelBody, 'Missing class card panel body');
  T.exists(assert, $panelHeading.find('h5'), 'Missing class card title');
  assert.equal(
    T.text($panelHeading.find('h5')),
    'My class - 1',
    'Wrong class title text'
  );

  T.exists(assert, $panelHeading.find('.code'), 'Missing class card code');
  assert.equal(
    T.text($panelHeading.find('.code span')),
    'VZFMEWH',
    'Wrong class code text'
  );

  T.exists(assert, $panelBody.find('.students-info'), 'Missing students info');
  assert.equal(
    T.text($panelBody.find('.students-info span')),
    '4 Students',
    'Wrong class Student Count'
  );

  T.exists(
    assert,
    $panelBody.find('.chart .charts.gru-bubble-chart'),
    'Missing gru-bubble-chart component'
  );
  assert.equal(
    T.text(
      $panelBody.find('.chart .charts.gru-bubble-chart .bubble-circle span')
    ),
    '90%',
    'Wrong performance score of the chart'
  );
  assert.equal(
    T.text($panelBody.find('.chart .legend')),
    this.get('i18n').t('teacher-landing.class.performance').string,
    'Wrong legend of the chart'
  );

  return wait().then(function() {
    T.exists(
      assert,
      $panelBody.find('.course-info'),
      'Missing class course-info'
    );
    T.exists(
      assert,
      $panelBody.find('.course-info .legend'),
      'Missing legend of the course'
    );
    T.exists(
      assert,
      $panelBody.find('.course-info .gru-course-card'),
      'Missing gru-course-card component'
    );
  });
});
