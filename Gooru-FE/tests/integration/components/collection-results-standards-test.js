import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'collection-results-standards',
  'Integration | Component | collection results standards',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('collection results standards layout', function(assert) {
  var standards = Ember.A();
  standards.addObject(
    Ember.Object.create({
      code: 'CCSS.ELA-Literacy.RI.9-10.6',
      description: 'Demonstrate command of the conventions'
    })
  );
  standards.addObject(
    Ember.Object.create({
      code: 'CCSS.ELA-Literacy.RI.9-10.2',
      description: 'Demonstrate command of the conventions'
    })
  );
  standards.addObject(
    Ember.Object.create({
      code: 'CCSS.ELA-Literacy.RI.9-10.3',
      description: 'Demonstrate command of the conventions'
    })
  );

  this.set('standards', standards);

  this.render(hbs`{{collection-results-standards standards=standards}}`); //render the component
  var $component = this.$(); //component dom element

  var $collectionResources = $component.find('.collection-results-standards');
  T.exists(assert, $collectionResources, 'Missing collection standards');

  var $searchStandardLabel = $component.find(
    '.uc-search-standard:eq(0) .label'
  );
  T.exists(assert, $searchStandardLabel, 'Missing search standard label');

  assert.equal(
    T.text($searchStandardLabel),
    standards[0].code,
    'Incorrect name text'
  );

  var $standardTooltip = $component.find('.more-standards');
  T.exists(assert, $standardTooltip, 'Missing standard blue link');
});
