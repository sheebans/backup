import Ember from 'ember';
import Env from 'gooru-web/config/environment';
import { DEFAULT_IMAGES } from 'gooru-web/config/config';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

/**
 * Serializer for the Authentication (Login) with API 3.0
 *
 * @typedef {Object} AuthenticationSerializer
 */
export default Ember.Object.extend(ConfigurationMixin, {
  /**
   *
   * @param payload is the response coming from the endpoint
   * @param isAnonymous indicates if normalization is for an anonymous account
   * @param accessToken access token to use when it comes from google sign-in
   * @returns {{token, token-api3: *, user: {username: (string|string|string), gooruUId: *, isNew: *},
   *            cdnUrls:{content: *, user: *}, isAnonymous: *}}
   */
  normalizeResponse: function(payload, isAnonymous, accessToken) {
    const basePath = payload.cdn_urls.user_cdn_url;
    const appRootPath = this.get('appRootPath'); //configuration appRootPath

    return {
      token: isAnonymous
        ? Env['API-3.0']['anonymous-token-api-2.0']
        : Env['API-3.0']['user-token-api-2.0'],
      'token-api3': accessToken ? accessToken : payload.access_token,
      user: {
        username: payload.username,
        gooruUId: payload.user_id,
        avatarUrl: payload.thumbnail
          ? basePath + payload.thumbnail
          : appRootPath + DEFAULT_IMAGES.USER_PROFILE,
        isNew: !payload.user_category,
        providedAt: payload.provided_at
      },
      cdnUrls: {
        user: basePath,
        content: payload.cdn_urls.content_cdn_url
      },
      isAnonymous: isAnonymous,
      tenant: {
        tenantId: payload.tenant ? payload.tenant.tenant_id : undefined
      },
      partnerId: payload.partner_id
    };
  }
});
