/* eslint require-jsdoc: 0 */
import { module } from 'qunit';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

const { RSVP: { Promise } } = Ember;

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();
      wait();

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      let afterEach =
        options.afterEach && options.afterEach.apply(this, arguments);
      return Promise.resolve(afterEach).then(() =>
        destroyApp(this.application)
      );
    }
  });
}
