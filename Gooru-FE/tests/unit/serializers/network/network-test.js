import { moduleFor, test } from 'ember-qunit';
import NetworkModel from 'gooru-web/models/network/network';

moduleFor('serializer:network/network', 'Unit | Serializer | network/network');

test('normalizeReadNetwork', function(assert) {
  const serializer = this.subject();
  const networkPayload = {
    followers: ['id-1', 'id-2', 'id-3', 'id-4', 'id-5'],
    followings: ['id-1', 'id-2', 'id-3'],
    details: []
  };
  const expected = NetworkModel.create({
    followers: ['id-1', 'id-2', 'id-3', 'id-4', 'id-5'],
    followings: ['id-1', 'id-2', 'id-3'],
    details: []
  });
  const normalizedProfile = serializer.normalizeReadNetwork(networkPayload);
  assert.deepEqual(expected, normalizedProfile, 'Wrong normalized response');
});
