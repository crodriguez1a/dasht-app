import Ember from 'ember';

/**
* Index route
*
* @class IndexRoute
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
      this.controllerFor('application').set('menuOpen', false);
    }
  }
});
