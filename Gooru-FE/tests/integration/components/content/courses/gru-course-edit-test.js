import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Course from 'gooru-web/models/content/course';

const courseServiceStub = Ember.Service.extend({
  updateCourse(editedCourse) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!editedCourse) {
        reject({ status: 500 });
      } else {
        resolve(editedCourse);
      }
    });
  }
});

const taxonomyServiceStub = Ember.Service.extend({
  getSubjects(category) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!category) {
        reject({ status: 500 });
      } else {
        resolve({
          subjects: [
            {
              id: 'GDF.K12.CS',
              title: 'Computer Science',
              description: null,
              code: 'GDF.K12.CS',
              standard_framework_id: 'GDF'
            }
          ]
        });
      }
    });
  }
});

moduleForComponent(
  'content/courses/gru-course-edit',
  'Integration | Component | content/courses/gru course edit',
  {
    integration: true,
    beforeEach: function() {
      this.i18n = this.container.lookup('service:i18n');
      this.i18n.set('locale', 'en');

      this.register('service:api-sdk/course', courseServiceStub);
      this.inject.service('api-sdk/course');
      this.register('service:api-sdk/taxonomy', taxonomyServiceStub);
      this.inject.service('api-sdk/taxonomy');
    }
  }
);

test('it has header and main sections', function(assert) {
  assert.expect(10);
  var course = Course.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Course Title',
    subject: 'CCSS.K12.Math',
    category: 'k_12',
    metadata: {},
    useCase: 'Use Case'
  });

  this.set('course', course);
  this.render(hbs`{{content/courses/gru-course-edit course=course}}`);

  var $container = this.$('article.content.courses.gru-course-edit');
  assert.ok($container.length, 'Component');

  const $header = $container.find('> header');
  assert.ok($header.length, 'Header');
  assert.ok($header.find('> .actions').length, 'Header actions');
  assert.equal(
    $header.find('> .actions > button').length,
    5,
    'Number of header actions'
  );
  assert.ok($header.find('> nav').length, 'Header navigation');
  assert.equal(
    $header.find('> nav > a').length,
    3,
    'Number of header navigation links'
  );

  assert.equal(
    $container.find('> section').length,
    3,
    'Number of edit sections'
  );
  assert.ok(
    $container.find('> section#information').length,
    'Information section'
  );
  assert.ok($container.find('> section#builder').length, 'Builder section');
  assert.ok($container.find('> section#settings').length, 'Settings section');
});

test('Layout of the information section', function(assert) {
  assert.expect(8);
  var course = Course.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Course Title',
    subject: 'CCSS.K12.Math',
    category: 'k_12',
    metadata: {},
    useCase: 'Use Case'
  });

  this.set('course', course);
  this.render(hbs`{{content/courses/gru-course-edit course=course}}`);

  var $informationSection = this.$('#information');

  assert.ok($informationSection.find('> .header').length, 'Information Header');
  assert.ok(
    $informationSection.find('> .header h2').length,
    'Information Title'
  );
  assert.ok(
    $informationSection.find('> .header .actions').length,
    'Information actions'
  );

  const $informationContent = $informationSection.find('.content');
  assert.ok($informationContent.length, 'Information section');
  assert.ok($informationContent.find('.title').length, 'Course Title');
  assert.ok(
    $informationContent.find('.description').length,
    'Course description'
  );
  assert.ok(
    $informationContent.find('.gru-taxonomy-selector').length,
    'gru-taxonomy-selector component'
  );
  assert.ok($informationContent.find('.use-case').length, 'Course use-case');
});

/*test('Update Course Information', function (assert) {
  assert.expect(1);
  var newTitle ='Course for testing gooru';
  var newDescription ='Description for testing gooru';
  var course = Course.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    description:""
  });
  this.set('course',course);
  this.render(hbs`{{content/courses/gru-course-edit course=course isEditing=true}}`);

  const $component = this.$('.gru-course-edit');
  const $titleField = $component.find(".gru-input.title");

  $titleField.find("input").val(newTitle);
  $titleField.find("input").trigger('blur');
  const $textDescription = $component.find(".gru-textarea.text");
  $textDescription.find("textarea").val(newDescription);
  $textDescription.find("textarea").change();

  const $save =  $component.find("#information .actions .save");
  $save.click();
  return wait().then(function () {
    assert.equal($component.find(".title label b").text(),newTitle , "The question title should be updated");
    const $textDescription = $component.find(".description textarea");
    $textDescription.blur();
    assert.equal($textDescription.text(),newDescription , "The question title should be updated");
  });
});*/

test('Validate the character limit in the Description field', function(assert) {
  assert.expect(1);
  var course = Course.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    description: '',
    metadata: {},
    useCase: 'Use Case',
    category: 'k_12'
  });
  this.set('course', course);

  this.render(
    hbs`{{content/courses/gru-course-edit isEditing=true course=course tempCourse=course}}`
  );

  const maxLenValue = this.$(
    '.gru-course-edit .gru-textarea.description textarea'
  ).prop('maxlength');
  assert.equal(maxLenValue, 500, 'Input max length');
});

test('Validate the character limit in the Use Case field', function(assert) {
  assert.expect(1);
  var course = Course.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    description: '',
    category: 'k_12',
    metadata: {},
    useCase: ''
  });
  this.set('course', course);

  this.render(
    hbs`{{content/courses/gru-course-edit isEditing=true course=course tempCourse=course}}`
  );

  const maxLenValue = this.$(
    '.gru-course-edit .gru-textarea.useCase textarea'
  ).prop('maxlength');
  assert.equal(maxLenValue, 500, 'Input max length');
});
