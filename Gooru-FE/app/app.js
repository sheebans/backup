import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.TextField.reopen({
  attributeBindings: ['data-toggle', 'data-placement']
});

App = Ember.Application.extend({
  rootElement: config.rootElement,
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});
App.LOG_TRANSITIONS_INTERNAL = true;

loadInitializers(App, config.modulePrefix);

export default App;
