import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

/* Set the route title on each respective controller */
Ember.Route.reopen({
  setupController: function(controller) {
    this._super(...arguments);

    var title = this.get('title');
    if (title) {
      controller.set('title', this.get('title'));
    }
  }
});

export default App;
