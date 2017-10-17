import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
import { registerQuizzesServices } from 'gooru-web/tests/helpers/quizzes';

// Stub performance service

moduleForComponent(
  'class/analytics/performance/student/gru-lesson-performance',
  'Integration | Component | class/analytics/performance/student/gru lesson performance',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      registerQuizzesServices(this);
    }
  }
);

test('Test for started lesson performance', function(assert) {
  const lesson = Ember.Object.create({
    id: '333-555-777',
    title: 'Quiz :: Indian History',
    type: 'lesson',
    score: 75,
    completionDone: 0,
    completionTotal: 1,
    timeSpent: 4852359,
    ratingScore: 0,
    isCompleted: true,
    hasStarted: true,
    isUnitOrLesson: true,
    collections: Ember.A([
      Ember.Object.create({
        id: 'all-question-types-assessment-id',
        title: 'Indian History Collection',
        type: 'collection',
        score: 75,
        completionDone: 1,
        completionTotal: 1,
        timeSpent: 4852359,
        ratingScore: 0,
        isCompleted: true,
        isCollection: true,
        hasStarted: true,
        isCollectionOrAssessment: true
      }),
      Ember.Object.create({
        id: 'all-question-types-assessment-id',
        title: 'Indian History Assessment',
        type: 'assessment',
        score: 75,
        completionDone: 0,
        completionTotal: 1,
        timeSpent: 442359,
        ratingScore: 0,
        isCompleted: false,
        isAssessment: true,
        isCollectionOrAssessment: true
      })
    ])
  });
  this.set('lesson', lesson);
  this.set('index', 0);
  this.set('selectedLessonId', 'not-my-id');
  this.set('onSelectLesson', function() {
    assert.ok(true, 'This should be called 1 time');
  });
  assert.expect(12);
  this.render(hbs`{{class.analytics.performance.student.gru-lesson-performance
    lesson=lesson
    localIndex=index
    index=index
    onSelectLesson=onSelectLesson
    selectedLessonId=selectedLessonId
  }}`);
  const $component = this.$();

  T.exists(assert, $component, 'Missing Lesson Container');

  const $lessonTitle = $component.find(
    '.lesson-performance-content .title .section-title'
  );

  assert.ok($lessonTitle.length, 'Missing title');

  const $clickableAnchor = $component.find(
    '.gru-lesson-performance-container a'
  ); //component dom element
  T.exists(assert, $clickableAnchor, 'Missing Clickable Anchor');

  Ember.run(() => {
    $clickableAnchor.click();
  });

  return wait().then(function() {
    const $collectionsContainer = $component.find('.collections-container');
    assert.equal(
      $collectionsContainer.hasClass('in'),
      true,
      'Collections container did not open'
    );

    const $firstCollection = $component.find(
      'div.collections-container ul:first-child'
    );
    T.exists(assert, $firstCollection, 'Missing First collection');

    const $collectionTitle = $component.find(
      '.collections-container ul .collection-performance-content .title .section-title'
    );
    T.exists(assert, $collectionTitle, 'Missing collection Title');
    assert.ok($collectionTitle.length, 'Missin title');

    const $collectionRedoButton = $component.find(
      '.collections-container ul:nth-child(1) .collection-performance-content .title button.collection-redo-button'
    );
    T.exists(assert, $collectionRedoButton, 'Missing collection redo button');
    assert.equal(
      $collectionRedoButton.hasClass('collection-redo-button'),
      true,
      'Redo class from button missing'
    );

    const $collectionViewReportButton = $component.find(
      '.collections-container ul:nth-child(1) .collection-performance-content .title button.collection-view-report-button'
    );
    T.exists(
      assert,
      $collectionViewReportButton,
      'Missing collection view report button'
    );
    assert.equal(
      $collectionViewReportButton.hasClass('collection-view-report-button'),
      true,
      'View report class from second button missing'
    );
  });
});

