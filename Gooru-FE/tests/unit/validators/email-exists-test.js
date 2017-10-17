import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:email-exists', 'Unit | Validator | email-exists', {
  needs: ['validator:messages']
});

test('Email is used in an account', function(assert) {
  assert.expect(2);

  let validator = this.subject();
  let done = assert.async();

  validator.set(
    'profileService',
    Ember.Object.create({
      checkEmailExists: function(email) {
        assert.equal(email, 'email-value', 'Wrong email');
        return Ember.RSVP.resolve();
      }
    })
  );

  validator.validate('email-value').then(message => {
    assert.equal(message, true);
    done();
  });
});

test('Email is not used in an account', function(assert) {
  assert.expect(2);

  let validator = this.subject();
  let done = assert.async();

  const error = {
    message: 'error-message'
  };

  validator.set(
    'profileService',
    Ember.Object.create({
      checkEmailExists: function(email) {
        assert.equal(email, 'email-value', 'Wrong email');
        return Ember.RSVP.reject(error);
      }
    })
  );

  validator.validate('email-value').then(message => {
    assert.equal(message, error);
    done();
  });
});
