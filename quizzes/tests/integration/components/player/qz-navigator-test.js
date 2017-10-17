import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'dummy/tests/helpers/assert';
import QuestionResult from 'quizzes-addon/models/result/question';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'player/qz-navigator',
  'Integration | Component | player/qz navigator',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Player Left Navigator: when course map visible', function(assert) {
  const collectionMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90af',
    title: 'Test collection',
    format: 'collection',
    sequence: 1
  });

  const courseMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90ac',
    title: 'Test course'
  });

  const unitMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90au',
    title: 'Test unit',
    sequence: 1
  });

  const lessonMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90al',
    title: 'Test lesson',
    sequence: 1,
    children: Ember.A([collectionMock])
  });

  this.set('course', courseMock);
  this.set('unit', unitMock);
  this.set('lesson', lessonMock);
  this.set('collection', collectionMock);

  this.render(hbs`{{player.qz-navigator collection=collection course=course unit=unit lesson=lesson showBackToCourseMap=true}}`);

  var $component = this.$(); //component dom element
  const $navigator = $component.find('.qz-navigator');
  T.exists(assert, $navigator, 'Missing navigator section');
  T.exists(assert, $navigator.find('.nav-menu-icons .course-map'), 'Missing course map icon');
  T.exists(assert, $navigator.find('.nav-menu-titles .course-map'), 'Missing course map title');
  T.exists(assert, $navigator.find('.nav-menu-icons .course-unit'), 'Missing course map unit icon');
  T.exists(assert, $navigator.find('.nav-menu-titles .course-unit'), 'Missing course map unit title');
  T.exists(assert, $navigator.find('.nav-menu-icons .course-lesson'), 'Missing course map lesson icon');
  T.exists(assert, $navigator.find('.nav-menu-titles .course-lesson'), 'Missing course map lesson title');
  T.exists(assert, $navigator.find('.nav-menu-icons .collection'), 'Missing collection icon');
  T.exists(assert, $navigator.find('.nav-menu-titles .collection'), 'Missing collection title');
});

test('Player Left Navigator: When course map not visible', function(assert) {
  const collectionMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90af',
    title: 'Test collection',
    format: 'collection',
    sequence: 1
  });

  this.set('collection', collectionMock);

  this.render(hbs`{{player.qz-navigator collection=collection }}`);

  var $component = this.$(); //component dom element
  const $navigator = $component.find('.qz-navigator');
  T.exists(assert, $navigator, 'Missing navigator section');
  T.notExists(assert, $navigator.find('.nav-menu-icons .course-map'), 'Should not show course map icon');
  T.notExists(assert, $navigator.find('.nav-menu-titles .course-map'), 'Should not show course map title');
  T.notExists(assert, $navigator.find('.nav-menu-icons .course-unit'), 'Should not show course map unit icon');
  T.notExists(assert, $navigator.find('.nav-menu-titles .course-unit'), 'Should not show course map unit title');
  T.notExists(assert, $navigator.find('.nav-menu-icons .course-lesson'), 'Should not show course map lesson icon');
  T.notExists(assert, $navigator.find('.nav-menu-titles .course-lesson'), 'Should not show course map lesson title');
  T.exists(assert, $navigator.find('.nav-menu-icons .collection'), 'Missing collection icon');
  T.exists(assert, $navigator.find('.nav-menu-titles .collection'), 'Missing collection title');
});


test('Player Left Navigator: When remix button visible', function(assert) {
  const collectionMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90af',
    title: 'Test collection',
    format: 'collection',
    sequence: 1
  });

  this.set('collection', collectionMock);

  this.render(hbs`{{player.qz-navigator collection=collection isTeacher=true}}`);

  var $component = this.$(); //component dom element
  const $navigator = $component.find('.qz-navigator');
  T.exists(assert, $navigator, 'Missing navigator section');
  T.exists(assert, $navigator.find('.nav-menu-icons .remix'), 'Missing remix icon');
  T.exists(assert, $navigator.find('.nav-menu-titles .remix'), 'Missing remix title');
});

test('Player Left Navigator: When back to collection visible', function(assert) {
  const collectionMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90af',
    title: 'Test collection',
    format: 'collection',
    sequence: 1
  });

  this.set('collection', collectionMock);

  this.render(hbs`{{player.qz-navigator collection=collection showBackToCollection=true}}`);

  var $component = this.$(); //component dom element
  const $navigator = $component.find('.qz-navigator');
  T.exists(assert, $navigator, 'Missing navigator section');
  T.exists(assert, $navigator.find('.nav-menu-icons .back-to-collection'), 'Missing back to collection icon');
  T.exists(assert, $navigator.find('.nav-menu-titles .back-to-collection'), 'Missing back to collection title');
});

test('Player Left Navigator: When back button visible', function(assert) {
  const collectionMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90af',
    title: 'Test collection',
    format: 'collection',
    sequence: 1
  });

  this.set('collection', collectionMock);

  this.render(hbs`{{player.qz-navigator collection=collection showBackButton=true}}`);

  var $component = this.$(); //component dom element
  const $navigator = $component.find('.qz-navigator');
  T.exists(assert, $navigator, 'Missing navigator section');
  T.exists(assert, $navigator.find('.nav-menu-icons .back-to-collection'), 'Missing back to collection icon');
  T.exists(assert, $navigator.find('.nav-menu-titles .back-to-collection'), 'Missing back to collection title');
});
