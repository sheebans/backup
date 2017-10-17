import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:tenant/tenant', 'Unit | Serializer | tenant/tenant');

test('normalizeTenant', function(assert) {
  const serializer = this.subject();
  const data = {
    id: 1234,
    settings: {
      theme: {
        logoUrl: 'edify.png'
      }
    }
  };

  const tenant = serializer.normalizeTenant(data);
  assert.equal(tenant.get('id'), 1234, 'Wrong id');
  assert.equal(tenant.get('theme.logoUrl'), 'edify.png', 'Wrong logoUrl');
});
