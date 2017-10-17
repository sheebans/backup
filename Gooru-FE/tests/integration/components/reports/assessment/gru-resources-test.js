import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import resourceResult from 'gooru-web/models/result/resource';
import Ember from 'ember';

moduleForComponent(
  'reports/assessment/gru-resources',
  'Integration | Component | reports/assessment/gru resources',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);
test('Resources Layout', function(assert) {
  const resourceResults = Ember.A([
    resourceResult.create({
      resource: Ember.Object.create({
        title: 'Resource Title 1',
        format: 'interactive',
        order: 1
      }),
      reaction: 4,
      timeSpent: 2096
    }),
    resourceResult.create({
      resource: Ember.Object.create({
        title: 'Resource Title 2',
        format: 'image',
        order: 2
      }),
      reaction: 2,
      timeSpent: 1096
    })
  ]);

  this.set('resourceResults', resourceResults);

  this.render(hbs`
    {{reports/assessment/gru-resources
      results=resourceResults
      showReactionBar=true
    }}`);
  const $component = this.$('.reports.assessment.gru-resources');

  T.exists(assert, $component, 'Missing resources component');
  T.exists(assert, $component.find('.title h4'), 'Missing resources title');
  T.exists(
    assert,
    $component.find('table th.header.number'),
    'Missing number header'
  );
  T.exists(
    assert,
    $component.find('table th.header.resource'),
    'Missing resource header'
  );
  T.exists(
    assert,
    $component.find('table th.header.timeSpent'),
    'Missing time spent header'
  );
  T.exists(
    assert,
    $component.find('table th.header.reaction'),
    'Missing reaction header'
  );
  T.exists(
    assert,
    $component.find('table tbody td.number-resource'),
    'Missing number column'
  );
  assert.equal(
    T.text($component.find('table tbody td.number-resource:eq(1)')),
    '2',
    'Wrong resource number for resource 2'
  );
  T.exists(
    assert,
    $component.find('table tbody td.resource-text'),
    'Missing text column'
  );
  T.exists(
    assert,
    $component.find('table tbody td.resource-type-icon .image'),
    'Missing resource icon'
  );
  T.exists(
    assert,
    $component.find('table tbody td.time-spent'),
    'Missing time spent column'
  );
  T.exists(
    assert,
    $component.find('table tbody td.reaction'),
    'Missing reaction column'
  );
  T.exists(
    assert,
    $component.find('.resource-cards.visible-xs'),
    'Missing mobile resource cards'
  );
  assert.equal(
    $component.find('table tbody tr').length,
    2,
    'Incorrect number of rows'
  );
});

test('Resources Layout - do not show reaction bar', function(assert) {
  const resourceResults = Ember.A([
    resourceResult.create({
      resource: Ember.Object.create({
        title: 'Resource Title 1',
        format: 'interactive',
        order: 1
      }),
      reaction: 4,
      timeSpent: 2096
    }),
    resourceResult.create({
      resource: Ember.Object.create({
        title: 'Resource Title 2',
        format: 'image',
        order: 2
      }),
      reaction: 2,
      timeSpent: 1096
    })
  ]);

  this.set('resourceResults', resourceResults);

  this.render(hbs`
    {{reports/assessment/gru-resources
      results=resourceResults
      showReactionBar=false
    }}`);
  const $component = this.$('.reports.assessment.gru-resources');

  T.notExists(
    assert,
    $component.find('table th.header.reaction'),
    'Reaction header should not be visible'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.reaction'),
    'Reaction column should not be visible'
  );
});
