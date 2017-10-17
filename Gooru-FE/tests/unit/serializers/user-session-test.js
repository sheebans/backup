import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:user-session', 'Unit | Serializer | user-session');

test('serializeSessionAssessments', function(assert) {
  const serializer = this.subject();

  const expected = [
    {
      sequence: 1,
      eventTime: 1,
      sessionId: 'session-1'
    },
    {
      sequence: 2,
      eventTime: 1,
      sessionId: 'session-2'
    }
  ];

  const payload = {
    content: [
      {
        sequence: 1,
        eventTime: 1,
        sessionId: 'session-1'
      },
      {
        sequence: 2,
        eventTime: 1,
        sessionId: 'session-2'
      }
    ],
    message: null,
    paginate: null
  };

  const response = serializer.serializeSessionAssessments(payload);
  assert.deepEqual(
    response,
    expected,
    'Wrong response for serializeSessionAssessments'
  );
});

test('serializeOpenAssessment', function(assert) {
  const serializer = this.subject();

  const expected = {
    sequence: 1,
    eventTime: 1,
    sessionId: 'session-1'
  };

  const payload = {
    content: [
      {
        sequence: 1,
        eventTime: 1,
        sessionId: 'session-1'
      }
    ],
    message: null,
    paginate: null
  };

  const response = serializer.serializeOpenAssessment(payload);
  assert.deepEqual(
    response,
    expected,
    'Wrong response serializeOpenAssessment'
  );
});
