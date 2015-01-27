import Ember from 'ember';
import DocumentTitle from 'ember-document-title/mixins/document-title';
import config from './config/environment';

var Router = Ember.Router.extend(DocumentTitle, {
  location: config.locationType
});

Router.map(function() {
  this.route('dashtboard', { path : '/' });
  this.route('add');
});

export default Router;
