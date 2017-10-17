import EndPointsConfig from 'gooru-web/utils/endpoint-config';
import { module, test } from 'qunit';

module('Unit | utils | endpoint-config');

test('getEndpointUrl', function(assert) {
  const endpointUrl = EndPointsConfig.getEndpointUrl();
  assert.equal(endpointUrl, 'http://localhost:7357');
});

test('getEndpointSecureUrl', function(assert) {
  const endpointUrl = EndPointsConfig.getEndpointSecureUrl();
  assert.equal(endpointUrl, 'http://localhost:7357');
});

test('getRealTimeWebServiceUrl', function(assert) {
  const endpointUrl = EndPointsConfig.getRealTimeWebServiceUrl();
  assert.equal(endpointUrl, 'https://localhost:7357');
});

test('getRealTimeWebServiceUri', function(assert) {
  const endpointUrl = EndPointsConfig.getRealTimeWebServiceUri();
  assert.equal(endpointUrl, '/nucleus/realtime');
});

test('getRealTimeWebSocketUrl', function(assert) {
  const endpointUrl = EndPointsConfig.getRealTimeWebSocketUrl();
  assert.equal(endpointUrl, 'https://localhost:7357/ws/realtime');
});

test('getRealTimeWebSocketUri', function(assert) {
  const endpointUrl = EndPointsConfig.getRealTimeWebSocketUri();
  assert.equal(endpointUrl, '/ws/realtime');
});