test('Test no show score for lesson performance', function(assert) {
  const lesson = Ember.Object.create({
    id: '333-555-777',
    title: 'Quiz :: Indian History',
    type: 'lesson',
    score: 75,
    completionDone: 0,
    completionTotal: 1,
    timeSpent: 4852359,
    ratingScore: 0,
    isCompleted: true,
    hasStarted: true,
    isUnitOrLesson: true,
    collections: Ember.A([
      Ember.Object.create({
        id: 'all-question-types-assessment-id',
        title: 'Indian History Collection',
        type: 'collection',
        score: 75,
        completionDone: 1,
        completionTotal: 1,
        timeSpent: 4852359,
        ratingScore: 0,
        isCompleted: true,
        isCollection: true,
        hasStarted: true,
        isCollectionOrAssessment: true,
        model: {
          hasNonOpenEndedQuestions: true
        }
      }),
      Ember.Object.create({
        id: 'all-question-types-assessment-id',
        title: 'Indian History Collection',
        type: 'collection',
        score: 75,
        completionDone: 1,
        completionTotal: 1,
        timeSpent: 4852359,
        ratingScore: 0,
        isCompleted: true,
        isCollection: true,
        hasStarted: true,
        isCollectionOrAssessment: true,
        model: {
          hasNonOpenEndedQuestions: false
        }
      }),
      Ember.Object.create({
        id: 'all-question-types-assessment-id',
        title: 'Indian History Assessment',
        type: 'assessment',
        score: 75,
        completionDone: 0,
        completionTotal: 1,
        timeSpent: 442359,
        ratingScore: 0,
        isCompleted: false,
        isAssessment: true,
        isCollectionOrAssessment: true,
        model: {
          hasNonOpenEndedQuestions: true
        }
      })
    ])
  });
  this.set('lesson', lesson);
  this.set('index', 0);
  this.set('selectedLessonId', 'not-my-id');
  this.set('onSelectLesson', function() {
    assert.ok(true, 'This should be called 1 time');
  });
  assert.expect(9);
  this.render(hbs`{{class.analytics.performance.student.gru-lesson-performance
    lesson=lesson
    localIndex=index
    index=index
    onSelectLesson=onSelectLesson
    selectedLessonId=selectedLessonId
    selectedFilterBy='collection'
  }}`);
  const $component = this.$();

  T.exists(assert, $component, 'Missing Lesson Container');
  const $lessonTitle = $component.find(
    '.lesson-performance-content .title .section-title'
  );
  assert.ok($lessonTitle.length, 'Missing title');

  assert.ok(
    !$component.find('.gru-performance-summary .score .score-box').lenght,
    'Score should not be visible when filtering by collection'
  );

  const $clickableAnchor = $component.find(
    '.gru-lesson-performance-container a'
  ); //component dom element
  T.exists(assert, $clickableAnchor, 'Missing Clickable Anchor');

  Ember.run(() => {
    $clickableAnchor.click();
  });

  return wait().then(function() {
    const $collectionsContainer = $component.find('.collections-container');
    assert.equal(
      $collectionsContainer.hasClass('in'),
      true,
      'Collections container did not open'
    );
    assert.ok(
      $collectionsContainer.find(
        '.gru-performance-summary:eq(0) .score .score-box'
      ).length,
      'First collection should display score, it has non open ended questions'
    );
    assert.ok(
      !$collectionsContainer.find(
        '.gru-performance-summary:eq(1) .score .score-box'
      ).length,
      'Second collection should not display score, it has only open ended questions'
    );
    assert.ok(
      $collectionsContainer.find(
        '.gru-performance-summary:eq(2) .score .score-box'
      ).length,
      'Third collection should display score, it has non open ended questions'
    );
  });
});

