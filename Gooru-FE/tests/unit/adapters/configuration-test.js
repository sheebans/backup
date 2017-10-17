import { test } from 'ember-qunit';
import moduleForAdapter from 'gooru-web/tests/helpers/module-for-adapter';

moduleForAdapter(
  'adapter:configuration',
  'Unit | Adapter | configuration',
  {
    // needs: []
  }
);

test('loadConfiguration', function(assert) {
  assert.expect(1);

  const adapter = this.subject();
  const routes = function() {
    this.get(
      '/config/any-environment.json',
      function(/*request*/) {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({ a: 1 })
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  var done = assert.async();
  adapter.loadConfiguration('any-environment').then(function(response) {
    assert.deepEqual({ a: 1 }, response, 'Wrong response');
    done();
  });
});

test('loadConfiguration with config url', function(assert) {
  assert.expect(1);

  const adapter = this.subject();
  const routes = function() {
    this.get(
      '/any-config-url/config/any-environment.json',
      function(/*request*/) {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({ a: 1 })
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  var done = assert.async();
  adapter
    .loadConfiguration('any-environment', '/any-config-url')
    .then(function(response) {
      assert.deepEqual({ a: 1 }, response, 'Wrong response');
      done();
    });
});
