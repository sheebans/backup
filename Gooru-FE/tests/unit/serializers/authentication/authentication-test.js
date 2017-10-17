import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Env from 'gooru-web/config/environment';
import { DEFAULT_IMAGES } from 'gooru-web/config/config';

var configurationService = Ember.Object.create({
  configuration: {
    appRootPath: '/'
  }
});

moduleFor(
  'serializer:authentication/authentication',
  'Unit | Serializer | authentication/authentication'
);

test('normalizeResponse for anonymous account', function(assert) {
  const serializer = this.subject();
  const appRootPath = '/'; //default appRootPath
  serializer.set('configurationService', configurationService);
  const payload = {
    access_token: 'token-api-3.0',
    username: 'username',
    user_id: 'user-id',
    cdn_urls: {
      user_cdn_url: 'user-url',
      content_cdn_url: 'content-url'
    },
    provided_at: 0,
    tenant: {
      tenant_id: 1
    },
    partner_id: 2
  };
  const expected = {
    token: Env['API-3.0']['anonymous-token-api-2.0'],
    'token-api3': 'token-api-3.0',
    user: {
      username: 'username',
      gooruUId: 'user-id',
      avatarUrl: `${appRootPath}${DEFAULT_IMAGES.USER_PROFILE}`,
      isNew: true,
      providedAt: 0
    },
    cdnUrls: {
      user: 'user-url',
      content: 'content-url'
    },
    isAnonymous: true,
    tenant: {
      tenantId: 1
    },
    partnerId: 2
  };
  const response = serializer.normalizeResponse(payload, true);
  assert.deepEqual(expected, response, 'Wrong normalized response');
});

test('normalizeResponse for normal account', function(assert) {
  const serializer = this.subject();
  const payload = {
    access_token: 'token-api-3.0',
    username: 'username',
    thumbnail: 'image-id',
    user_id: 'user-id',
    cdn_urls: {
      user_cdn_url: 'user-url/',
      content_cdn_url: 'content-url/'
    },
    provided_at: 1,
    tenant: {
      tenant_id: 1
    },
    partner_id: 2
  };
  const expected = {
    token: Env['API-3.0']['user-token-api-2.0'],
    'token-api3': 'token-api-3.0',
    user: {
      username: 'username',
      gooruUId: 'user-id',
      avatarUrl: 'user-url/image-id',
      isNew: true,
      providedAt: 1
    },
    cdnUrls: {
      user: 'user-url/',
      content: 'content-url/'
    },
    isAnonymous: false,
    tenant: {
      tenantId: 1
    },
    partnerId: 2
  };
  const response = serializer.normalizeResponse(payload, false);
  assert.deepEqual(expected, response, 'Wrong normalized response');
});

test('normalizeResponse for google account', function(assert) {
  const serializer = this.subject();
  const appRootPath = '/'; //default appRootPath
  serializer.set('configurationService', configurationService);
  const payload = {
    username: 'username',
    user_id: 'user-id',
    cdn_urls: {
      user_cdn_url: 'user-url',
      content_cdn_url: 'content-url'
    },
    provided_at: 2,
    tenant: {
      tenant_id: 1
    },
    partner_id: 2
  };
  const expected = {
    token: Env['API-3.0']['user-token-api-2.0'],
    'token-api3': 'token-api-3.0',
    user: {
      username: 'username',
      gooruUId: 'user-id',
      avatarUrl: `${appRootPath}${DEFAULT_IMAGES.USER_PROFILE}`,
      isNew: true,
      providedAt: 2
    },
    cdnUrls: {
      user: 'user-url',
      content: 'content-url'
    },
    isAnonymous: false,
    tenant: {
      tenantId: 1
    },
    partnerId: 2
  };
  const response = serializer.normalizeResponse(
    payload,
    false,
    'token-api-3.0'
  );
  assert.deepEqual(expected, response, 'Wrong normalized response');
});

test('normalizeResponse for google account containing user category', function(
  assert
) {
  const serializer = this.subject();
  const appRootPath = '/'; //default appRootPath
  serializer.set('configurationService', configurationService);
  const payload = {
    username: 'username',
    user_id: 'user-id',
    user_category: 'user-cateogory',
    cdn_urls: {
      user_cdn_url: 'user-url',
      content_cdn_url: 'content-url'
    },
    provided_at: 3,
    tenant: {
      tenant_id: 1
    },
    partner_id: 2
  };
  const expected = {
    token: Env['API-3.0']['user-token-api-2.0'],
    'token-api3': 'token-api-3.0',
    user: {
      username: 'username',
      gooruUId: 'user-id',
      avatarUrl: `${appRootPath}${DEFAULT_IMAGES.USER_PROFILE}`,
      isNew: false,
      providedAt: 3
    },
    cdnUrls: {
      user: 'user-url',
      content: 'content-url'
    },
    isAnonymous: false,
    tenant: {
      tenantId: 1
    },
    partnerId: 2
  };
  const response = serializer.normalizeResponse(
    payload,
    false,
    'token-api-3.0'
  );
  assert.deepEqual(expected, response, 'Wrong normalized response');
});
