import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:google-username', 'Unit | Validator | google-username', {
  needs: ['validator:messages']
});

test('Username is not used in a google account', function(assert) {
  assert.expect(2);

  let validator = this.subject();
  let done = assert.async();

  validator.set(
    'profileService',
    Ember.Object.create({
      checkGoogleUsername: function(username) {
        assert.equal(username, 'username-value', 'Wrong username');
        return Ember.RSVP.resolve();
      }
    })
  );

  validator.validate('username-value').then(message => {
    assert.equal(message, true);
    done();
  });
});

test('Username is used in a google account', function(assert) {
  assert.expect(2);

  let validator = this.subject();
  let done = assert.async();

  const error = {
    message: 'error-message'
  };

  validator.set(
    'profileService',
    Ember.Object.create({
      checkGoogleUsername: function(username) {
        assert.equal(username, 'username-value', 'Wrong username');
        return Ember.RSVP.reject(error);
      }
    })
  );

  validator.validate('username-value').then(message => {
    assert.equal(message, error);
    done();
  });
});
