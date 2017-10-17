import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'serializer:analytics/analytics',
  'Unit | Serializer | analytics/analytics'
);

test('normalizeResponse', function(assert) {
  const serializer = this.subject();
  const payload = {
    content: [
      {
        userUid: '602fee94-50cf-4a8b-af2b-6b73e0319bab',
        usageData: [
          {
            gooruOId: '46d4a6d4-991b-4c51-a656-f694e037dd68',
            views: 1,
            score: 1,
            reaction: 5,
            timeSpent: 3600000,
            resourceType: 'question',
            questionType: 'MC',
            answerObject: [
              {
                answerId: 'answer_1'
              }
            ]
          },
          {
            score: 0,
            gooruOId: '135d1eab-f00f-4c51-8c26-0b0efea2207f',
            reaction: 0,
            timeSpent: 14471,
            answerObject: 'NA',
            sessionId:
              'AS~24f90728-a53c-4832-b3bc-c4ef9ac09014~0219090c-abe6-4a09-8c9f-343911f5cd86',
            questionType: 'RES',
            views: 3,
            resourceType: 'resource'
          },
          {
            gooruOId: '46d4a6d4-991b-4c51-a656-f694e037dd68',
            views: 1,
            score: 0,
            reaction: 5,
            timeSpent: 3600000,
            resourceType: 'question',
            questionType: 'MC',
            answerObject: null
          }
        ]
      }
    ],
    message: null,
    paginate: null
  };
  const response = serializer.normalizeResponse(payload);

  assert.equal(response.get('length'), 1, 'Missing user results');
  const userResults = response.get('firstObject');
  assert.equal(
    userResults.get('user'),
    '602fee94-50cf-4a8b-af2b-6b73e0319bab',
    'Wrong user'
  );
  const resourceResults = userResults.get('resourceResults');
  assert.equal(resourceResults.get('length'), 3, 'Missing resource results');
  var firstResource = resourceResults.get('firstObject');
  assert.equal(
    firstResource.get('resourceId'),
    '46d4a6d4-991b-4c51-a656-f694e037dd68',
    'Wrong resource id'
  );
  assert.equal(
    firstResource.get('resourceType'),
    'question',
    'Wrong resource type'
  );
  assert.equal(firstResource.get('reaction'), 5, 'Wrong reaction value');
  assert.equal(
    firstResource.get('timeSpent'),
    3600000,
    'Wrong timeSpent value'
  );
  assert.equal(firstResource.get('correct'), true, 'Wrong correct value');
  assert.equal(firstResource.get('score'), 1, 'Wrong score value');
  assert.equal(
    firstResource.get('userAnswer'),
    'answer_1',
    'Wrong user answer value'
  );
  assert.ok(
    firstResource.get('submittedAnswer'),
    'Wrong submitted answer value'
  );
  const secondResource = resourceResults.objectAt(1);
  assert.equal(
    secondResource.get('resourceId'),
    '135d1eab-f00f-4c51-8c26-0b0efea2207f',
    'Wrong resource id'
  );
  assert.equal(
    secondResource.get('resourceType'),
    'resource',
    'Wrong resource type'
  );
  assert.equal(secondResource.get('reaction'), 0, 'Wrong reaction value');
  assert.equal(secondResource.get('timeSpent'), 14471, 'Wrong timeSpent value');
  assert.equal(
    secondResource.get('sessionId'),
    'AS~24f90728-a53c-4832-b3bc-c4ef9ac09014~0219090c-abe6-4a09-8c9f-343911f5cd86',
    'Wrong sessionId value'
  );
  assert.equal(
    secondResource.get('userAnswer'),
    null,
    'Wrong user answer value'
  );
  const thirdResource = resourceResults.objectAt(2);
  assert.notOk(
    thirdResource.get('submittedAnswer'),
    'Wrong submitted answer value'
  );
});

test('normalizeGetStandardsSummary', function(assert) {
  const serializer = this.subject();
  const payload = {
    content: [
      {
        displayCode: 'NU.M12A.1.A',
        learningTargetId: 'NU.HE.MA-M12A-EE-01-01',
        questions: [
          {
            answerStatus: 'correct',
            attempts: 0,
            questionId: '3a6b0f65-c47c-44d9-b9ad-590b6dd985ca',
            questionType: 'FIB',
            reaction: 0,
            score: 100,
            timespent: 5000
          }
        ],
        reaction: 0,
        score: 40,
        timespent: 15000
      },
      {
        displayCode: 'NU.M12A.1.A.2',
        standardsId: 'NU.HE.MA-M12A-EE-01-02',
        questions: [
          {
            answerStatus: 'correct',
            attempts: 0,
            questionId: 'test',
            questionType: 'FIB',
            reaction: 0,
            score: 100,
            timespent: 5000
          }
        ],
        reaction: 0,
        score: 50,
        timespent: 15000
      }
    ]
  };
  const response = serializer.normalizeGetStandardsSummary(payload);

  assert.equal(response.get('length'), 2, 'Missing standards');
  const learningTarget = response.get('firstObject');
  assert.equal(learningTarget.get('id'), 'NU.HE.MA-M12A-EE-01-01', 'Wrong id');
  assert.equal(learningTarget.get('standard'), 'NU.M12A.1.A', 'Wrong standard');
  assert.equal(learningTarget.get('mastery'), 40, 'Wrong mastery');
  assert.equal(
    learningTarget.get('relatedQuestions').get('firstObject'),
    '3a6b0f65-c47c-44d9-b9ad-590b6dd985ca',
    'Wrong related questions'
  );
  const standard = response.get('lastObject');
  assert.equal(standard.get('id'), 'NU.HE.MA-M12A-EE-01-02', 'Wrong id');
  assert.equal(standard.get('standard'), 'NU.M12A.1.A.2', 'Wrong standard');
  assert.equal(standard.get('mastery'), 50, 'Wrong mastery');
  assert.equal(
    standard.get('relatedQuestions').get('firstObject'),
    'test',
    'Wrong related questions'
  );
});
