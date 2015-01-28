import Ember from 'ember';

/**
  App Header component

  Used to interact with the application header

  @class AppHeaderComponent
*/
export default Ember.Component.extend({
  actions: {
    toggleMenu: function() {
      this.sendAction('onToggleMenu');
    },
    toggleTheme: function() {
      this.sendAction('onToggleThemeMenu');
    },
    updateTheme: function(theme) {
      this.sendAction('onUpdateTheme', theme);
    },
  }
});
