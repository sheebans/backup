/*global SockJS:true*/
import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | reports/context', {
  afterEach: function() {
    Stomp.over.restore();
  }
});

test('Report context: websocket error', function(assert) {
  assert.expect(7);
  const expectedUrl = 'realtimeURL/realtimeURI';
  let connectTimes = 0;
  const createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback, errorCallback) {
        assert.ok(true, 'Connect should be called');
        if (!connectTimes) {
          assert.deepEqual(headers, {}, 'Headers should match');
          errorCallback();
        }
        connectTimes += 1;
      },
      disconnect: function() {
        assert.ok(true, 'Disconnect should be called');
      }
    };
  };
  sinon
    .stub(Stomp, 'over')
    .onFirstCall()
    .returns(createSocket())
    .onSecondCall()
    .returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-id');

  const done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-id');
    setTimeout(done, 5000);
  });
});

test('Report context: websocket success', function(assert) {
  assert.expect(7);
  const expectedUrl = 'realtimeURL/realtimeURI';
  const createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback) {
        assert.ok(true, 'Connect should be called');
        connectCallback();
      },
      subscribe: function(channel) {
        assert.equal(
          channel,
          '/topic/context-simple-id',
          'Channel should match.'
        );
      }
    };
  };
  sinon
    .stub(Stomp, 'over')
    .onFirstCall()
    .returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-simple-id');

  const done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-simple-id');
    assert.equal(
      Ember.$('.qz-student-performance-box').length,
      2,
      'Should show 2 students'
    );
    assert.equal(
      Ember.$('.qz-student-performance-box:first .score').text(),
      '100%',
      'Score for student 1 shows correctly'
    );
    assert.equal(
      Ember.$('.qz-student-performance-box:last .score').text(),
      '67%',
      'Score for student 2 shows correctly'
    );
    done();
  });
});

test('Report context: websocket start message', function(assert) {
  assert.expect(7);
  const expectedUrl = 'realtimeURL/realtimeURI';
  const createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback) {
        assert.ok(true, 'Connect should be called');
        connectCallback();
      },
      subscribe: function(channel, callback) {
        assert.equal(
          channel,
          '/topic/context-simple-id',
          'Channel should match.'
        );
        callback({
          body: `{
           "contextId": "context-simple-id",
           "profileId": "another-profile-id",
           "eventName": "startContextEvent",
           "eventBody": {
             "isNewAttempt": true,
             "currentResourceId": "current-resource"
            }
          }`
        });
      }
    };
  };
  sinon
    .stub(Stomp, 'over')
    .onFirstCall()
    .returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-simple-id');

  const done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-simple-id');
    assert.equal(
      Ember.$('.qz-student-performance-box').length,
      3,
      'Should show 3 students'
    );
    assert.equal(
      Ember.$('.qz-student-performance-box:first .score').text(),
      '100%',
      'Score for student 1 shows correctly'
    );
    assert.equal(
      Ember.$('.qz-student-performance-box:last .score').text(),
      '',
      'Score for student 2 shows correctly'
    );
    done();
  });
});

test('Report context: websocket finish message', function(assert) {
  assert.expect(7);
  const expectedUrl = 'realtimeURL/realtimeURI';
  const createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback) {
        assert.ok(true, 'Connect should be called');
        connectCallback();
      },
      subscribe: function(channel, callback) {
        assert.equal(
          channel,
          '/topic/context-simple-id',
          'Channel should match.'
        );
        callback({
          body: `{
            "contextId": "context-simple-id",
            "profileId": "profile-id-1",
            "eventName": "finishContextEvent",
            "eventBody": {
              "eventSummary": {
                "totalTimeSpent": 10000,
                "averageReaction": 2,
                "averageScore": 75,
                "totalCorrect": 4,
                "totalAnswered": 5
              }
            }
          }`
        });
      }
    };
  };
  sinon
    .stub(Stomp, 'over')
    .onFirstCall()
    .returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-simple-id');

  const done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-simple-id');
    assert.equal(
      Ember.$('.qz-student-performance-box').length,
      2,
      'Should show 2 students'
    );
    assert.equal(
      Ember.$('.qz-student-performance-box:first .score').text(),
      '100%',
      'Score for student 1 shows correctly'
    );
    assert.equal(
      Ember.$('.qz-student-performance-box:last .score').text(),
      '75%',
      'Score for student 2 shows correctly'
    );
    done();
  });
});

test('Report context: websocket on resource message', function(assert) {
  assert.expect(7);
  const expectedUrl = 'realtimeURL/realtimeURI';
  const createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback) {
        assert.ok(true, 'Connect should be called');
        connectCallback();
      },
      subscribe: function(channel, callback) {
        assert.equal(
          channel,
          '/topic/context-simple-id',
          'Channel should match.'
        );
        callback({
          body: `{
            "contextId": "context-simple-id",
            "profileId": "profile-id-1",
            "eventName": "onResourceEvent",
            "eventBody": {
              "previousResource": {
                "resourceId": "question1-id",
                "timeSpent": 1000,
                "reaction": 2,
                "score": 100,
                "answer": [{
                  "value": "1"
                }],
                "isSkipped": false
              },
              "eventSummary": {
                "totalTimeSpent": 10000,
                "averageReaction": 2,
                "averageScore": 75,
                "totalCorrect": 4,
                "totalAnswered": 5
              }
            }
          }`
        });
      }
    };
  };
  sinon
    .stub(Stomp, 'over')
    .onFirstCall()
    .returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-simple-id');

  const done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-simple-id');
    assert.equal(
      Ember.$('.qz-student-performance-box').length,
      2,
      'Should show 2 students'
    );
    assert.equal(
      Ember.$('.qz-student-performance-box:first .score').text(),
      '100%',
      'Score for student 1 shows correctly'
    );
    assert.equal(
      Ember.$('.qz-student-performance-box:last .score').text(),
      '75%',
      'Score for student 2 shows correctly'
    );
    done();
  });
});
