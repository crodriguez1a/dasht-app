import Ember from 'ember';

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
    return localStorage.getItem('dasht-theme') || this.get('attrs.defaultTheme');
  }.property('attrs.defaultTheme'),

  /**
    Apply chosen theme to the <html> [data-theme] attribute

    @method updateCurrentTheme
    @param {String} theme The site theme
  */
  updateCurrentTheme: function(theme) {
    localStorage.setItem('dasht-theme', theme);

    Ember.run.scheduleOnce('afterRender', this, function() {
      document.querySelector('html').dataset.theme = theme;
    });
  }.observes('currentTheme'),

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
      localStorage.removeItem('dasht-theme');
      localStorage.removeItem('dasht-channels');
    }
  }
});
