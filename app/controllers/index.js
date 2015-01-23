import Ember from 'ember';
//import _ from 'lodash';

export default Ember.Controller.extend({
  needs: ['application'],
  editing: false,
  toggleChannel: function(channel, bool) {

    var currentModel = this.get('controllers.application').get('model'),
        found;

    if(currentModel && currentModel.library) {
      found = currentModel.library.findBy('title', channel);
      found.set('visible', bool);
      //figure out how to move this to an oberver
      localStorage.setItem("dasht-channels", JSON.stringify(currentModel));
    }
  },
  actions: {
    editDash: function() {
      this.toggleProperty('editing');
    },
    hideChannel: function(channel) {
      this.toggleChannel(channel, false);
    }

  }
});
