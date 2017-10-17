import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';

moduleForComponent('gru-take-tour', 'Integration | Component | gru take tour', {
  integration: true,
  beforeEach: function() {
    this.i18n = this.container.lookup('service:i18n');
    this.i18n.set('locale', 'en');
  }
});

test('Layout', function(assert) {
  assert.expect(4);

  this.render(hbs`{{gru-take-tour}}`);
  const $component = this.$(); //component dom element

  const $button = $component.find('button.start-tour');
  const $icon = $component.find('i.directions');
  const $textContainer = $component.find('.descriptive-text');

  T.exists(assert, $button, 'Missing start tour button');
  T.exists(assert, $icon, 'Wrong icon displayed');
  T.exists(assert, $textContainer, 'Missing text container');
  assert.equal(
    $textContainer.find('p').text(),
    'Take a Tour',
    'Wrong descriptive text'
  );
});
