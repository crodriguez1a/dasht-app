import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    willTransition: function() {
      //hide menu
      this.controllerFor('application').set('menuOpen', false);
      //toggle editing off
      this.controllerFor('index').set('editing', false);
      //re-set find channel error to null
      this.controller.setProperties({
        //error: false,
        //message: null
      });
    }
  }
});
