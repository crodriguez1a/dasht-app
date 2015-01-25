import Ember from 'ember';

/**
* Add route
*
* @class AddRoute
* @extends Ember.Route
* @namespace Dasht
* @returns Class
*/

export default Ember.Route.extend({
  actions: {
    /**
    Close any open blocks

    @method willTransition
    */
    willTransition: function() {
      //hide menu
      this.controllerFor('application').set('menuOpen', false);
      //toggle editing off
      this.controllerFor('index').set('editing', false);
    }
  }
});
