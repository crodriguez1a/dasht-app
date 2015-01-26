import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('dashtboard', { path : '/' });
  this.route('add');
});

export default Router;
