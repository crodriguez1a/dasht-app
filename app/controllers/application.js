import Ember from 'ember';
import { moment, ago } from 'ember-moment/computed';

export default Ember.Controller.extend({
  menuOpen: false,
  storedTheme: function() {
    return localStorage.getItem('dasht-theme');
  }.property(),
  defaultTheme: "light",
  currentTheme: function() {
    return this.get('storedTheme') || this.get('defaultTheme');
  }.property('storedTheme','defaultTheme'),
  themes: ["dark","light"],
  updateCurrentTheme: function() {
    var self = this;
    Ember.run.schedule('afterRender', function(){
      $('html').removeClass().addClass(self.get('currentTheme'));
    });
    //store
    localStorage.setItem('dasht-theme', self.get('currentTheme'));

  }.observes('currentTheme'),
  year: moment('date', 'YYYY'),
  isCurrentPath: function(path) {
    console.log(this.get('currentPath'));
  }.property(),
  init: function() {
    this.updateCurrentTheme(this.get('currentTheme'));
  },
  actions: {
    updateTheme: function(theme) {
      this.set('currentTheme', theme);
    },
    mainClick: function(ev) {
      //re-think this
      this.set('menuOpen', false);
    }
  }
});
