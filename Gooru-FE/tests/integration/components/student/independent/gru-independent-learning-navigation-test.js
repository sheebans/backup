import { moduleForComponent, test } from 'ember-qunit';
import T from 'gooru-web/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'student/independent/gru-independent-learning-navigation',
  'Integration | Component | student/independent/gru independent-learning navigation',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Independent learning Navigation', function(assert) {
  this.render(
    hbs`{{student.independent.gru-independent-learning-navigation selectedMenuItem='collections'}}`
  );

  var $component = this.$(); //component dom element
  const $navigation = $component.find('.gru-independent-learning-navigation');
  assert.equal(
    $navigation.find('.nav a').length,
    3,
    'Number of class navigator links'
  );
  T.exists(assert, $navigation.find('.nav .courses'), 'Missing courses link');
  T.exists(
    assert,
    $navigation.find('.nav .collections'),
    'Missing collections link'
  );
  T.exists(
    assert,
    $navigation.find('.nav .assessments'),
    'Missing assessments link'
  );

  //$menu item Selected
  T.exists(
    assert,
    $navigation.find('.collections.active'),
    'Missing selected collections item'
  );
});

test('Layout when a menu Item is selected', function(assert) {
  this.on('itemSelected', function() {
    assert.ok(true, 'external Action was called!');
  });

  this.render(
    hbs`{{student.independent.gru-independent-learning-navigation onItemSelected='itemSelected'}}`
  );
  var $navigation = this.$(); //component dom element

  const $collectionsMenuItem = $navigation.find('.nav .collections a');
  const $coursesMenuItem = $navigation.find('.nav .courses a');

  assert.ok($collectionsMenuItem, 'Missing collections item in the class menu');
  assert.ok($coursesMenuItem, 'Missing courses item in the class menu');
  $collectionsMenuItem.click();
  $coursesMenuItem.click();
  assert.equal(
    $navigation.find('.nav .tab.active').length,
    1,
    'The menu should have only one item selected'
  );
});
