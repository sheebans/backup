import ConfigurationService from 'gooru-web/services/configuration';

/**
 * Get endpoint url from config
 */
export function getEndpointUrl() {
  //TODO don't use global configuration variable
  const configuration = ConfigurationService.configuration;
  return configuration ? configuration.get('endpoint.url') : '';
}

/**
 * Get endpoint secure url from config
 */
export function getEndpointSecureUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration ? configuration.get('endpoint.secureUrl') : '';
}

/**
 * Get real time url from config
 */
export function getRealTimeWebServiceUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration.get('realTime.webServiceUrl');
}

/**
 * Get real time uri from config
 */
export function getRealTimeWebServiceUri() {
  const configuration = ConfigurationService.configuration;
  return configuration.get('realTime.webServiceUri');
}

/**
 * get real time web socket uri
 */
export function getRealTimeWebSocketUri() {
  const configuration = ConfigurationService.configuration;
  return configuration.get('realTime.webSocketUri');
}

/**
 * Get real time web socket url
 */
export function getRealTimeWebSocketUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration.get('realTime.webSocketUrl') + getRealTimeWebSocketUri();
}
