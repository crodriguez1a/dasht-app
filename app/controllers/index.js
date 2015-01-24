import Ember from 'ember';
//import _ from 'lodash';

export default Ember.Controller.extend({
  needs: ['application'],
  editing: false,
  filtering: false,
  cachedFilters: null,
  currentlyFiltered: Ember.computed.notEmpty('cachedFilters'),
  saveToLocal: function(model) {
    localStorage.setItem("dasht-channels", JSON.stringify(model));
  },
  toggleChannel: function(channel, bool) {

    var currentModel = this.get('controllers.application').get('model'),
        found;
    if(currentModel && currentModel.library) {
      found = currentModel.library.findBy('title', channel);
      found.set('visible', bool);
      this.saveToLocal(currentModel);
    }
  },
  actions: {
    editDash: function() {
      this.toggleProperty('editing');
    },
    hideChannel: function(channel) {
      this.toggleChannel(channel, false);
    },
    toggleFilters: function() {
      this.toggleProperty('filtering');
    }
  }
});
