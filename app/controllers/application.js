import Ember from 'ember';
import { moment } from 'ember-moment/computed';

export default Ember.Controller.extend({
  menuOpen: false,
  storedTheme: function() {
    return localStorage.getItem('dasht-theme');
  }.property(),
  defaultTheme: "dark",
  currentTheme: function() {
    return this.get('storedTheme') || this.get('defaultTheme');
  }.property('storedTheme','defaultTheme'),
  themes: ["dark","light"],
  updateCurrentTheme: function() {
    var self = this;
    Ember.run.schedule('afterRender', function(){
      $('html')
      .removeClass('dark')
      .removeClass('light')
      .addClass(self.get('currentTheme'));
    });
    //store
    localStorage.setItem('dasht-theme', self.get('currentTheme'));

  }.observes('currentTheme'),
  year: moment('date', 'YYYY'),
  init: function() {
    this.updateCurrentTheme(this.get('currentTheme'));
  },
  actions: {
    updateTheme: function(theme) {
      this.set('currentTheme', theme);
    },
    clearLocalStorage: function() {
      localStorage.removeItem('dasht-theme');
      localStorage.removeItem('dasht-channels');
    }
  }
});