test('Test for not started lesson performance', function(assert) {
  const lesson = Ember.Object.create({
    id: '333-555-777',
    title: 'Quiz :: Indian History',
    type: 'lesson',
    isUnitOrLesson: true,
    score: 75,
    completionDone: 0,
    completionTotal: 1,
    timeSpent: 4852359,
    ratingScore: 0,
    hasStarted: false,
    collections: Ember.A([
      Ember.Object.create({
        id: 'all-question-types-assessment-id',
        title: 'First Collection',
        type: 'collection',
        score: 75,
        completionDone: 0,
        completionTotal: 1,
        timeSpent: 4852359,
        ratingScore: 0,
        isCompleted: false,
        isCollection: true,
        hasStarted: true,
        isCollectionOrAssessment: true
      }),
      Ember.Object.create({
        id: 'all-question-types-assessment-id',
        title: 'First Assessment',
        type: 'assessment',
        score: 75,
        completionDone: 5,
        completionTotal: 5,
        timeSpent: 442359,
        ratingScore: 0,
        isCompleted: true,
        hasStarted: false,
        isAssessment: true,
        isCollectionOrAssessment: true
      }),
      Ember.Object.create({
        id: 'all-question-types-assessment-id',
        title: 'Second Assessment',
        type: 'assessment',
        score: 75,
        completionDone: 0,
        completionTotal: 1,
        timeSpent: 0,
        ratingScore: 0,
        isCompleted: true,
        hasStarted: false,
        isAssessment: true,
        isCollectionOrAssessment: true
      })
    ])
  });

  this.set('lesson', lesson);
  this.set('index', 0);
  this.set('selectedLessonId', 'not-my-id');
  this.set('onSelectLesson', function() {
    assert.ok(true, 'This should be called 1 time');
  });

  assert.expect(9);

  this.render(hbs`{{class.analytics.performance.student.gru-lesson-performance
    lesson=lesson
    localIndex=index
    index=index
    selectedLessonId=selectedLessonId
    onSelectLesson=onSelectLesson
  }}`);
  const $component = this.$();

  T.exists(assert, $component, 'Missing Lesson Container');

  const $lessonTitle = $component.find(
    '.lesson-performance-content .title .section-title'
  );

  assert.ok($lessonTitle.length, 'Missing title');

  const $clickableAnchor = $component.find(
    '.gru-lesson-performance-container a'
  ); //component dom element
  T.exists(assert, $clickableAnchor, 'Missing Clickable Anchor');

  const $arrowRightIcon = $component.find(
    '.lesson-performance-content .title i.keyboard_arrow_right'
  );
  T.exists(assert, $arrowRightIcon, 'Missing arrow right icon');

  Ember.run(() => {
    $clickableAnchor.click();
  });

  return wait().then(function() {
    //TODO: issue here assert.ok($arrowRightIcon.hasClass("keyboard_arrow_down"), "Missing arrow down icon");

    const $firstAssessment = $component.find(
      'div.collections-container>ul>li:nth-child(2)'
    );
    const $collectionTitle = $firstAssessment.find('.title .section-title');
    T.exists(assert, $firstAssessment, 'Missing Second collection');
    T.exists(assert, $collectionTitle, 'Missing collection Title');
    assert.equal(
      $collectionTitle.text().trim(),
      'First Assessment',
      'Wrong title'
    );

    const $firstCollection = $component.find(
      'div.collections-container ul:nth-child(1)'
    );
    const $collectionStudyButton = $firstCollection.find(
      'button.collection-study-button'
    );
    T.exists(assert, $collectionStudyButton, 'Missing collection study button');
  });
});
test('Test lesson performance with no collections', function(assert) {
  const lesson = Ember.Object.create({
    id: '333-555-777',
    title: 'Quiz :: Indian History',
    type: 'lesson',
    score: 75,
    completionDone: 0,
    completionTotal: 1,
    timeSpent: 4852359,
    ratingScore: 0,
    hasStarted: false,
    collections: Ember.A()
  });

  this.set('lesson', lesson);
  this.set('index', 0);
  this.set('selectedLessonId', 'not-my-id');
  this.set('onSelectLesson', function() {
    assert.ok(true, 'This should be called 1 time each click');
  });

  assert.expect(6);
  this.render(hbs`{{class.analytics.performance.student.gru-lesson-performance
    lesson=lesson
    localIndex=index
    index=index
    selectedLessonId=selectedLessonId
    onSelectLesson=onSelectLesson
  }}`);
  const $component = this.$();

  T.exists(assert, $component, 'Missing Lesson Container');

  const $clickableAnchor = $component.find(
    '.gru-lesson-performance-container a'
  ); //component dom element
  T.exists(assert, $clickableAnchor, 'Missing Clickable Anchor');

  Ember.run(() => {
    $clickableAnchor.click();
  });

  return wait().then(function() {
    const $collectionsContainer = $component.find('.collections-container');
    assert.equal(
      $collectionsContainer.hasClass('in'),
      true,
      'Collections container did not open'
    );

    const $collectionNoContentSpan = $component.find(
      '.collections-container span'
    );

    T.exists(
      assert,
      $collectionNoContentSpan,
      'Missing no content message span'
    );
    assert.equal(
      T.text($collectionNoContentSpan),
      'No content available',
      'Wrong no content message'
    );
  });
});
