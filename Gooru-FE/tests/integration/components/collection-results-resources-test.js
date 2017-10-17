import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'collection-results-resources',
  'Integration | Component | collection results resources',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('collection results resources layout', function(assert) {
  var resources = Ember.A();
  resources.addObject(
    Ember.Object.create({
      name: 'Preparing the Learner',
      image:
        'http://cdn.goorulearning.org/prod1/f000/2137/8066/b9396c20-90f6-4bc1-b434-a39386f5e7b3_0480a001-2070-40b9-b211-ef67638a33d0.jpg',
      type: 'text'
    })
  );
  resources.addObject(
    Ember.Object.create({ name: 'Activity 2and 3', image: '', type: 'text' })
  );
  resources.addObject(
    Ember.Object.create({
      name: 'Brain Pop',
      image:
        'http://cdn.goorulearning.org/prod1/f000/1436/8541/cd5cfba2-591d-492f-946f-07a4c1df5432_cb55ce82-67d7-46b5-b657-9ac6ff5851d6.gif',
      type: 'webpage'
    })
  );
  resources.addObject(
    Ember.Object.create({
      name: 'The Three Types of Irony',
      image:
        'http://cdn.goorulearning.org/prod1/f000/1436/8540/bed55648-dd9f-4b25-89ad-3b564718a8d9_f8c0ecd1-977e-4f7b-8d31-83e59daf7154.png',
      type: 'interactive'
    })
  );

  this.set('resources', resources);
  assert.expect(3);

  this.render(hbs`{{collection-results-resources resources=resources}}`); //render the component
  var $component = this.$(); //component dom element

  var $collectionResources = $component.find('.collection-results-resources');
  T.exists(assert, $collectionResources, 'Missing collection resources');

  var $resourceImage = $component.find('.resource-image a img');
  T.exists(assert, $resourceImage, 'Missing resource image');

  var $collectionViews = $component.find('.resource-image-type');
  T.exists(assert, $collectionViews, 'Missing resource image type icon');
});
