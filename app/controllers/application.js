import Ember from 'ember';
import { hasLocalStorage } from 'dasht/utils/feature-detect';

/**
  Application controller

  @class ApplicationController
*/
export default Ember.Controller.extend({
  attrs: {
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
      Set default theme

      @property defaultTheme
      @type String
      @default dark
    */
    defaultTheme: 'dark',

    /**
      Available themes array

      @property themes
      @type Array
    */
    availableThemes: ['dark', 'light']
  },

  /**
    Ensure currently stored (or default) theme is applied

    @method setInitialTheme
  */
  setInitialTheme: function() {
    this.updateCurrentTheme(this.get('currentTheme'));
  }.on('init'),

  /**
    Retrieve localStorage saved theme or the default theme

    @property currentTheme
  */
  currentTheme: function() {
    var defaultTheme = this.get('attrs.defaultTheme');

    if (!hasLocalStorage) { return defaultTheme; }

    return localStorage.getItem('dasht-theme') || defaultTheme;
  }.property('attrs.defaultTheme'),

  /**
    Apply chosen theme to the <html> [data-theme] attribute

    @method updateCurrentTheme
    @param {String} theme The site theme
  */
  updateCurrentTheme: function(theme) {
    if (hasLocalStorage) {
      localStorage.setItem('dasht-theme', theme);
    }

    Ember.run.scheduleOnce('afterRender', this, function() {
      document.querySelector('html').dataset.theme = theme;
    });
  }.observes('currentTheme'),

  /**
    Flash messaging

    @method addSuccessMessage, addWarningMessage, addInfoMessage, addDangerMessage
  */
  addSuccessMessage: function(msg, time) {
    Ember.get(this, 'flashes').success(msg, time || 3000);
  },
  addWarningMessage: function(msg, time) {
    Ember.get(this, 'flashes').warning(msg, time || 3000);
  },
  addInfoMessage: function(msg, time) {
    Ember.get(this, 'flashes').info(msg, time || 3000);
  },
  addDangerMessage: function(msg, time) {
    Ember.get(this, 'flashes').danger(msg, time || 3000);
  },

  actions: {
    /**
      Action to toggle the app header menu

      @method toggleMenu
    */
    toggleMenu: function() {
      this.toggleProperty('attrs.menuOpen');
    },
    /**
      Action to reveal theme options

      @method toggleThemeMenu
    */
    toggleThemeMenu: function() {
      this.toggleProperty('attrs.themesOpen');
    },
    /**
      Action to update the site theme

      @method updateTheme
      @param {String} theme The updated site theme
    */
    updateTheme: function(theme) {
      this.updateCurrentTheme(theme);
    },
    /**
      Dev only - quickly clear local storage for testing

      @method clearLocalStorage
    */
    clearLocalStorage: function() {
      if (hasLocalStorage) {
        localStorage.removeItem('dasht-theme');
        localStorage.removeItem('dasht-channels');
      }
    }
  }
});
