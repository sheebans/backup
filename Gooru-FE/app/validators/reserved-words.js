import BaseValidator from 'ember-cp-validations/validators/base';
import { RESERVED_WORDS } from 'gooru-web/config/config';
import Ember from 'ember';

export default BaseValidator.extend({
  i18n: Ember.inject.service(),

  validate(value) {
    if (value) {
      let reservedWord = RESERVED_WORDS.find(function(item) {
        return item === value;
      });
      return reservedWord
        ? this.get('i18n').t('sign-up.error-username-taken').string
        : true;
    } else {
      return true;
    }
  }
});
