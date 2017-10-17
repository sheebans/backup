import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'cards/gru-user-card',
  'Integration | Component | cards/gru user card',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Profile Card Layout', function(assert) {
  assert.expect(5);
  const user = Ember.Object.create({
    id: 10,
    avatarUrl: 'assets/gooru/profile.png',
    username: 'John'
  });
  this.set('user', user);

  this.render(hbs`{{cards/gru-user-card user=user}}`);

  var $component = this.$(); //component dom element
  T.exists(
    assert,
    $component.find('.gru-user-card'),
    'Component is missing component class'
  );

  var $avatar = $component.find('img.avatar');
  T.exists(assert, $avatar, 'Missing user avatar');

  var $userName = $component.find('.user-name');
  T.exists(assert, $userName, 'Missing  user name');
  assert.equal(T.text($userName), 'John', 'Incorrect  user name');

  T.notExists(
    assert,
    $component.find('.remove'),
    'Remove button should not appear'
  );
});
test('Remove button', function(assert) {
  assert.expect(1);
  const user = Ember.Object.create({
    id: 10,
    avatarUrl: 'assets/gooru/profile.png',
    username: 'John'
  });
  this.set('user', user);

  this.set('isTeacherAndStudentCard', true);

  this.render(
    hbs`{{cards/gru-user-card user=user isTeacherAndStudentCard=isTeacherAndStudentCard}}`
  );

  var $component = this.$(); //component dom element
  T.exists(assert, $component.find('.remove'), 'Remove button missing');
});
