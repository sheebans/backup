import Ember from 'ember';
import GruTheme from '../utils/gru-theme';
import Env from '../config/environment';
import PublicRouteMixin from 'gooru-web/mixins/public-route-mixin';
import GooruLegacyUrl from 'gooru-web/utils/gooru-legacy-url';
import Error from 'gooru-web/models/error';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

/**
 * @typedef {object} ApplicationRoute
 */
export default Ember.Route.extend(PublicRouteMixin, ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  i18n: Ember.inject.service(),

  /**
   * @type {ClassService} Service to retrieve user information
   */
  classService: Ember.inject.service('api-sdk/class'),

  /**
   * Authentication (api-sdk/session) service.
   * @property authService
   * @readOnly
   */
  authService: Ember.inject.service('api-sdk/session'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service(),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @requires service:api-sdk/log
   */
  errorService: Ember.inject.service('api-sdk/error'),

  // -------------------------------------------------------------------------
  // Methods

  setupGlobalErrorHandling: Ember.on('init', function() {
    const route = this;

    // Ultimately all server and javascript errors will be caught by this handler
    Ember.onerror = function(error) {
      if (error.status !== 401) {
        const errorMessage = route.get('i18n').t('common.unexpectedError')
          .string;
        route.get('notifications').error(errorMessage);
        route.trackAppError(error);
      }
      const isTesting = Env.environment === 'test';
      if (isTesting) {
        throw error; //throws the error so tests fail
      }
    };

    Ember.$(document).ajaxError(function(event, jqXHR, settings) {
      if (
        jqXHR.status !== 401 &&
        !route.isGetCollectionWithRefreshRequest(settings)
      ) {
        route.trackEndPointError(event, jqXHR, settings);
      }
    });
  }),

  beforeModel: function() {
    if (Env.embedded) {
      return this.beforeModelEmbeddedApplication();
    }
  },

  model: function(params) {
    const route = this;
    const currentSession = route.get('session.data.authenticated');
    const themeId = params.themeId || Env.themes.default;
    let myClasses = null;
    var profilePromise = null;

    if (!currentSession.isAnonymous) {
      profilePromise = route
        .get('profileService')
        .readUserProfile(route.get('session.userId'));
      myClasses = profilePromise.then(function(userProfile) {
        return route.get('classService').findMyClasses(userProfile);
      });
    }

    route.setupTheme(themeId);

    let accessToken = params.access_token;
    if (!accessToken) {
      let applicationController = route.controllerFor('application');
      applicationController.setupTenant();
    }
    return Ember.RSVP.hash({
      currentSession: currentSession,
      myClasses: myClasses,
      profile: profilePromise
    });
  },

  afterModel: function() {
    const route = this;
    this.set('i18n.locale', 'en');
    if (Env.embedded) {
      return route.afterModelEmbeddedApplication();
    } else {
      return route.handleLegacyUrlIfNecessary();
    }
  },

  setupController: function(controller, model) {
    if (model.myClasses) {
      controller.set('myClasses', model.myClasses);
    }

    if (model.profile) {
      controller.set('profile', model.profile);
    }
  },

  /**
   * Setups the application theme
   * @param {GruTheme} theme
   */
  setupTheme: function(themeId) {
    const route = this;
    themeId = route.get('configuration.themeId')
      ? route.get('configuration.themeId')
      : themeId;
    if (themeId) {
      const theme = GruTheme.create({ id: themeId });
      route.setupThemeStyles(theme);
    }
  },

  /**
   * Sets the theme styles if available
   * @param {GruTheme} theme
   */
  setupThemeStyles: function(theme) {
    //setting theme id at html tag
    Ember.$(Env.rootElement).addClass(`${theme.get('id')}-theme`);
    //adding theme styles to head tag
    const appRootPath = this.get('configuration.appRootPath');
    const cssUrl = theme.get('cssUrl');
    const themeCssUrl = `${appRootPath}${cssUrl}`;
    if (themeCssUrl) {
      Ember.$('head').append(
        `<link id="theme-style-link" rel="stylesheet" type="text/css" href="${themeCssUrl}">`
      );
    }
  },

  /**
   * Handles a url when necessary
   */
  handleLegacyUrlIfNecessary: function() {
    const route = this;
    const legacyUrl = GooruLegacyUrl.create({
      url: route.get('router.url')
    });

    if (legacyUrl.get('isLegacyUrl')) {
      //checking for a legacy legacyUrl
      const routeParams = legacyUrl.get('routeParams');
      if (routeParams) {
        route.transitionTo.apply(route, routeParams);
      }
    }
  },

  /**
   * Tracks end point errors
   * @param event
   * @param jqXHR
   * @param settings
   */
  trackEndPointError: function(event, jqXHR, settings) {
    const route = this;

    // do not track errors at the user-error api, this to prevent a loop
    const isUserError =
      settings.url.indexOf('api/nucleus-utils/v1/user-error') >= 0;
    const isTenantError = settings.url.indexOf('tenant.json') >= 0;
    if (isUserError || isTenantError) {
      return;
    }

    const targetElement =
      event.currentTarget && event.currentTarget.activeElement
        ? event.currentTarget.activeElement
        : false;
    const model = Error.create({
      type: 'url',
      timestamp: new Date().getTime(),
      userId: route.get('session.isAnonymous')
        ? 'anonymous'
        : route.get('session.userId'),
      details: {
        route: route.get('router.url'),
        userAgent: navigator.userAgent,
        'element-selector': targetElement ? targetElement.className : null,
        endpoint: {
          url: settings.url,
          response: jqXHR.responseText,
          status: jqXHR.status,
          headers: settings.headers,
          responseHeaders: jqXHR.getAllResponseHeaders(),
          method: settings.type,
          data: settings.data
        }
      },
      description: 'Endpoint error'
    });

    route.get('errorService').createError(model);
  },

  /**
   * Tracks application/js errors
   * @param error
   */
  trackAppError: function(error) {
    const route = this;

    // do not track errors at the user-error api, this to prevent a loop
    if (
      error.responseText &&
      error.responseText.indexOf('api/nucleus-utils/v1/user-error') >= 0
    ) {
      return;
    }

    const model = Error.create({
      type: 'page',
      timestamp: new Date().getTime(),
      userId: route.get('session.isAnonymous')
        ? 'anonymous'
        : route.get('session.userId'),
      details: {
        route: route.get('router.url'),
        userAgent: navigator.userAgent,
        stack: error.stack
      },
      description: JSON.stringify(error)
    });

    const isTesting = Env.environment === 'test';
    if (!isTesting) {
      Ember.Logger.error(error.stack);
      route.get('errorService').createError(model);
    }
  },

  deactivate: function() {
    Ember.$(document).off('ajaxError');
  },

  /**
   * Handle the logic for the embedded application
   * @returns {Promise.<TResult>}
   */
  beforeModelEmbeddedApplication: function() {
    const route = this;
    const token = Env.APP.awProps.token;
    const configurationService = route.get('configurationService');

    //load embedded properties
    Env.APP.awProps.embedded = true;
    configurationService.merge(Env.APP.awProps);

    const authService = route.get('authService');
    const authPromise = token
      ? authService.signInWithToken(token)
      : authService.get('session').authenticateAsAnonymous();

    return authPromise;
  },

  /**
   * Handle the embedded application transition
   * @returns {Promise.<TResult>}
   */
  afterModelEmbeddedApplication: function() {
    const route = this;
    const transition = route.get('configuration.transition');
    const routeName = 'sign-in';
    if (transition) {
      route.transitionTo.apply(route, transition);
    } else {
      route.transitionTo(routeName);
    }
  },

  isGetCollectionWithRefreshRequest: function(settings) {
    let pattern = /\/quizzes\/api\/v1\/collections\/(.*)&refresh=true/;
    return settings.type === 'GET' && settings.url.match(pattern);
  },

  // -------------------------------------------------------------------------
  // Actions - only transition actions should be placed at the route
  actions: {
    /**
     * Action triggered when submitting the login form
     * @see application.hbs
     * @see gru-header.hbs
     */
    signIn: function() {
      const route = this;
      route.actions.updateUserClasses.call(this).then(
        // Required to get list of classes after login
        function() {
          route.transitionTo('index');
        }
      );
    },

    /**
     * Action triggered when login out
     */
    logout: function() {
      this.transitionTo('logout');
    },

    /**
     * Action triggered when the user search for collections
     * @see application.hbs
     * @see gru-header.js
     */
    searchTerm: function(term) {
      const routeName = this.get('controller.currentRouteName');
      if (routeName.indexOf('search') >= 0) {
        this.set('controller.term', term);
      } else {
        var termParam = `?term=${term}`;
        this.transitionTo(`/search/courses${termParam}`);
      }
    },

    /**
     * Gets a refreshed list of user classes
     * @see create.js
     * @see join.js
     */
    updateUserClasses: function() {
      const route = this;
      return route.get('controller').loadUserClasses();
    }
  }
});
