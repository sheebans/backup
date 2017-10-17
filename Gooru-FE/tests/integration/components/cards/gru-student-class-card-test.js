import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import ClassModel from 'gooru-web/models/content/resource';
import Ember from 'ember';
import { NU_COURSE_VERSION } from 'gooru-web/config/config';

moduleForComponent(
  'cards/gru-student-class-card',
  'Integration | Component | cards/gru student class card',
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
    total: 60,
    totalCompleted: 30
  })
});

test('Class Card Layout', function(assert) {
  this.set('class', mockClass);

  this.render(hbs`{{cards/gru-student-class-card class=class}}`);

  var $component = this.$(); //component dom element

  const $classCard = $component.find('.gru-student-class-card');
  const $panel = $classCard.find('.panel');
  const $panelHeading = $panel.find('.panel-heading');
  const $panelBody = $panel.find('.panel-body');

  T.exists(assert, $classCard, 'Missing student class card section');
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

  T.exists(
    assert,
    $panelBody.find('.charts .charts.gru-bubble-chart'),
    'Missing gru-bubble-chart component'
  );
  assert.equal(
    T.text(
      $panelBody.find('.charts .charts.gru-bubble-chart .bubble-circle span')
    ),
    '90%',
    'Wrong performance score of the chart'
  );
  assert.equal(
    T.text($panelBody.find('.charts .col-md-6:eq(0) span:eq(1)')),
    this.get('i18n').t('student-landing.class.performance').string,
    'Wrong legend of the performance chart'
  );

  T.exists(
    assert,
    $panelBody.find('.charts .charts.gru-radial-chart'),
    'Missing gru-radial-chart component'
  );
  assert.equal(
    T.text($panelBody.find('.charts .charts.gru-radial-chart text')),
    '50%',
    'Wrong completed score of the chart'
  );
  assert.equal(
    T.text($panelBody.find('.charts .col-md-6:eq(1) span:eq(0)')),
    this.get('i18n').t('common.completed').string,
    'Wrong legend of the completed chart'
  );

  T.exists(
    assert,
    $panelBody.find('.information'),
    'Missing class information'
  );
  assert.equal(
    T.text($panelBody.find('.information span:eq(0)')),
    this.get('i18n').t('student-landing.current-activity').string,
    'Wrong legend of the current activity'
  );
  assert.equal(
    T.text($panelBody.find('.information .current-activity')),
    this.get('i18n').t('common.not-applicable').string,
    'Wrong legend of the current activity'
  );
});

test('Student Class Card | NU Course : Completion metrics', function(assert) {
  let classObj = Ember.Object.create({
    isNUCourse: true,
    courseCompetencyCompletion: Ember.Object.create({
      completedCount: 2,
      totalCount: 5
    })
  });
  this.set('courseVersion', NU_COURSE_VERSION);
  this.set('class', classObj);
  this.render(hbs `{{cards/gru-student-class-card class=class}}`);
  var $component = this.$(); //component dom element
  const $classCard = $component.find('.gru-student-class-card');
  const $panel = $classCard.find('.panel');
  const $panelBody = $panel.find('.panel-body');
  assert.equal(T.text($panelBody.find('.charts .charts.gru-radial-chart text')), '40%', 'Wrong completed score of the chart');
});

test('Student Class Card | Non NU Course : Completion metrics', function(assert) {
  let classObj = Ember.Object.create({
    isNUCourse: false,
    performanceSummary: Ember.Object.create({
      totalCompleted: 4,
      total: 5
    })
  });
  this.set('class', classObj);
  this.render(hbs `{{cards/gru-student-class-card class=class}}`);
  var $component = this.$(); //component dom element
  const $classCard = $component.find('.gru-student-class-card');
  const $panel = $classCard.find('.panel');
  const $panelBody = $panel.find('.panel-body');
  assert.equal(T.text($panelBody.find('.charts .charts.gru-radial-chart text')), '80%', 'Wrong completed score of the chart');
});
