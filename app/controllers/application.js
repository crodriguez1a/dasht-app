import Ember from 'ember';
import { moment } from 'ember-moment/computed';

/**
* Application controller
*
* @class ApplicationController
* @extends Ember.Controller
* @namespace Dasht
* @returns Class
*/

export default Ember.Controller.extend({
  /**
  Signal if menu is open

  @property menuOpen
  @type Bool
  @default false
  */
  menuOpen: false,
  /**
  Signal if themes options are open

  @property themesOpen
  @type Bool
  @default false
  */
  themesOpen: false,
  /**
  Retrive theme choice from local storage

  @property storedTheme
  @type String
  */
  storedTheme: function() {
    return localStorage.getItem('dasht-theme');
  }.property(),
  /**
  Set default theme

  @property defaultTheme
  @type String
  @default dark
  */
  defaultTheme: "dark",
  /**
  Retrieve stored theme or default

  @property currentTheme
  @type String
  */
  currentTheme: function() {
    return this.get('storedTheme') || this.get('defaultTheme');
  }.property('storedTheme','defaultTheme'),
  /**
  Available themes

  @property themes
  @type Array
  @default dark,light
  */
  themes: ["dark","light"],
  /**
  Current year for footer

  @property year
  @type String
  */
  year: moment('date', 'YYYY'),
  /**
  Apply chosen theme to html tag

  @method updateCurrentTheme
  */
  updateCurrentTheme: function() {
    var self = this;
    Ember.run.schedule('afterRender', function(){
      Ember.$('html')
      .removeClass('dark')
      .removeClass('light') //only remove theme classes (device classes have been applied by device.js)
      .addClass(self.get('currentTheme'));
    });
    //store
    localStorage.setItem('dasht-theme', self.get('currentTheme'));

  }.observes('currentTheme'),
  /**
  Ensure currently stored (or default) theme is applied

  @method init
  */
  init: function() {
    this.updateCurrentTheme(this.get('currentTheme'));
  },
  actions: {
    /**
    Action to update theme

    @method updateTheme
    */
    updateTheme: function(theme) {
      this.set('currentTheme', theme);
    },
    /**
    Action to reveal theme options

    @method revealTheme
    */
    toggleThemes: function() {
      this.toggleProperty('themesOpen');
    },
    /**
    Dev only - quickly clear local storage for testing

    @method clearLocalStorage
    */
    clearLocalStorage: function() {
      localStorage.removeItem('dasht-theme');
      localStorage.removeItem('dasht-channels');
    }
  }
});
