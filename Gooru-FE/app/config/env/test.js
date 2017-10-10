/*
  Test Environment configuration properties
 */
export default {
  appRootPath: '/', //default is root
  endpoint: {
    url: 'http://localhost:7357',
    secureUrl: 'http://localhost:7357',
    tenantUrl: 'http://localhost:7357/nile-tenants' //stubby
  },

  realTime: {
    webServiceUrl: 'https://localhost:7357',
    webServiceUri: '/nucleus/realtime',
    webSocketUrl: 'https://localhost:7357',
    webSocketUri: '/ws/realtime'
  },

  teams: {
    url: 'http://teams-qa.gooru.org'
  },

  player: {
    resources: {
      pdf: {
        googleDriveEnable: false,
        googleDriveUrl: 'https://docs.google.com/gview?url='
      }
    }
  },

  themes: {
    bergen: {
      player: {
        narration: {
          highlightColor: '#C1E7D9'
        }
      }
    }
  },

  'quizzes-addon': {
    endpoint: {
      url: 'http://localhost:7357',
      secureUrl: 'http://localhost:7357',
      providerUrl: 'http://localhost:7357'
    },

    realTime: {
      webServiceUrl: 'https://localhost:7357',
      webServiceUri: '/nucleus/realtime',
      webSocketUrl: 'realtimeURL',
      webSocketUri: '/realtimeURI'
    }
  },

  exploreFeaturedCourses: {
    firstCourseId: '1d91657f-694b-43dc-9306-bca17b107c7d',
    secondCourseId: '7b58ac43-075b-46c4-a7f4-a1ce2b346e85',
    thirdCourseId: 'd9b7c359-adff-486d-a2cf-bbbbc66c2ba5',
    fourthCourseId: '781c3e76-a382-4652-86ae-079b92f57a9d'
  }
};
