import Ember from 'ember';
import {
  REAL_TIME_CLIENT,
  CONTEXT_EVENT_TYPES
} from 'quizzes-addon/config/quizzes-config';
import ConfigMixin from 'quizzes-addon/mixins/endpoint-config';

/**
 *
 * Controller for collection/assessment report
 *
 * Controls the gathering and merging of context events
 * for a collection/assessment
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Controller.extend(ConfigMixin, {
  queryParams: ['anonymous'],

  /**
   * @type {ContextService} contextService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesContextService: Ember.inject.service('quizzes/context'),

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:notifications
   */
  quizzesNotifications: Ember.inject.service('quizzes/notifications'),

  /**
   * @type {ProfileService} profileService
   * @property {Ember.Service} Service to send profile related events
   */
  quizzesProfileService: Ember.inject.service('quizzes/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Navigate to the previous page
     */
    goBack: function() {
      this.send('navigateBack');
    },

    /**
     * Launch report with anonymous codes
     */
    launchAnonymous: function() {
      const url = window.location.href;
      const separator = !url.includes('?') ? '?' : '&';
      window.open(
        `${url}${separator}anonymous=true`,
        'realTimeAnonymous',
        `width=${window.screen.width}, height=${window.screen
          .height}, left=0, top=0, scrollbars=1`,
        true
      );
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean}
   */
  anonymous: false,

  /**
   * @property {TeacherContext} reportData object with the student events for
   * the current assessment
   */
  reportData: null,

  /**
   * @property {boolean} is a notification regarding the connection currently
   * being displayed
   */
  isNotificationDisplayed: false,

  /**
   * @property {boolean} isRealTime
   */
  isRealTime: true,

  /**
   * @property {boolean} showAttempts
   */
  showAttempts: false,

  /**
   * @property { Object } webSocketClient - web socket client for getting live
  * data from the Real Time server
   */
  webSocketClient: null,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observe when the 'reportData' object has been set by the route.
   * At this point, it is possible to proceed with the creation of the
   * websocket to communicate with the real time server and safely merge
   * any initialization data from the real time server as well
   */
  reportDataLoaded: Ember.observer('reportData', function() {
    const reportData = this.get('reportData');
    const contextId = reportData.get('contextId');

    if (reportData) {
      this.connectWithWebSocket(contextId, reportData);
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Create web socket connection
   */
  connectWithWebSocket: function(contextId, reportData) {
    const controller = this;

    // Create a new web socket connection
    const url = this.getRealTimeWebSocketUrl();
    const socket = new SockJS(url);
    let webSocketClient = Stomp.over(socket);
    webSocketClient.heartbeat.outgoing = REAL_TIME_CLIENT.OUTGOING_HEARTBEAT;
    webSocketClient.heartbeat.incoming = REAL_TIME_CLIENT.INCOMING_HEARTBEAT;

    controller.set('webSocketClient', webSocketClient);

    webSocketClient.connect(
      {},
      function() {
        // Clear a failed connection notification, if there was one
        controller.clearNotification();

        // A web socket connection was made to the RT server. Before subscribing
        // for live messages, a request will be made to fetch any initialization data
        // from the RT server (to avoid overriding data from live messages with init data)
        const channel = contextId;

        // Subscribe to listen for live messages
        webSocketClient.subscribe(`/topic/${channel}`, function(message) {
          const eventMessage = JSON.parse(message.body);
          let profilePromise = Ember.RSVP.resolve();
          const profileId = eventMessage.profileId;
          if (eventMessage.eventName === CONTEXT_EVENT_TYPES.START) {
            profilePromise = controller
              .get('quizzesProfileService')
              .readProfiles([profileId]);
          }
          profilePromise.then(profiles => {
            const profile = profiles ? profiles[profileId] : null;
            if (profile) {
              eventMessage.profileName = profile.get('fullName');
            }
            reportData.parseEvent(eventMessage);
          });
        });
      },
      function() {
        const connectAttemptDelay = REAL_TIME_CLIENT.CONNECTION_ATTEMPT_DELAY;

        controller.showNotification();
        webSocketClient.disconnect();
        webSocketClient = null;

        setTimeout(
          () => controller.connectWithWebSocket(contextId, reportData),
          connectAttemptDelay
        );
      }
    );
  },

  /**
   * Show a connection lost notification
   */
  showNotification: function() {
    const isDisplayed = this.get('isNotificationDisplayed');

    if (!isDisplayed) {
      const notifications = this.get('quizzesNotifications');
      const message = this.get('i18n').t(
        'common.warnings.on-air-connection-lost'
      ).string;

      // Use custom options for the notification
      notifications.setOptions({
        closeButton: false,
        newestOnTop: true,
        progressBar: false,
        positionClass: 'toast-top-full-width',
        preventDuplicates: false,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: '0',
        extendedTimeOut: '0',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      });
      notifications.warning(message);
      this.set('isNotificationDisplayed', true);
    }
  },

  /**
   * Remove all notifications
   */
  clearNotification: function() {
    this.get('quizzesNotifications').clear();
    this.set('isNotificationDisplayed', false);
  }
});
