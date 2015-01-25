import Ember from 'ember';

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
