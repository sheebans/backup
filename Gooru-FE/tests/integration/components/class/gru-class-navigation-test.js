import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'gooru-web/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'class/gru-class-navigation',
  'Integration | Component | class/gru class navigation',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Class Navigation', function(assert) {
  assert.expect(12);

  const classMock = Ember.Object.create({
    id: '1',
    name: 'Class A1',
    code: 'ABCDEF',
    greetings:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    startDate: '9.2.2015',
    endDate: '12.15.2015'
  });

  this.set('class', classMock);

  this.on('itemSelected', function(item) {
    assert.equal(item, 'info', 'Incorrect selected menu class item');
  });

  this.render(
    hbs`{{class.gru-class-navigation class=class selectedMenuItem='info' onItemSelected='itemSelected'}}`
  );

  var $component = this.$(); //component dom element
  const $navigation = $component.find('.gru-class-navigation');
  T.exists(assert, $navigation, 'Missing class navigation section');
  T.exists(assert, $navigation.find('.class-info h4'), 'Missing class title');
  T.exists(
    assert,
    $navigation.find('.active-dates'),
    'Missing class active-dates'
  );
  T.exists(assert, $navigation.find('.members'), 'Missing class members');
  T.exists(assert, $navigation.find('.greetings'), 'Missing class greetings');
  T.exists(
    assert,
    $navigation.find('.greetings-description'),
    'Missing class greetings-description'
  );

  //$class menu list
  const $classMenu = $navigation.find('.class-menu');
  T.exists(assert, $classMenu, 'Missing class menu');
  T.exists(
    assert,
    $classMenu.find('.overview'),
    'Missing overview item in the class menu'
  );
  T.exists(
    assert,
    $classMenu.find('.analytics'),
    'Missing analytics item in the class menu'
  );
  T.exists(
    assert,
    $classMenu.find('.teams.out-of-scope'),
    'Missing teams item in the class menu'
  );
  T.exists(
    assert,
    $classMenu.find('.info'),
    'Missing info item in the class menu'
  );

  //$menu item Selected
  T.exists(
    assert,
    $classMenu.find('.info.selected'),
    'Missing selected info item'
  );
});

test('Layout when a menu Item is selected', function(assert) {
  assert.expect(5);

  this.on('itemSelected', function() {
    assert.ok(true, 'external Action was called!');
  });

  this.render(
    hbs`{{class.gru-class-navigation onItemSelected='itemSelected'}}`
  );
  var $navigation = this.$(); //component dom element
  const $infoMenuItem = $navigation.find('.class-menu .class-menu-item.info');
  const $overviewMenuItem = $navigation.find(
    '.class-menu .class-menu-item.overview'
  );

  assert.ok($infoMenuItem, 'Missing info item in the class menu');
  assert.ok($overviewMenuItem, 'Missing overview item in the class menu');
  $infoMenuItem.click();
  $overviewMenuItem.click();
  assert.equal(
    $navigation.find('.class-menu .class-menu-item.selected').length,
    1,
    'The class menu menu should have only one item selected'
  );
});
